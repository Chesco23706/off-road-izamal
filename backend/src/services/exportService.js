import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";

const formatTourType = (type) => {
  const labels = {
    city_tours: "Tour por la ciudad",
    tour_ebula: "Tour Ebula/Sacala",
    tour_fogata: "Tour con fogata",
    extra: "Personalizado",
  };

  return labels[type] || type;
};

const getLogoPath = () => {
  const candidatePaths = [
    path.resolve(process.cwd(), "../frontend/public/logo.jpg"),
    path.resolve(process.cwd(), "../../frontend/public/logo.jpg"),
  ];

  return candidatePaths.find((candidate) => fs.existsSync(candidate));
};

export const buildToursExcel = async (tours) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Reservaciones");

  worksheet.columns = [
    { header: "Cliente", key: "nombreCliente", width: 28 },
    { header: "Fecha", key: "fecha", width: 14 },
    { header: "Hora", key: "hora", width: 12 },
    { header: "ATVs", key: "cantidadAtvs", width: 10 },
    { header: "Tipo", key: "tipoTour", width: 22 },
    { header: "Extra", key: "extra", width: 24 },
    { header: "Abono", key: "abono", width: 12 },
    { header: "Total", key: "total", width: 12 },
    { header: "Saldo", key: "restante", width: 12 },
    { header: "Estado", key: "status", width: 14 },
  ];

  worksheet.getRow(1).font = { bold: true, color: { argb: "FF000000" } };
  worksheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFFC300" },
  };

  tours.forEach((tour) =>
    worksheet.addRow({
      ...tour,
      tipoTour: formatTourType(tour.tipoTour),
    })
  );

  return workbook.xlsx.writeBuffer();
};

export const buildToursPdf = (tours) =>
  new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 26, size: "A4", layout: "landscape" });
    const chunks = [];
    const startX = 26;
    const rowHeight = 24;
    const colWidths = [150, 64, 52, 42, 110, 95, 58, 58, 58, 58];
    const headers = [
      "Cliente",
      "Fecha",
      "Hora",
      "ATVs",
      "Tipo",
      "Extra",
      "Abono",
      "Total",
      "Saldo",
      "Estado",
    ];
    const pageBottom = 545;
    const logoPath = getLogoPath();

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));

    if (logoPath) {
      doc.image(logoPath, startX, 18, { fit: [64, 64] });
    }

    doc.fillColor("#111111").font("Helvetica-Bold").fontSize(22).text("Off Road Izamal", 100, 24);
    doc.fillColor("#555555").font("Helvetica").fontSize(11).text("Reporte de reservaciones", 100, 50);
    doc
      .strokeColor("#D4A300")
      .lineWidth(2)
      .moveTo(startX, 92)
      .lineTo(810, 92)
      .stroke();

    const drawRow = (y, values, isHeader = false) => {
      let currentX = startX;

      values.forEach((value, index) => {
        doc
          .lineWidth(0.5)
          .strokeColor(isHeader ? "#C7A20A" : "#D6D6D6")
          .rect(currentX, y, colWidths[index], rowHeight)
          .fillAndStroke(
            isHeader ? "#FFC300" : index % 2 === 0 ? "#FAFAFA" : "#F1F1F1",
            isHeader ? "#C7A20A" : "#D6D6D6"
          );

        doc
          .fillColor(isHeader ? "#000000" : "#1C1C1C")
          .font(isHeader ? "Helvetica-Bold" : "Helvetica")
          .fontSize(isHeader ? 9 : 8)
          .text(String(value ?? "-"), currentX + 4, y + 7, {
            width: colWidths[index] - 8,
            height: rowHeight - 6,
            ellipsis: true,
          });

        currentX += colWidths[index];
      });
    };

    let currentY = 106;
    drawRow(currentY, headers, true);
    currentY += rowHeight;

    if (tours.length === 0) {
      drawRow(currentY, ["Sin datos", "-", "-", "-", "-", "-", "-", "-", "-", "-"]);
    } else {
      tours.forEach((tour) => {
        if (currentY + rowHeight > pageBottom) {
          doc.addPage({ margin: 26, size: "A4", layout: "landscape" });
          currentY = 34;
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
          tour.status,
        ]);

        currentY += rowHeight;
      });
    }

    doc.end();
  });
