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
    contraseña: {
      type: String,
      required: true,
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
