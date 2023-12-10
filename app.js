// se importa dotenv para manejar las variables de entorno
require("dotenv").config();

// se importa la clase Server
const Server = require("./models/Server");

// se instancia la clase Server para iniciar el sistema
const server = new Server();