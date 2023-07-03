// No es necesario importarlo, sólo es para
// tener referencia al no tener Typescript
const { Socket } = require("socket.io");
const { comprobarJWT } = require("../helpers");
const { ChatMensajes } = require("../models");

const chatMensajes = new ChatMensajes();

const socketController = async (socket = new Socket(), io) => {
  const usuario = await comprobarJWT(socket.handshake.headers["x-token"]); // Aqui estarán lo custom headers)

  if (!usuario) {
    return socket.disconnect();
  }
  console.log("Se conecto", usuario.nombre);

  // Agregar el usuario conectado
  chatMensajes.conectarUsuario(usuario);

  /// emitir a todas las personas que una persona se conectó
  io.emit("usuarios-activos", chatMensajes.usuarioArr);

  // emitir a todas las personas los mensajes actuales
  socket.emit("recibir-mensajes", chatMensajes.ultimos10);

  // conectarlo a una sala especial
  // existe 3 tipos de salas
  // global
  // socket.id (muy volatil )
  // usuario.id (con join)
  socket.join(usuario.id);

  // limpiuar cuando un usuario se desconecta
  socket.on("disconnect", () => {
    console.log("[disconnect]");
    chatMensajes.desconectarUsuarios(usuario.id);
    io.emit("usuarios-activos", chatMensajes.usuarioArr);
  });

  socket.on("enviar-mensaje", ({ uid, mensaje }) => {
    if (uid) {
      // si entrar aqui es un mensaje privado
      socket.to(uid).emit("mensaje-privado", { de: usuario.nombre, mensaje });
    } else {
      chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje);
      io.emit("recibir-mensajes", chatMensajes.ultimos10);
    }
  });
};

module.exports = {
  socketController,
};
