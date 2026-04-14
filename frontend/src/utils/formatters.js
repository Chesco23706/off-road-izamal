export const currency = (value) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2
  }).format(Number(value || 0));

export const prettyTourType = (type) => {
  const labels = {
    individual: "Individual",
    doble: "Doble",
    grupal: "Grupal"
  };

  return labels[type] || type;
};
