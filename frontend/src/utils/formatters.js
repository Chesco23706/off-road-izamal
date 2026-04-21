export const currency = (value) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2
  }).format(Number(value || 0));

export const prettyTourType = (type) => {
  const labels = {
    city_tours: "City Tours",
    tour_ebula: "Tour Ebula/Sacala",
    tour_fogata: "Tour con fogata",
    extra: "Extra"
  };

  return labels[type] || type;
};
