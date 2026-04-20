import mongoose from "mongoose";

const tourSchema = new mongoose.Schema(
  {
    nombreCliente: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    fecha: {
      type: String,
      required: true,
    },
    hora: {
      type: String,
      required: true,
    },
    cantidadAtvs: {
      type: Number,
      required: true,
      min: 1,
    },
    tipoTour: {
      type: String,
      enum: ["city_tours", "tour_ebula", "tour_fogata", "extra"],
      required: true,
    },
    extra: {
      type: String,
      trim: true,
      maxlength: 120,
      default: "",
    },
    abono: {
      type: Number,
      required: true,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    restante: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["Pagado", "Pendiente"],
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

tourSchema.index({ fecha: 1, hora: 1 });

const Tour = mongoose.model("Tour", tourSchema);

export default Tour;
