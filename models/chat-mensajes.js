class Mensaje {
  constructor(uid, nombre, mensaje) {
    this.uid = uid;
    this.nombre = nombre;
    this.mensaje = mensaje;
  }
}

class ChatMensajes {
  constructor() {
    this.mensajes = [];
    this.usuarios = {
      // 'uid' = {}
    };
  }

  get ultimos10() {
    this.mensajes = this.mensajes.splice(0, 10);
    return this.mensajes;
  }

  get usuarioArr() {
    return Object.values(this.usuarios); // [{},{},{}]
  }

  enviarMensaje(uid, nombre, mensaje) {
    console.log("[enviarMensaje]");
    this.mensajes.unshift(new Mensaje(uid, nombre, mensaje));
  }

  conectarUsuario(usuario) {
    // para agregar un nuevo usuario al arreglo de objetos
    this.usuarios[usuario.id] = usuario;
  }

  desconectarUsuarios(id) {
    delete this.usuarios[id];
  }
}

module.exports = ChatMensajes;
