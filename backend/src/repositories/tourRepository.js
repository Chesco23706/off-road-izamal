import { randomUUID } from "node:crypto";
import { query } from "../config/db.js";

const toDateString = (value) => {
  if (!value) return value;
  if (typeof value === "string") return value.slice(0, 10);
  return value.toISOString().slice(0, 10);
};

const toTimeString = (value) => {
  if (!value) return value;
  return String(value).slice(0, 5);
};

const toNumber = (value) => Number(value || 0);

const toTour = (row) =>
  row
    ? {
        _id: row.id,
        id: row.id,
        nombreCliente: row.nombre_cliente,
        fecha: toDateString(row.fecha),
        hora: toTimeString(row.hora),
        cantidadAtvs: Number(row.cantidad_atvs || 0),
        tipoTour: row.tipo_tour,
        extra: row.extra || "",
        abono: toNumber(row.abono),
        total: toNumber(row.total),
        restante: toNumber(row.restante),
        status: row.status,
        createdBy: row.created_by,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }
    : null;

const buildWhere = ({ search, fecha, fromDate, status } = {}, params) => {
  const clauses = [];

  if (search) {
    params.push(`%${search.toLowerCase()}%`);
    clauses.push(`lower(nombre_cliente) like $${params.length}`);
  }

  if (fecha) {
    params.push(fecha);
    clauses.push(`fecha = $${params.length}`);
  } else if (fromDate) {
    params.push(fromDate);
    clauses.push(`fecha >= $${params.length}`);
  }

  if (status) {
    params.push(status);
    clauses.push(`status = $${params.length}`);
  }

  return clauses.length ? `where ${clauses.join(" and ")}` : "";
};

const sortColumns = {
  fecha: "fecha",
  hora: "hora",
  nombreCliente: "nombre_cliente",
  cantidadAtvs: "cantidad_atvs",
  tipoTour: "tipo_tour",
  status: "status",
  createdAt: "created_at",
};

const buildOrder = ({ sortBy = "fecha", order = "asc" } = {}) => {
  const column = sortColumns[sortBy] || "fecha";
  const direction = order === "desc" ? "desc" : "asc";
  return `order by ${column} ${direction}, hora asc`;
};

export const findTours = async (filters = {}) => {
  const params = [];
  const where = buildWhere(filters, params);
  const order = buildOrder(filters);
  const parsedLimit = Number(filters.limit);
  const limit = Number.isFinite(parsedLimit) ? Math.min(Math.max(parsedLimit, 1), 500) : null;
  const limitSql = limit ? `limit ${limit}` : "";
  const { rows } = await query(`select * from tours ${where} ${order} ${limitSql}`, params);
  return rows.map(toTour);
};

export const findToursForAvailability = async ({ fecha, excludeTourId }) => {
  const params = [fecha];
  const excludeSql = excludeTourId ? "and id <> $2" : "";

  if (excludeTourId) {
    params.push(excludeTourId);
  }

  const { rows } = await query(
    `select hora, cantidad_atvs from tours where fecha = $1 ${excludeSql}`,
    params
  );

  return rows.map(toTour);
};

export const createTourRecord = async (tour) => {
  const { rows } = await query(
    `
      insert into tours (
        id, nombre_cliente, fecha, hora, cantidad_atvs, tipo_tour, extra,
        abono, total, restante, status, created_by
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      returning *
    `,
    [
      tour.id || randomUUID(),
      tour.nombreCliente,
      tour.fecha,
      tour.hora,
      tour.cantidadAtvs,
      tour.tipoTour,
      tour.extra || "",
      tour.abono,
      tour.total,
      tour.restante,
      tour.status,
      tour.createdBy,
    ]
  );

  return toTour(rows[0]);
};

export const updateTourRecord = async (id, tour) => {
  const { rows } = await query(
    `
      update tours
      set nombre_cliente = $2,
          fecha = $3,
          hora = $4,
          cantidad_atvs = $5,
          tipo_tour = $6,
          extra = $7,
          abono = $8,
          total = $9,
          restante = $10,
          status = $11,
          updated_at = now()
      where id = $1
      returning *
    `,
    [
      id,
      tour.nombreCliente,
      tour.fecha,
      tour.hora,
      tour.cantidadAtvs,
      tour.tipoTour,
      tour.extra || "",
      tour.abono,
      tour.total,
      tour.restante,
      tour.status,
    ]
  );

  return toTour(rows[0]);
};

