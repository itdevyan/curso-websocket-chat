const jwt = require("jsonwebtoken");
const { Usuario } = require("../models");

const generarJWT = (uid = "") => {
  // se devuelve una promesa para poder utilizarla con async-await
  return new Promise((resolve, reject) => {
    const payload = { uid };
    jwt.sign(
      payload,
      process.env.SECRET_KEY,
      {
        expiresIn: "4h",
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("No se pudo generar el token");
        } else {
          resolve(token);
        }
      }
    );
  });
};

const comprobarJWT = async (token = "") => {
  try {
    if (token.length < 10) {
      return null;
    }
    const { uid } = jwt.verify(token, process.env.SECRET_KEY);

    const usuario = await Usuario.findById(uid);
    if (usuario) {
      if (usuario.estado) {
        return usuario;
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
};

module.exports = {
  generarJWT,
  comprobarJWT,
};
