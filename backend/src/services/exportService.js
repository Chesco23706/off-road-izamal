import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";

const formatTourType = (type) => {
  const labels = {
    city_tours: "City Tours",
    tour_ebula: "Tour Ebula/Sacala",
    tour_fogata: "Tour con fogata",
    extra: "Extra"
  };

  return labels[type] || type;
};

export const buildToursExcel = async (tours) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Reservaciones");

  worksheet.columns = [
    { header: "Cliente", key: "nombreCliente", width: 28 },
    { header: "Fecha", key: "fecha", width: 14 },
    { header: "Hora", key: "hora", width: 12 },
    { header: "ATVs", key: "cantidadAtvs", width: 10 },
    { header: "Tipo", key: "tipoTour", width: 15 },
    { header: "Extra", key: "extra", width: 24 },
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
    const startX = 30;
    const rowHeight = 22;
    const colWidths = [88, 55, 42, 35, 82, 70, 55, 55, 55, 52];
    const headers = ["Cliente", "Fecha", "Hora", "ATVs", "Tipo", "Extra", "Abono", "Total", "Saldo", "Status"];
    const pageBottom = 780;

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));

    doc.fontSize(22).fillColor("#000000").text("Off Road Izamal", { continued: true });
    doc.fillColor("#FFC300").text(" - Reporte de Reservaciones");
    doc.moveDown();

    const drawRow = (y, values, isHeader = false) => {
      let currentX = startX;

      values.forEach((value, index) => {
        doc
          .lineWidth(0.5)
          .strokeColor("#2A2A2A")
          .rect(currentX, y, colWidths[index], rowHeight)
          .fillAndStroke(isHeader ? "#FFC300" : "#FFFFFF", "#2A2A2A");

        doc
          .fillColor(isHeader ? "#000000" : "#1C1C1C")
          .font(isHeader ? "Helvetica-Bold" : "Helvetica")
          .fontSize(isHeader ? 9 : 8)
          .text(String(value ?? "-"), currentX + 4, y + 6, {
            width: colWidths[index] - 8,
            height: rowHeight - 6,
            ellipsis: true
          });

        currentX += colWidths[index];
      });
    };

    let currentY = 95;
    drawRow(currentY, headers, true);
    currentY += rowHeight;

    if (tours.length === 0) {
      drawRow(currentY, ["Sin datos", "-", "-", "-", "-", "-", "-", "-", "-", "-"]);
    } else {
      tours.forEach((tour) => {
        if (currentY + rowHeight > pageBottom) {
          doc.addPage({ margin: 30, size: "A4" });
          currentY = 40;
          drawRow(currentY, headers, true);
          currentY += rowHeight;
        }

        drawRow(currentY, [
          tour.nombreCliente,
          tour.fecha,
          tour.hora,
          tour.cantidadAtvs,
          formatTourType(tour.tipoTour),
          tour.extra || "-",
          `$${tour.abono}`,
          `$${tour.total}`,
          `$${tour.restante}`,
          tour.status
        ]);
        currentY += rowHeight;
      });
    }

    doc.end();
  });
