const url = "https://curso-websocket-chat-production.up.railway.app/api/auth";
let usuario = null;
let socketServer = null;

// referencias HTML
const txtUid = document.querySelector("#txtUid");
const txtMensaje = document.querySelector("#txtMensaje");
const ulUsuarios = document.querySelector("#ulUsuarios");
const ulMensajes = document.querySelector("#ulMensajes");
const btnSalir = document.querySelector("#btnSalir");

const validarJWT = async () => {
  const token = localStorage.getItem("token");
  if (token === null || token.length <= 10) {
    window.location = "index.html";
    throw new Error("No hya token en el servidor");
  }

  const resp = await fetch(url, {
    headers: { "x-token": token },
  });

  const { usuarioToken: userDB, token: tokenDB } = await resp.json();
  localStorage.setItem("token", tokenDB);
  usuario = userDB;

  document.title = usuario.nombre;

  await conectarSocket();
};

const conectarSocket = async () => {
  socketServer = io({
    extraHeaders: {
      "x-token": localStorage.getItem("token"),
    },
  });

  socketServer.on("connect", () => {
    console.log("Socket online");
  });
  socketServer.on("disconnect", () => {
    console.log("Socket offline");
  });

  socketServer.on("recibir-mensajes", (payload) => {
    // Otra forma de enviar
    dibujarMensajes(payload);
  });
  socketServer.on("usuarios-activos", dibujarUsuarios); // Como es un solo argumento, se manda por referencia y se puede acortar
  socketServer.on("mensaje-privado", (payload) => {
    console.log("Privado:", payload);
  });
};

const dibujarUsuarios = (usuarios = []) => {
  let usersHtml = "";

  usuarios.forEach(({ nombre, uid }) => {
    usersHtml += `
      <li>
        <p>
          <h5 class="text-success">${nombre}</h5>
          <span class="fs-6 text-muted">${uid}</span>
        </p>
      </li>
    `;
  });

  ulUsuarios.innerHTML = usersHtml;
};

const dibujarMensajes = (mensajes = []) => {
  let mensajesHtml = "";

  mensajes.forEach(({ nombre, mensaje }) => {
    mensajesHtml += `
      <li>
        <p>
          <h5 class="text-success">${nombre}</h5>
          <span">${mensaje}</span>
        </p>
      </li>
    `;
  });

  ulMensajes.innerHTML = mensajesHtml;
};

txtMensaje.addEventListener("keyup", ({ keyCode }) => {
  const uid = txtUid.value;
  const mensaje = txtMensaje.value;

  if (keyCode !== 13) {
    return;
  }

  // Debe tener al menos un caracter
  if (mensaje.length === 0) {
    return;
  }

  socketServer.emit("enviar-mensaje", { uid, mensaje }); // idealmente mandarlo en un objeto
  txtMensaje.value = "";
});

const main = async () => {
  await validarJWT();
};

main();
