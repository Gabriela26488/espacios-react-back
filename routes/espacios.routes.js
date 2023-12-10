const { Router } = require("express");
const {
  listaEspacios,
  mostrarEspacio,
  crear,
  eliminar,
  editar,
} = require("../controllers/espacios.controller");
const { auth } = require("../middlewares/usuarios.middlewares");
const {
  validarCrearEspacio,
  validarEditarEspacio,
} = require("../middlewares/espacios.middleware");

const router = Router();

router.get("/", auth, listaEspacios);
router.get("/:id", auth, mostrarEspacio);
router.post("/", [auth, validarCrearEspacio], crear);
router.put("/:id", [auth, validarEditarEspacio], editar);
router.delete("/:id", auth, eliminar);

module.exports = router;
