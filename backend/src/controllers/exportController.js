import Tour from "../models/Tour.js";
import { buildToursExcel, buildToursPdf } from "../services/exportService.js";

const buildExportFilters = ({ search, fecha, status, sortBy = "fecha", order = "asc" }) => {
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

export const exportExcel = async (req, res, next) => {
  try {
    const { query, sort } = buildExportFilters(req.query);
    const tours = await Tour.find(query).sort(sort).lean();
    const buffer = await buildToursExcel(tours);

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="off-road-izamal-reservaciones.xlsx"'
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buffer);
  } catch (error) {
    next(error);
  }
};

export const exportPdf = async (req, res, next) => {
  try {
    const { query, sort } = buildExportFilters(req.query);
    const tours = await Tour.find(query).sort(sort).lean();
    const buffer = await buildToursPdf(tours);

    res.setHeader("Content-Disposition", 'attachment; filename="off-road-izamal-reservaciones.pdf"');
    res.setHeader("Content-Type", "application/pdf");
    res.send(buffer);
  } catch (error) {
    next(error);
  }
};
