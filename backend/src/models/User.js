import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    usuario: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 40,
    },
    password: {
      type: String,
      required: false,
    },
    // Legacy fields kept so old records can still log in after the migration.
    contraseña: {
      type: String,
      required: false,
    },
    contraseÃ±a: {
      type: String,
      required: false,
    },
    rol: {
      type: String,
      enum: ["admin", "empleado"],
      default: "empleado",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
