const { request, response } = require("express");
const { validationResult } = require("express-validator");

// un middleware tiene un tercer argumento que es next
const validarCampos = (req = request, res = response, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  }
  // Si llega a este punto, sigue con el siguiente middleware o controlador
  next();
};

module.exports = {
  validarCampos,
};
