const { Schema, model } = require("mongoose");

const UsuarioSchema = Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  correo: {
    type: String,
    required: [true, "El correo es obligatorio"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligatorio"],
  },
  img: {
    type: String,
  },
  rol: {
    type: String,
    required: [true, "el rol es obligatorio"],
    enum: ["ADMIN_ROLE", "USER_ROLE"],
  },
  estado: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
});

// Para sobrescribir el metodo que devuelve el objeto cuando se llama
// desde el controlador
UsuarioSchema.methods.toJSON = function () {
  const { __v, password, _id, ...restoAtributosUsuario } = this.toObject();
  return {
    ...restoAtributosUsuario,
    uid: _id,
  };
};

// El nombre 'Usuario' es el nombre de la colección, DEBE estar en singular, ya que internamente le agregará la s (Usuarios)
module.exports = model("Usuario", UsuarioSchema);
