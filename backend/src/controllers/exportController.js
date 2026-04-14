import Tour from "../models/Tour.js";
import { buildToursExcel, buildToursPdf } from "../services/exportService.js";

export const exportExcel = async (_req, res, next) => {
  try {
    const tours = await Tour.find().sort({ fecha: 1, hora: 1 }).lean();
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

export const exportPdf = async (_req, res, next) => {
  try {
    const tours = await Tour.find().sort({ fecha: 1, hora: 1 }).lean();
    const buffer = await buildToursPdf(tours);

    res.setHeader("Content-Disposition", 'attachment; filename="off-road-izamal-reservaciones.pdf"');
    res.setHeader("Content-Type", "application/pdf");
    res.send(buffer);
  } catch (error) {
    next(error);
  }
};
