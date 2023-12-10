const mongoose = require("mongoose");
const Usuario = require("./Usuario");

const espaciosSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
  },
  direccion: {
    type: String,
    required: true,
  },
  capacidad: {
    type: Number,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
  },
  ubicacion: {
    latitud: {
      type: Number,
      required: true,
    },
    longitud: {
      type: Number, 
      required: true,
    },
  },
  disponibilidad: [
    {
      fecha: String,
      hora: String,
      estaDisponible: {
        type: Boolean,
        default: true,
      },
      reservadoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        default: null,
      },
    },
  ],
},
{
  timestamps: true,
  versionKey: false,
});

const Espacios = mongoose.model("Espacios", espaciosSchema);

module.exports = Espacios;
