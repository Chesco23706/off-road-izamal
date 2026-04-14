export const normalizeMoney = (value) => Number(Number(value || 0).toFixed(2));

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

export const validateTourPayload = ({ nombreCliente, fecha, hora, tipoTour, abono, total }) => {
  if (!nombreCliente?.trim()) {
    return "El nombre del cliente es obligatorio";
  }

  if (!fecha) {
    return "La fecha del tour es obligatoria";
  }

  if (!hora) {
    return "La hora del tour es obligatoria";
  }

  if (!["individual", "doble", "grupal"].includes(tipoTour)) {
    return "El tipo de tour no es valido";
  }

  if (Number(total) < 0 || Number(abono) < 0) {
    return "Los montos no pueden ser negativos";
  }

  if (Number(abono) > Number(total)) {
    return "El abono no puede ser mayor al total";
  }

  return null;
};
