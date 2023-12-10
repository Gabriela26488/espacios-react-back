const { Router } = require("express");
const {
  auth,
  validarCrearCuenta,
  validarEditarCuenta,
} = require("../middlewares/usuarios.middlewares");
const {
  mostrarUsuarios,
  mostrarUnUsuario,
  crearUsuario,
  eliminarUsuario,
  editarUsuario,
  verificarLogin,
} = require("../controllers/usuarios.controller");

const router = Router();

router.get("/", auth, mostrarUsuarios);
router.get("/:id", auth, mostrarUnUsuario);
router.post("/", [auth, validarCrearCuenta], crearUsuario);
router.delete("/:id", auth, eliminarUsuario);
router.put("/:id", [auth, validarEditarCuenta], editarUsuario);
router.get("/verificar/usuario", auth, verificarLogin);

module.exports = router;
