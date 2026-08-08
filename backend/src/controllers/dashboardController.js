import {
  getDashboardSummaryData,
  getMonthlyEarningsData,
} from "../repositories/tourRepository.js";

const getToday = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: process.env.APP_TIMEZONE || "America/Mexico_City"
  }).format(new Date());

export const getDashboardSummary = async (_req, res, next) => {
  try {
    const today = getToday();
    const summary = await getDashboardSummaryData(today);

    res.json(summary);
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
    const earnings = await getMonthlyEarningsData({ month, start, end, daysInMonth });

    res.json({
      month,
      ...earnings,
    });
  } catch (error) {
    next(error);
  }
};
