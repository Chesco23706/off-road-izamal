import Tour from "../models/Tour.js";

const getToday = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: process.env.APP_TIMEZONE || "America/Mexico_City"
  }).format(new Date());

export const getDashboardSummary = async (_req, res, next) => {
  try {
    const today = getToday();
    const tours = await Tour.find();
    const toursDelDia = tours.filter((tour) => tour.fecha === today);
    const totalGanado = tours.reduce((acc, tour) => acc + tour.abono, 0);
    const pendientes = tours.filter((tour) => tour.status === "Pendiente").length;
    const pagados = tours.filter((tour) => tour.status === "Pagado").length;

    res.json({
      totalGanado,
      toursDelDia: toursDelDia.length,
      pendientes,
      pagados,
      proximosTours: tours
        .sort((a, b) => `${a.fecha} ${a.hora}`.localeCompare(`${b.fecha} ${b.hora}`))
        .slice(0, 5),
    });
  } catch (error) {
    next(error);
  }
};
