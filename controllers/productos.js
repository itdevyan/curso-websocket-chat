const { request, response } = require("express");
const { Producto } = require("../models");

const obtenerProductos = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };
  const [total, productos] = await Promise.all([
    Producto.countDocuments(query),
    Producto.find(query)
      .skip(Number(desde))
      .limit(Number(limite))
      .populate("usuario", ["uid", "nombre", "correo"])
      .populate("categoria", ["nombre"]),
  ]);
  res.json({
    total,
    productos,
  });
};

const obtenerProductoPorId = async (req = request, res = response) => {
  const { id } = req.params;
  const producto = await Producto.findById(id).populate([
    {
      path: "usuario",
      transform: (user, id) =>
        user == null
          ? id
          : {
              nombre: user.nombre,
            },
    },
    {
      path: "categoria",
      transform: (cat, id) =>
        cat == null
          ? id
          : {
              nombre: cat.nombre,
            },
    },
  ]);
  // .populate("categoria", ["nombre"]);

  res.json(producto);
};

const crearProducto = async (req = request, res = response) => {
  const { nombre, precio, disponible, descripcion } = req.body;

  // También se podría sacar el resto de lo que se quiere grabar
  // const {  estado, usuario, ...resto } = req.body;

  const dataRq = {
    // ...resto
    nombre,
    precio,
    disponible,
    descripcion,
    estado: true,
    usuario: req.usuarioToken._id,
    categoria: req.categoria._id, // NO ES NECESARIO si se controlara el id en el middleware,
    // e iría en dentro el ...resto
  };

  const producto = new Producto(dataRq);
  await producto.save();

  res.json(producto);
};

const actualizarProducto = async (req = request, res = response) => {
  const { id } = req.params;
  const { estado, usuario, categoria, ...resto } = req.body;

  if (Object.keys(resto).length === 0) {
    res.status(400).json({
      msg: "Se necesitan parametros para actualizar producto",
    });
  }

  const producto = await Producto.findByIdAndUpdate(id, resto, { new: true });

  res.status(200).json({
    producto,
  });
};

const eliminarProducto = async (req = request, res = response) => {
  const { id } = req.params;

  const producto = await Producto.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );

  res.json(producto);
};

module.exports = {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
};
