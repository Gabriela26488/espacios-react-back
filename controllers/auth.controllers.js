const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const Usuario = require("../models/Usuario");

// funcion para crear token jwt
function createToken(usuario) {
  return jwt.sign(
    { id: usuario.id, email: usuario.email },
    process.env.JWT_KEY,
    {
      expiresIn: 86400,
    }
  );
}

// funcion para crear una cuenta
const crearCuenta = async (req, res) => {
  try {
    // validar si hay errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const nuevoUsuario = new Usuario(req.body);

    await nuevoUsuario.save();

    return res.status(201).json(nuevoUsuario);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

// controlador para iniciar sesion
const login = async (req, res) => {
  try {
    if (!req.body.correo || !req.body.password)
      return res.status(400).json({ msg: "Correo y contraseña requeridos" });

    const usuario = await Usuario.findOne({ correo: req.body.correo });
    if (!usuario) return res.status(400).json({ msg: "Correo no registrado" });

    if (!usuario.estado)
      return res.status(400).json({ msg: "El usuario se encuentra eliminado" });

    const isMatch = await usuario.comparePassword(req.body.password);
    if (!isMatch) return res.status(400).json({ msg: "Contraseña incorrecta" });

    return res.status(200).json({ token: createToken(usuario) });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

module.exports = {
  crearCuenta,
  login,
};
