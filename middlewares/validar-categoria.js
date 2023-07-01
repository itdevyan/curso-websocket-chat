const { request, response } = require("express");
const { Categoria } = require("../models");

const validarCategoria = async (req = request, res = response, next) => {
  const { categoria } = req.body;

  const categoriaEncontrada = await Categoria.findById(categoria);

  if (categoriaEncontrada) {
    req.categoria = categoriaEncontrada;
    next();
  } else {
    throw new Error("La categoría no existe");
  }
};

module.exports = {
  validarCategoria,
};
