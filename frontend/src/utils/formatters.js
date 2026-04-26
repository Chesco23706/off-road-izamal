export const currency = (value) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2
  }).format(Number(value || 0));

export const prettyTourType = (type) => {
  const labels = {
    city_tours: "Tour por la ciudad",
    tour_ebula: "Tour Ebula/Sacala",
    tour_fogata: "Tour con fogata",
    extra: "Personalizado"
  };

  return labels[type] || type;
};
