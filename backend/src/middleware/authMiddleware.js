import jwt from "jsonwebtoken";

export const protect = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const error = new Error("No autorizado");
      error.statusCode = 401;
      throw error;
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) {
      const error = new Error("Usuario no encontrado");
      error.statusCode = 401;
      throw error;
    }

    req.user = {
      _id: decoded.id,
      id: decoded.id,
      usuario: decoded.usuario,
      rol: decoded.rol,
    };
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      error.message = "Sesion expirada. Inicia sesion nuevamente.";
    }

    error.statusCode = error.statusCode || 401;
    next(error);
  }
};

export const authorize = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.rol)) {
    const error = new Error("No tienes permisos para esta accion");
    error.statusCode = 403;
    return next(error);
  }

  next();
};
