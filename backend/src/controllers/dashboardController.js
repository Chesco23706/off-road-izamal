import Tour from "../models/Tour.js";

const getToday = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: process.env.APP_TIMEZONE || "America/Mexico_City"
  }).format(new Date());

export const getDashboardSummary = async (_req, res, next) => {
  try {
    const today = getToday();
    const [totals, toursDelDia, proximosTours] = await Promise.all([
      Tour.aggregate([
        {
          $group: {
            _id: null,
            totalGanado: { $sum: "$abono" },
            pendientes: {
              $sum: { $cond: [{ $eq: ["$status", "Pendiente"] }, 1, 0] },
            },
            pagados: {
              $sum: { $cond: [{ $eq: ["$status", "Pagado"] }, 1, 0] },
            },
          },
        },
      ]),
      Tour.countDocuments({ fecha: today }),
      Tour.find().sort({ fecha: 1, hora: 1 }).limit(5).lean(),
    ]);

    const summary = totals[0] || {
      totalGanado: 0,
      pendientes: 0,
      pagados: 0,
    };

    res.json({
      totalGanado: summary.totalGanado,
      toursDelDia,
      pendientes: summary.pendientes,
      pagados: summary.pagados,
      proximosTours,
    });
  } catch (error) {
    next(error);
  }
};
