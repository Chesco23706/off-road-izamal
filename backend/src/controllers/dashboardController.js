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

const getMonthRange = (month) => {
  if (!/^\d{4}-\d{2}$/.test(month || "")) {
    const error = new Error("El mes debe tener formato YYYY-MM");
    error.statusCode = 400;
    throw error;
  }

  const [year, monthNumber] = month.split("-").map(Number);
  const nextMonth = monthNumber === 12 ? 1 : monthNumber + 1;
  const nextYear = monthNumber === 12 ? year + 1 : year;
  const start = `${year}-${String(monthNumber).padStart(2, "0")}-01`;
  const end = `${nextYear}-${String(nextMonth).padStart(2, "0")}-01`;
  const daysInMonth = new Date(year, monthNumber, 0).getDate();

  return { start, end, daysInMonth };
};

export const getMonthlyEarnings = async (req, res, next) => {
  try {
    const month = req.query.month || getToday().slice(0, 7);
    const { start, end, daysInMonth } = getMonthRange(month);
    const match = { fecha: { $gte: start, $lt: end } };

    const [summary, daily, byType, byStatus] = await Promise.all([
      Tour.aggregate([
        { $match: match },
        {
          $group: {
            _id: null,
            totalGanado: { $sum: "$abono" },
            totalFacturado: { $sum: "$total" },
            totalPendiente: { $sum: "$restante" },
            tours: { $sum: 1 },
            atvs: { $sum: "$cantidadAtvs" },
          },
        },
      ]),
      Tour.aggregate([
        { $match: match },
        {
          $group: {
            _id: "$fecha",
            totalGanado: { $sum: "$abono" },
            tours: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Tour.aggregate([
        { $match: match },
        {
          $group: {
            _id: "$tipoTour",
            totalGanado: { $sum: "$abono" },
            tours: { $sum: 1 },
          },
        },
        { $sort: { totalGanado: -1 } },
      ]),
      Tour.aggregate([
        { $match: match },
        {
          $group: {
            _id: "$status",
            totalGanado: { $sum: "$abono" },
            tours: { $sum: 1 },
          },
        },
      ]),
    ]);

    const dailyMap = new Map(daily.map((day) => [day._id, day]));
    const dailySeries = Array.from({ length: daysInMonth }, (_, index) => {
      const dayNumber = index + 1;
      const date = `${month}-${String(dayNumber).padStart(2, "0")}`;
      const item = dailyMap.get(date);

      return {
        date,
        day: dayNumber,
        totalGanado: item?.totalGanado || 0,
        tours: item?.tours || 0,
      };
    });

    res.json({
      month,
      summary: summary[0] || {
        totalGanado: 0,
        totalFacturado: 0,
        totalPendiente: 0,
        tours: 0,
        atvs: 0,
      },
      daily: dailySeries,
      byType: byType.map((item) => ({
        tipoTour: item._id,
        totalGanado: item.totalGanado,
        tours: item.tours,
      })),
      byStatus: byStatus.map((item) => ({
        status: item._id,
        totalGanado: item.totalGanado,
        tours: item.tours,
      })),
    });
  } catch (error) {
    next(error);
  }
};
