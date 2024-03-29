const { validationResult } = require("express-validator");
const objId = require("mongoose").Types.ObjectId;
const ac = require("../middlewares/roles");
const Espacios = require("../models/Espacios");
const Usuario = require("../models/Usuario");

// funcion que valida si se encontraron errores en el express-validator
const validarDatos = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return { errors: errors.array() };
  } else return null;
};

// funcion para validar si el id es un id correcto
const validarId = (id) => {
  if (!objId.isValid(id)) {
    return false;
  }
  return true;
};

// funcion que devuelve la lista de espacios registrados
const listaEspacios = async (req, res) => {
  try {
    // devuelve la lista de espacios.
    const espacios = await Espacios.find();
    res.status(200).json(espacios);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

// funcion que muestra los datos de un espacio
const mostrarEspacio = async (req, res) => {
  try {
    // idValido recibe la validación del id
    const idValido = validarId(req.params.id);
    if (!idValido) return res.status(401).json({ msg: "El id es incorrecto" });

    // busca el espacio segun el id
    const espacio = await Espacios.findById(req.params.id);
    // si no encuencuentra un espacio devuelve error
    if (!espacio) return res.status(400).json({ msg: "Espacio no registrado" });
    // si hay un espacio con ese id lo devuelve
    res.status(200).json(espacio);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

// funcion para crear un espacio
const crear = async (req, res) => {
  try {
    if (!ac.can(req.user.rol).createAny("espacio").granted)
      return res.status(401).json("Unauthorized");

    const validar = validarDatos(req);
    if (validar) return res.status(400).json(validar);

    const {ubicacion, ...datos} = req.body

    datos.ubicacion = JSON.parse(ubicacion);

    const nuevoEspacio = new Espacios(datos);

    await nuevoEspacio.save();

    res.status(201).json(nuevoEspacio);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

// funcion para editar los datos de un espacio
const editar = async (req, res) => {
  try {
    // idValido recibe la validación del id
    const idValido = validarId(req.params.id);
    if (!idValido) return res.status(401).json({ msg: "El id es incorrecto" });

    // la variable permiso recibe el valor de la validación del permiso
    const permiso = ac.can(req.user.rol).updateAny("espacio");

    // si el usuario administrador no es el que esta solicitando los cambios
    // devolvemos error de autorización
    if (!permiso.granted) {
      return res.status(401).json("Unauthorized");
    }

    const validar = validarDatos(req);

    if (validar) return res.status(400).json(validar);

    const actualizado = await Espacios.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    return res.status(200).json({ msg: "Espacio actualizado", actualizado });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

// funcion para borrar los datos de un espacio
const eliminar = async (req, res) => {
  try {
    const permission = ac.can(req.user.rol).deleteAny("espacio");
    const idValido = validarId(req.params.id);

    if (!permission.granted) return res.status(401).json("Unauthorized");
    if (!idValido) return res.status(401).json({ msg: "El id es incorrecto" });

    await Espacios.findByIdAndDelete(req.params.id);

    return res.status(200).json("Espacio eliminado");
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

const reservar = async (req, res) => {
  try {
    // idValido recibe la validación del id
    const idValido = validarId(req.params.id);
    if (!idValido) return res.status(401).json({ msg: "El id es incorrecto" });

    // busca el espacio segun el id
    const espacio = await Espacios.findById(req.params.id);
    // si no encuencuentra un espacio devuelve error
    if (!espacio) return res.status(400).json({ msg: "Espacio no registrado" });

    const datos = {
      fecha: req.body.fecha,
      hora: req.body.hora,
      estaDisponible: false,
      reservadoPor: req.user._id,
    };

    const disponibilidad = [...espacio.disponibilidad, datos];

    const actualizado = await Espacios.findByIdAndUpdate(
      req.params.id,
      { disponibilidad },
      {
        new: true,
      }
    );

    return res.status(200).json({ msg: "Espacio actualizado", actualizado });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

const reservados = async (req, res) => {
  try {
    const permiso = ac.can(req.user.rol).updateAny("espacio");
    if (!permiso.granted) {
      return res.status(401).json("Unauthorized");
    }
    const espacios = await Espacios.find();
    const usuarios = await Usuario.find();
    let lista = [];
    espacios.map((espacio) => {
      if (espacio.disponibilidad.length > 0) {
        espacio.disponibilidad.forEach((i) => {
          usuarios.forEach((usuario) => {
            if (usuario._id.toString() == i.reservadoPor.toString()) {
              lista.push({
                idUsuario: usuario._id,
                idEspacio: espacio._id,
                nombreEspacio: espacio.nombre,
                nombreUsuario: usuario.nombres,
                correoUsuario: usuario.correo,
                fecha: i.fecha,
                hora: i.hora,
              });
            }
          });
        });
      }
    });
    return res.status(200).json(lista);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
module.exports = {
  listaEspacios,
  mostrarEspacio,
  crear,
  editar,
  eliminar,
  reservar,
  reservados,
};
