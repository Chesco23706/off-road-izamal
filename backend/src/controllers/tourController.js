import Tour from "../models/Tour.js";
import { buildTourFinance, validateTourPayload } from "../utils/tourUtils.js";

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

  const allowedSorts = ["fecha", "hora", "nombreCliente", "tipoTour", "status", "createdAt"];
  const field = allowedSorts.includes(sortBy) ? sortBy : "fecha";
  const direction = order === "desc" ? -1 : 1;

  return { query, sort: { [field]: direction, hora: 1 } };
};

export const getTours = async (req, res, next) => {
  try {
    const { query, sort } = buildFilters(req.query);
    const tours = await Tour.find(query).sort(sort);

    res.json(tours);
  } catch (error) {
    next(error);
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

    const tour = await Tour.create({
      nombreCliente: req.body.nombreCliente.trim(),
      fecha: req.body.fecha,
      hora: req.body.hora,
      tipoTour: req.body.tipoTour,
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

    const tour = await Tour.findByIdAndUpdate(
      req.params.id,
      {
        nombreCliente: req.body.nombreCliente.trim(),
        fecha: req.body.fecha,
        hora: req.body.hora,
        tipoTour: req.body.tipoTour,
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
