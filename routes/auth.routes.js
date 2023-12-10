const { Router } = require("express");
const { validarCrearCuenta } = require("../middlewares/usuarios.middlewares");
const { crearCuenta, login } = require("../controllers/auth.controllers");


const router = Router();

router.post("/singin", [validarCrearCuenta], crearCuenta);
router.post("/login", login);

module.exports = router;