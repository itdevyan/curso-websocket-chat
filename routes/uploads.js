const { Router } = require("express");
const { check } = require("express-validator");
const {
  cargarArchivo,
  actualizarImagen,
  mostrarImagen,
  actualizarImagenNube,
} = require("../controllers/uploads");
const { validarCampos, validarArchivo } = require("../middlewares");
const { coleccionesPermitidas } = require("../helpers");

const router = Router();

router.post("/", validarArchivo, cargarArchivo);

router.put(
  "/:coleccion/:id",
  [
    validarArchivo,
    check("id", "El id no es válido").isMongoId(),
    check("coleccion").custom((coleccion) =>
      coleccionesPermitidas(coleccion, ["usuarios", "productos"])
    ),
    validarCampos,
  ],
  // actualizarImagen, Local
  actualizarImagenNube
);

router.get(
  "/:coleccion/:id",
  [
    check("id", "El id no es válido").isMongoId(),
    check("coleccion").custom((coleccion) =>
      coleccionesPermitidas(coleccion, ["usuarios", "productos"])
    ),
    validarCampos,
  ],
  mostrarImagen
);

module.exports = router;