export const deleteTourRecord = async (id) => {
  const { rows } = await query("delete from tours where id = $1 returning *", [id]);
  return toTour(rows[0]);
};

export const findTourById = async (id) => {
  const { rows } = await query("select * from tours where id = $1 limit 1", [id]);
  return toTour(rows[0]);
};

export const markTourPaid = async (id) => {
  const { rows } = await query(
    `
      update tours
      set abono = total,
          restante = 0,
          status = 'Pagado',
          updated_at = now()
      where id = $1
      returning *
    `,
    [id]
  );

  return toTour(rows[0]);
};

export const getDashboardSummaryData = async (today) => {
  const [totals, toursDelDia, proximosTours] = await Promise.all([
    query(
      `
        select
          coalesce(sum(abono), 0)::float as total_ganado,
          count(*) filter (where status = 'Pendiente')::int as pendientes,
          count(*) filter (where status = 'Pagado')::int as pagados
        from tours
      `
    ),
    query("select count(*)::int as count from tours where fecha = $1", [today]),
    query("select * from tours order by fecha asc, hora asc limit 5"),
  ]);

  return {
    totalGanado: Number(totals.rows[0]?.total_ganado || 0),
    toursDelDia: Number(toursDelDia.rows[0]?.count || 0),
    pendientes: Number(totals.rows[0]?.pendientes || 0),
    pagados: Number(totals.rows[0]?.pagados || 0),
    proximosTours: proximosTours.rows.map(toTour),
  };
};

export const getMonthlyEarningsData = async ({ month, start, end, daysInMonth }) => {
  const [summary, daily, byType, byStatus] = await Promise.all([
    query(
      `
        select
          coalesce(sum(abono), 0)::float as total_ganado,
          coalesce(sum(total), 0)::float as total_facturado,
          coalesce(sum(restante), 0)::float as total_pendiente,
          count(*)::int as tours,
          coalesce(sum(cantidad_atvs), 0)::int as atvs
        from tours
        where fecha >= $1 and fecha < $2
      `,
      [start, end]
    ),
    query(
      `
        select fecha, coalesce(sum(abono), 0)::float as total_ganado, count(*)::int as tours
        from tours
        where fecha >= $1 and fecha < $2
        group by fecha
        order by fecha asc
      `,
      [start, end]
    ),
    query(
      `
        select tipo_tour, coalesce(sum(abono), 0)::float as total_ganado, count(*)::int as tours
        from tours
        where fecha >= $1 and fecha < $2
        group by tipo_tour
        order by total_ganado desc
      `,
      [start, end]
    ),
    query(
      `
        select status, coalesce(sum(abono), 0)::float as total_ganado, count(*)::int as tours
        from tours
        where fecha >= $1 and fecha < $2
        group by status
      `,
      [start, end]
    ),
  ]);

  const dailyMap = new Map(daily.rows.map((day) => [toDateString(day.fecha), day]));
  const dailySeries = Array.from({ length: daysInMonth }, (_, index) => {
    const dayNumber = index + 1;
    const date = `${month}-${String(dayNumber).padStart(2, "0")}`;
    const item = dailyMap.get(date);

    return {
      date,
      day: dayNumber,
      totalGanado: Number(item?.total_ganado || 0),
      tours: Number(item?.tours || 0),
    };
  });

  const row = summary.rows[0] || {};

  return {
    summary: {
      totalGanado: Number(row.total_ganado || 0),
      totalFacturado: Number(row.total_facturado || 0),
      totalPendiente: Number(row.total_pendiente || 0),
      tours: Number(row.tours || 0),
      atvs: Number(row.atvs || 0),
    },
    daily: dailySeries,
    byType: byType.rows.map((item) => ({
      tipoTour: item.tipo_tour,
      totalGanado: Number(item.total_ganado || 0),
      tours: Number(item.tours || 0),
    })),
    byStatus: byStatus.rows.map((item) => ({
      status: item.status,
      totalGanado: Number(item.total_ganado || 0),
      tours: Number(item.tours || 0),
    })),
  };
};
