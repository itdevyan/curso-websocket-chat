const { request, response } = require("express");
const { Categoria } = require("../models");

// paginado - total - populate
const obtenerCategorias = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };
  const [total, categorias] = await Promise.all([
    Categoria.countDocuments(query),
    Categoria.find(query)
      .skip(Number(desde))
      .limit(Number(limite))
      .populate("usuario", ["uid", "nombre", "correo"]),
  ]);
  res.json({
    total,
    categorias,
  });
};

const obtenerCategoriasPorID = async (req = request, res = response) => {
  const { id } = req.params;
  const categoria = await Categoria.findById(id).populate("usuario", [
    "uid",
    "nombre",
    "correo",
  ]);
  res.json(categoria);
};

const crearCategoria = async (req = request, res = response) => {
  const nombre = req.body.nombre.toUpperCase();

  const categoriaDB = await Categoria.findOne({ nombre });

  if (categoriaDB) {
    return res.status(400).json({
      msg: `La categoría ${categoriaDB.nombre}, ya existe`,
    });
  }

  // Generar la data a guardar
  const data = {
    nombre,
    usuario: req.usuarioToken._id,
  };

  const categoria = new Categoria(data);

  // GuardarDB
  const categoriaGuardada = await categoria.save();

  res.status(201).json({
    categoria,
  });
};

// validaciones- y que no exista la nueva
const actualizarCategoria = async (req = request, res = response) => {
  const { id } = req.params;

  const { estado, usuario, ...resto } = req.body;

  resto.nombre = resto.nombre.toUpperCase();
  resto.usuario = req.uid;

  const categoria = await Categoria.findByIdAndUpdate(id, resto, { new: true });
  res.status(200).json({
    categoria,
  });
};

// cambiar estado false
const eliminarCategoria = async (req = request, res = response) => {
  const { id } = req.params;

  const categoria = await Categoria.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );

  res.json(categoria);
};

module.exports = {
  obtenerCategorias,
  obtenerCategoriasPorID,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
};
