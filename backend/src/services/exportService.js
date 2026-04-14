import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";

export const buildToursExcel = async (tours) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Reservaciones");

  worksheet.columns = [
    { header: "Cliente", key: "nombreCliente", width: 28 },
    { header: "Fecha", key: "fecha", width: 14 },
    { header: "Hora", key: "hora", width: 12 },
    { header: "Tipo", key: "tipoTour", width: 15 },
    { header: "Abono", key: "abono", width: 12 },
    { header: "Total", key: "total", width: 12 },
    { header: "Restante", key: "restante", width: 12 },
    { header: "Status", key: "status", width: 14 },
  ];

  worksheet.getRow(1).font = { bold: true, color: { argb: "FF000000" } };
  worksheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFFC300" },
  };

  tours.forEach((tour) => worksheet.addRow(tour));

  return workbook.xlsx.writeBuffer();
};

export const buildToursPdf = (tours) =>
  new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 30, size: "A4" });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));

    doc.fontSize(22).fillColor("#000000").text("Off Road Izamal", { continued: true });
    doc.fillColor("#FFC300").text(" - Reporte de Reservaciones");
    doc.moveDown();

    tours.forEach((tour, index) => {
      doc
        .fontSize(12)
        .fillColor("#1C1C1C")
        .text(
          `${index + 1}. ${tour.nombreCliente} | ${tour.fecha} ${tour.hora} | ${tour.tipoTour} | Abono: $${tour.abono} | Total: $${tour.total} | Restante: $${tour.restante} | ${tour.status}`
        );
      doc.moveDown(0.4);
    });

    doc.end();
  });
