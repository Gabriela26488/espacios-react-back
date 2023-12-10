const { validationResult } = require("express-validator");
const objId = require("mongoose").Types.ObjectId;
const ac = require("../middlewares/roles");
const Usuario = require("../models/Usuario");

// funcion que valida si se encontraron errores en el express-validator
const validarDatos = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return { errors: errors.array() };
  } else return null;
};

// duncion para validar si el id es un id correcto
const validarId = (id) => {
  if (!objId.isValid(id)) {
    return false;
  }
  return true;
};

// funcion que devuelve la lista de usuarios registrados
const mostrarUsuarios = async (req, res) => {
  //   validar si el susuario tiene permisos para acceder a la funcion
  if (!ac.can(req.user.rol).readAny("usuario").granted)
    return res.status(401).json("Unauthorized");

  try {
    // devuelve la lista de usuarios cuyo estado sea true, es decir, que no esten eliminados.
    const usuarios = await Usuario.find({ estado: true });
    res.status(200).json(usuarios);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

// funcion que muestra los datos de un usuario
const mostrarUnUsuario = async (req, res) => {
  try {
    // idValido recibe la validación del id
    const idValido = validarId(req.params.id);
    if (!idValido) return res.status(401).json({ msg: "El id es incorrecto" });

    // la variable permiso recibe el valor de la validación del permiso
    const permiso = ac.can(req.user.rol).readAny("usuario");
    // verifyId valida si el id enviado en la url es igual al id logueado
    const verifyId = req.user._id.toString() === req.params.id ? true : false;

    // si el usuario administrador o el usuario logueado no es el que esta solicitando los datos
    // devolvemos error de autorizacion
    if (!permiso.granted && !verifyId) {
      return res.status(401).json("Unauthorized");
    }

    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(400).json({ msg: "Usuario no registrado" });
    res.status(200).json(usuario);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

// funcion para crear usuario
const crearUsuario = async (req, res) => {
  if (!ac.can(req.user.rol).createAny("usuario").granted)
    return res.status(401).json("Unauthorized");

  try {
    const validar = validarDatos(req);
    if (validar) return res.status(400).json(validar);

    const nuevoUsuario = new Usuario(req.body);

    await nuevoUsuario.save();

    res.status(201).json(nuevoUsuario);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

// funcion para borrar los datos de un usuario
const eliminarUsuario = async (req, res) => {
  try {
    const permission = ac.can(req.user.rol).deleteAny("usuario");
    const idValido = validarId(req.params.id);

    if (!permission.granted) return res.status(401).json("Unauthorized");
    if (!idValido) return res.status(401).json({ msg: "El id es incorrecto" });

    await Usuario.findByIdAndUpdate(
      req.params.id,
      { estado: false },
      { new: true }
    );

    return res.status(200).json("Usuario eliminado");
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

// funcion para editar los datos de un usuario
const editarUsuario = async (req, res) => {
  try {
    // idValido recibe la validación del id
    const idValido = validarId(req.params.id);
    if (!idValido) return res.status(401).json({ msg: "El id es incorrecto" });

    // la variable permiso recibe el valor de la validación del permiso
    const permiso = ac.can(req.user.rol).updateAny("usuario");
    // verifyId valida si el id enviado en la url es igual al id logueado
    const verifyId = req.user._id.toString() === req.params.id ? true : false;

    // si el usuario administrador o el usuario logueado no es el que esta solicitando los cambios
    // devolvemos error de autorización
    if (!permiso.granted && !verifyId) {
      return res.status(401).json("Unauthorized");
    }

    const validar = validarDatos(req);

    if (validar) return res.status(400).json(validar);

    const actualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    return res.status(200).json({ msg: "Usuario actualizado", actualizado });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

// funcion que devuelve los datos del usuario logueado
const verificarLogin = async (req, res) => {
  try {
    const datos = req.user;
    res.status(200).json(datos);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

module.exports = {
  mostrarUsuarios,
  mostrarUnUsuario,
  crearUsuario,
  eliminarUsuario,
  editarUsuario,
  verificarLogin,
};
