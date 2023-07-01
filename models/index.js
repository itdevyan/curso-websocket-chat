const Categoria = require("./categoria");
const Role = require("./role");
const Server = require("./server");
const Usuario = require("./usuario");
const Producto = require("./producto");

/* Otra forma de exportar 
    module.exports = require("./categoria");
    module.exports = require("./role");
    module.exports = require("./server");
    module.exports = require("./usuario");
*/

module.exports = {
  Categoria,
  Role,
  Server,
  Usuario,
  Producto,
};
