const { response, request } = require("express");
const Usuario = require("../models/usuario");
const bcryptjs = require("bcryptjs");
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req = request, res = response) => {
  const { correo, password } = req.body;

  try {
    // verificar si correo existe
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      console.log("Usuario no existe");
      return res.status(400).json({
        msg: "Usuario / Password no son correctos",
      });
    }

    // verificar si usuario esta activo
    if (!usuario.estado) {
      console.log("Usuario no habilitado");
      return res.status(400).json({
        msg: "Usuario / Password no son correctos",
      });
    }

    // verificar contraseña
    const validPassword = bcryptjs.compareSync(password, usuario.password);
    if (!validPassword) {
      console.log("Password incorrecta");
      return res.status(400).json({
        msg: "Usuario / Password no son correctos",
      });
    }

    // generar el JWT
    const token = await generarJWT(usuario.id);

    res.json({
      msg: "login ok",
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Algo salió mal, intente más tarde",
    });
  }
};

const googleSignin = async (req, res = response) => {
  const { id_token } = req.body;

  try {
    const { nombre, img, correo } = await googleVerify(id_token);

    let usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      // tengo que crearlo
      const data = {
        nombre,
        img,
        correo,
        rol: "USER_ROLE",
        password: "googlesignin",
        google: true,
      };
      usuario = new Usuario(data);
      await usuario.save();
    }

    // Si el usuario en DB
    if (!usuario.estado) {
      console.log("usuario bloqueado");
      return res.status(400).json({
        msg: "Algo salió mal, intente más tarde",
      });
    }

    // generar el JWT
    const token = await generarJWT(usuario.id);

    res.json({ usuario, token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Algo salió mal, intente más tarde",
    });
  }
};

module.exports = {
  login,
  googleSignin,
};
