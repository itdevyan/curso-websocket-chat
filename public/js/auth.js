const miFormulario = document.querySelector("form");

const url = "https://curso-websocket-chat-production.up.railway.app/api/auth";

miFormulario.addEventListener("submit", (evento) => {
  evento.preventDefault(); // Evita refresh de navegador

  const formData = {};

  for (let ele of miFormulario.elements) {
    if (ele.name.length > 0) {
      formData[ele.name] = ele.value;
    }
  }

  fetch(url + "/login", {
    method: "POST",
    body: JSON.stringify(formData),
    headers: { "Content-Type": "application/json" },
  })
    .then((resp) => resp.json())
    .then(({ msg, token }) => {
      if (msg) {
        return console.error(msg);
      }
      localStorage.setItem("token", token);
      window.location = "chat.html";
    })
    .catch((err) => {
      console.log(err);
    });
});

function handleCredentialResponse(response) {
  // Google Token : ID_TOKEN
  // console.log("id_token", response.credential);

  const request = {
    id_token: response.credential,
  };

  fetch(url + "/google", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  })
    .then((resp) => resp.json())
    .then(({ token }) => {
      localStorage.setItem("token", token);
      window.location = "chat.html";
    })
    .catch(console.warn);
}

const button = document.getElementById("google_signout");

button.onclick = () => {
  console.log(google.accounts.id);
  google.accounts.id.disableAutoSelect();
  google.accounts.id.revoke(localStorage.getItem("token"), (done) => {
    localStorage.clear();
    location.reload();
  });
};
