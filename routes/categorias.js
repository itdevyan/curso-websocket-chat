const { Router } = require("express");
const {
  validarJWT,
  validarCampos,
  tieneRole,
  esAdminRole,
} = require("../middlewares");
const {
  obtenerCategorias,
  obtenerCategoriasPorID,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} = require("../controllers/categorias");
const { check } = require("express-validator");
const {
  existeCategoriaPorId,
  existeNombreCategoria,
} = require("../helpers/db-validators");

const router = Router();

// validaciones
// crear check('id').custom( existeCategoria )

// Obtener todas las categorias - publico
router.get("/", obtenerCategorias);

// Obtener una categoria por id - publico
router.get(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeCategoriaPorId),
    validarCampos,
  ],
  obtenerCategoriasPorID
);

// Crear categoria - privado - cualquier rol con token válido
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    tieneRole("ADMIN_ROLE", "USER_ROLE", "VENTAS_ROLE"),
    validarCampos,
  ],
  crearCategoria
);

// Actualizar registro por id - privado = cualquier rol con token válido
router.put(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("nombre", "El campo nombre es obligatorio").not().isEmpty(),
    check("id").custom(existeCategoriaPorId),
    check("nombre").custom(existeNombreCategoria),
    tieneRole("ADMIN_ROLE", "USER_ROLE", "VENTAS_ROLE"),
    validarCampos,
  ],
  actualizarCategoria
);

// Borrrar una categoría - Admin
router.delete(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    esAdminRole,
    validarCampos,
    check("id").custom(existeCategoriaPorId),
  ],
  eliminarCategoria
);

module.exports = router;
