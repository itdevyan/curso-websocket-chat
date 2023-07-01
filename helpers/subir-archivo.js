const path = require("path");
const { v4: uuidv4 } = require("uuid");

const subirArchivo = (
  { archivo },
  extensionesValidas = ["png", "jpg", "jpeg", "gif"],
  carpeta = ""
) => {
  return new Promise((resolve, reject) => {
    const nombreCortado = archivo.name.split(".");
    const extension = nombreCortado[nombreCortado.length - 1];

    if (!extensionesValidas.includes(extension)) {
      return reject(
        `La extensión ${extension} no es permitida, sólo se permiten ${extensionesValidas}`
      );
    }

    const nombreTemporal = uuidv4() + "." + extension;

    const uploadPath = path.join(
      __dirname,
      "../uploads/",
      carpeta,
      nombreTemporal
    );

    archivo.mv(uploadPath, (err) => {
      if (err) {
        return reject(err);
      }
      return resolve(nombreTemporal);
    });
  });
};

module.exports = {
  subirArchivo,
};
