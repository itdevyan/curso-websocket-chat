const { request } = require("express");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario");

const validarJWT = async (req = request, res, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      msg: "No hay token en la petición",
    });
  }
  try {
    const { uid } = jwt.verify(token, process.env.SECRET_KEY);
    const usuarioToken = await Usuario.findById(uid);
    if (!usuarioToken) {
      return res.status(400).json({
        msg: "Usuario de token no existe",
      });
    }
    if (!usuarioToken.estado) {
      return res.status(400).json({
        msg: "Usuario no habilitado",
      });
    }
    req.uid = uid;
    req.usuarioToken = usuarioToken;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: "Token no válido",
    });
  }
};

module.exports = {
  validarJWT,
};
