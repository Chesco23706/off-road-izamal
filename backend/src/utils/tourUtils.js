export const normalizeMoney = (value) => Number(Number(value || 0).toFixed(2));

export const ATV_CAPACITY = 12;
export const TOUR_BLOCK_HOURS = 3;

export const timeToMinutes = (time) => {
  const [hours, minutes] = String(time || "00:00")
    .split(":")
    .map((value) => Number(value));

  return hours * 60 + minutes;
};

export const hasTimeOverlap = (startA, endA, startB, endB) => startA < endB && startB < endA;

export const buildTourFinance = ({ abono, total }) => {
  const normalizedAbono = normalizeMoney(abono);
  const normalizedTotal = normalizeMoney(total);
  const restante = normalizeMoney(Math.max(normalizedTotal - normalizedAbono, 0));
  const status = restante === 0 ? "Pagado" : "Pendiente";

  return {
    abono: normalizedAbono,
    total: normalizedTotal,
    restante,
    status,
  };
};

export const validateTourPayload = ({
  nombreCliente,
  fecha,
  hora,
  cantidadAtvs,
  tipoTour,
  extra,
  abono,
  total
}) => {
  if (!nombreCliente?.trim()) {
    return "El nombre del cliente es obligatorio";
  }

  if (!fecha) {
    return "La fecha del tour es obligatoria";
  }

  if (!hora) {
    return "La hora del tour es obligatoria";
  }

  if (!Number.isInteger(Number(cantidadAtvs)) || Number(cantidadAtvs) < 1) {
    return "La cantidad de ATVs debe ser al menos 1";
  }

  if (!["city_tours", "tour_ebula", "tour_fogata", "extra"].includes(tipoTour)) {
    return "El tipo de tour no es valido";
  }

  if (tipoTour === "extra" && !extra?.trim()) {
    return "Debes indicar el detalle del tour extra";
  }

  if (Number(total) < 0 || Number(abono) < 0) {
    return "Los montos no pueden ser negativos";
  }

  if (Number(abono) > Number(total)) {
    return "El abono no puede ser mayor al total";
  }

  return null;
};
