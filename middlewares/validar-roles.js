const { request } = require("express");

const esAdminRole = (req = request, res, next) => {
  if (!req.usuarioToken) {
    return res.status(500).json({
      msg: "se quiere verificar el role isn validar el token primero",
    });
  }

  const { rol, nombre } = req.usuarioToken;
  if (rol !== "ADMIN_ROLE") {
    return res.status(401).json({
      msg: `${nombre} no es administrador, no puede hacer esto`,
    });
  }

  next();
};

// Recibir otros argumentos en los middleware
const tieneRole = (...todosLosRoles) => {
  return (req, res, next) => {
    if (!req.usuarioToken) {
      return res.status(500).json({
        msg: "se quiere verificar el role isn validar el token primero",
      });
    }
    if (!todosLosRoles.includes(req.usuarioToken.rol)) {
      return res.status(401).json({
        msg: `El servicio requiere rol en especifico`,
      });
    }
    next();
  };
};

module.exports = {
  esAdminRole,
  tieneRole,
};
