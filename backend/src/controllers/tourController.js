import Tour from "../models/Tour.js";
import {
  ATV_CAPACITY,
  TOUR_BLOCK_HOURS,
  buildTourFinance,
  hasTimeOverlap,
  timeToMinutes,
  validateTourPayload
} from "../utils/tourUtils.js";

const getToday = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: process.env.APP_TIMEZONE || "America/Mexico_City"
  }).format(new Date());

const buildFilters = ({ search, fecha, status, sortBy = "fecha", order = "asc" }) => {
  const query = {};

  if (search) {
    query.nombreCliente = { $regex: search, $options: "i" };
  }

  if (fecha) {
    query.fecha = fecha;
  }

  if (status) {
    query.status = status;
  }

  const allowedSorts = [
    "fecha",
    "hora",
    "nombreCliente",
    "cantidadAtvs",
    "tipoTour",
    "status",
    "createdAt"
  ];
  const field = allowedSorts.includes(sortBy) ? sortBy : "fecha";
  const direction = order === "desc" ? -1 : 1;

  return { query, sort: { [field]: direction, hora: 1 } };
};

export const getTours = async (req, res, next) => {
  try {
    const { query, sort } = buildFilters(req.query);
    let select;

    if (req.user?.rol === "agenda") {
      query.fecha = { $gte: getToday() };
      select = "nombreCliente fecha hora cantidadAtvs tipoTour extra status";
    }

    const tours = await Tour.find(query).select(select).sort(sort).lean();

    res.json(tours);
  } catch (error) {
    next(error);
  }
};

const getAtvUsageForWindow = async ({ fecha, hora, excludeTourId }) => {
  const requestedStart = timeToMinutes(hora);
  const requestedEnd = requestedStart + TOUR_BLOCK_HOURS * 60;
  const query = { fecha };

  if (excludeTourId) {
    query._id = { $ne: excludeTourId };
  }

  const tours = await Tour.find(query).select("hora cantidadAtvs").lean();

  return tours.reduce((total, tour) => {
    const tourStart = timeToMinutes(tour.hora);
    const tourEnd = tourStart + TOUR_BLOCK_HOURS * 60;

    if (!hasTimeOverlap(requestedStart, requestedEnd, tourStart, tourEnd)) {
      return total;
    }

    return total + Number(tour.cantidadAtvs || 0);
  }, 0);
};

const assertAtvAvailability = async ({ fecha, hora, cantidadAtvs, excludeTourId }) => {
  const usedAtvs = await getAtvUsageForWindow({ fecha, hora, excludeTourId });
  const requestedAtvs = Number(cantidadAtvs);
  const availableAtvs = ATV_CAPACITY - usedAtvs;

  if (requestedAtvs > availableAtvs) {
    const error = new Error(
      `No hay suficientes ATVs disponibles. Para esa ventana de ${TOUR_BLOCK_HOURS} horas quedan ${Math.max(
        availableAtvs,
        0
      )} de ${ATV_CAPACITY}.`
    );
    error.statusCode = 409;
    throw error;
  }
};

export const createTour = async (req, res, next) => {
  try {
    const validationError = validateTourPayload(req.body);

    if (validationError) {
      const error = new Error(validationError);
      error.statusCode = 400;
      throw error;
    }

    const finance = buildTourFinance(req.body);

    await assertAtvAvailability({
      fecha: req.body.fecha,
      hora: req.body.hora,
      cantidadAtvs: req.body.cantidadAtvs,
    });

    const tour = await Tour.create({
      nombreCliente: req.body.nombreCliente.trim(),
      fecha: req.body.fecha,
      hora: req.body.hora,
      cantidadAtvs: Number(req.body.cantidadAtvs),
      tipoTour: req.body.tipoTour,
      extra: req.body.extra?.trim() || "",
      ...finance,
      createdBy: req.user._id,
    });

    res.status(201).json(tour);
  } catch (error) {
    if (error?.code === 11000) {
      error.message = "Ese horario ya esta reservado";
      error.statusCode = 409;
    }

    next(error);
  }
};

export const updateTour = async (req, res, next) => {
  try {
    const validationError = validateTourPayload(req.body);

    if (validationError) {
      const error = new Error(validationError);
      error.statusCode = 400;
      throw error;
    }

    const finance = buildTourFinance(req.body);

    await assertAtvAvailability({
      fecha: req.body.fecha,
      hora: req.body.hora,
      cantidadAtvs: req.body.cantidadAtvs,
      excludeTourId: req.params.id,
    });

    const tour = await Tour.findByIdAndUpdate(
      req.params.id,
      {
        nombreCliente: req.body.nombreCliente.trim(),
        fecha: req.body.fecha,
        hora: req.body.hora,
        cantidadAtvs: Number(req.body.cantidadAtvs),
        tipoTour: req.body.tipoTour,
        extra: req.body.extra?.trim() || "",
        ...finance,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!tour) {
      const error = new Error("Reservacion no encontrada");
      error.statusCode = 404;
      throw error;
    }

    res.json(tour);
  } catch (error) {
    if (error?.code === 11000) {
      error.message = "Ese horario ya esta reservado";
      error.statusCode = 409;
    }

    next(error);
  }
};

export const getAvailability = async (req, res, next) => {
  try {
    const { fecha, hora, excludeTourId } = req.query;

    if (!fecha || !hora) {
      const error = new Error("Fecha y hora son obligatorias para consultar disponibilidad");
      error.statusCode = 400;
      throw error;
    }

    const usedAtvs = await getAtvUsageForWindow({ fecha, hora, excludeTourId });
    const availableAtvs = Math.max(ATV_CAPACITY - usedAtvs, 0);

    res.json({
      fecha,
      hora,
      blockHours: TOUR_BLOCK_HOURS,
      capacity: ATV_CAPACITY,
      usedAtvs,
      availableAtvs,
      blocked: availableAtvs === 0,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTour = async (req, res, next) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    if (!tour) {
      const error = new Error("Reservacion no encontrada");
      error.statusCode = 404;
      throw error;
    }

    res.json({ message: "Reservacion eliminada correctamente" });
  } catch (error) {
    next(error);
  }
};

export const markAsPaid = async (req, res, next) => {
  try {
    const tour = await Tour.findById(req.params.id);

    if (!tour) {
      const error = new Error("Reservacion no encontrada");
      error.statusCode = 404;
      throw error;
    }

    tour.abono = tour.total;
    tour.restante = 0;
    tour.status = "Pagado";
    await tour.save();

    res.json(tour);
  } catch (error) {
    next(error);
  }
};
