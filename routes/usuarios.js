const { Router } = require("express");
const {
  usuariosGet,
  usuariosDelete,
  usuariosPatch,
  usuariosPost,
  usuariosPut,
  usuariosGetQueryParams,
} = require("../controllers/usuarios");
const { check } = require("express-validator");
// Seria lo mismo que esto
// require("../middlewares/index");
const {
  validarCampos,
  validarJWT,
  esAdminRole,
  tieneRole,
} = require("../middlewares");
const {
  esRoleValido,
  elEmailExiste,
  existeUsuarioPorId,
} = require("../helpers/db-validators");

const router = Router();

router.get("/", usuariosGet);

router.get("/queryParams/", usuariosGetQueryParams);

router.put(
  "/:id",
  [
    // validator se da cuenta de si es un parametro de ruta
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    check("rol").custom(esRoleValido),
    validarCampos,
  ],
  usuariosPut
);

// Si mandas 2 argumentos, es la ruta y controlador
// Si mandas 3 argumentos, es la ruta, middleware y controlador
// puedes mandar un middleware o varios, en caso de ser varios,
// mandarlos como un arreglo []
router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check(
      "password",
      "El password debe contener al menos 6 caracteres"
    ).isLength({ min: 6 }),
    check("correo", "El correo no es válido").isEmail(),
    check("correo").custom((correo) => elEmailExiste(correo)),
    // Otra forma manual de validar enum
    // check("rol", "El rol debe ser válido").isIn(["ADMIN_ROLE", "USER_ROLE"]),
    // (rol) => esRoleValido(rol) es lo mismo que enviar esRoleValido solo
    check("rol").custom(esRoleValido),
    validarCampos,
  ],
  usuariosPost
);

router.delete(
  "/:id",
  [
    validarJWT,
    // esAdminRole,
    tieneRole("ADMIN_ROLE", "VENTAS_ROLE"),
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    validarCampos,
  ],
  usuariosDelete
);

router.patch("/", usuariosPatch);

module.exports = router;
