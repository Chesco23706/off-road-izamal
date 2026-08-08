import bcrypt from "bcryptjs";
import { findUserByUsername } from "../repositories/userRepository.js";
import generateToken from "../utils/token.js";

const legacyMojibakePasswordKey = "contrase" + String.fromCharCode(195, 177) + "a";

const getRequestPassword = (body) => body.password || body.contraseña || body[legacyMojibakePasswordKey];

const getStoredPassword = (user) => user.password || user.contraseña || user[legacyMojibakePasswordKey];

export const login = async (req, res, next) => {
  try {
    const { usuario } = req.body;
    const password = getRequestPassword(req.body);

    if (!usuario || !password) {
      const error = new Error("Usuario y contraseña son obligatorios");
      error.statusCode = 400;
      throw error;
    }

    const user = await findUserByUsername(usuario);

    if (!user) {
      const error = new Error("Credenciales invalidas");
      error.statusCode = 401;
      throw error;
    }

    const storedPassword = getStoredPassword(user);

    if (!storedPassword) {
      const error = new Error("El usuario no tiene contraseña configurada");
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, storedPassword);

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
