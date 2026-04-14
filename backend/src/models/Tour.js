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
    tipoTour: {
      type: String,
      enum: ["individual", "doble", "grupal"],
      required: true,
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

tourSchema.index({ fecha: 1, hora: 1 }, { unique: true });

const Tour = mongoose.model("Tour", tourSchema);

export default Tour;
