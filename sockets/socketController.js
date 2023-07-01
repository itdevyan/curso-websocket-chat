// No es necesario importarlo, sólo es para
// tener referencia al no tener Typescript
const { Socket } = require("socket.io");

const socketController = (socket = new Socket()) => {
  console.log("usuario conectado");
};

module.exports = {
  socketController,
};
