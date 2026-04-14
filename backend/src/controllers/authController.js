import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/token.js";

export const login = async (req, res, next) => {
  try {
    const { usuario, contraseña } = req.body;

    if (!usuario || !contraseña) {
      const error = new Error("Usuario y contraseña son obligatorios");
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findOne({ usuario });

    if (!user) {
      const error = new Error("Credenciales invalidas");
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(contraseña, user.contraseña);

    if (!isMatch) {
      const error = new Error("Credenciales invalidas");
      error.statusCode = 401;
      throw error;
    }

    res.json({
      token: generateToken(user),
      user: {
        id: user._id,
        usuario: user.usuario,
        rol: user.rol,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res) => {
  res.json({
    user: req.user,
  });
};
