const { body } = require('express-validator');
const Espacios = require('../models/Espacios');


// funciones para usarlas en los middlewares de validacion
// funcion para saber si ya se encuentra registrado un el nombre del espacio
const encuentraNombre = async (nombre) => {
    const espacio = await Espacios.findOne({nombre});

    if(espacio) throw new Error('Nombre de espacio existente');

    return true;
 }

// middlewares que valida los datos enviados a la ruta
const validarCrearEspacio = [
  body('nombre')
		.not().isEmpty().withMessage("El nombre es requerido").bail()	
		.exists().withMessage('El nombre es requerido').bail()
		.isString().withMessage('Ingresa un nombre válido').bail()
		.custom(encuentraNombre),  

  body('direccion')
		.not().isEmpty().withMessage("La dirección es requerida").bail()	
		.exists().withMessage('La dirección es requerida').bail()
		.isString().withMessage('Ingresa una direccion válida').bail(),

	body('capacidad')
		.not().isEmpty().withMessage('Capacidad es requrida').bail()
		.exists().withMessage('Capacidad es requerida').bail()
		.isNumeric().withMessage('Ingresa una capacidad válida').bail(),

  body('precio')
		.not().isEmpty().withMessage('Precio es requrido').bail()
		.exists().withMessage('Precio es requerida').bail()
		.isNumeric().withMessage('Ingresa un precio válido').bail(),

  body('ubicacion')
		.not().isEmpty().withMessage('Ubicacion es requrido').bail()
		.exists().withMessage('Ubicacion es requrido').bail()
		.isObject().withMessage('Ingresa una ubicación válida').bail(),

  body('ubicacion.latitud')
		.not().isEmpty().withMessage('Latitud es requrido').bail()
		.isNumeric().withMessage('Ingresa una latitud válida').bail()
    .custom((value) => value >= -90 && value <= 90).withMessage('La latitud debe estar entre -90 y 90'),

  body('ubicacion.longitud')
		.not().isEmpty().withMessage('Longitud es requrida').bail()
		.isNumeric().withMessage('Ingresa una longitud válida').bail()
    .custom((value) => value >= -180 && value <= 180).withMessage('La longitud debe estar entre -180 y 180'),
]

const validarEditarEspacio = [
  body('nombre')
    .optional().bail()
		.isString().withMessage('Ingresa un nombre válido').bail()
		.custom(encuentraNombre),  

  body('direccion')
    .optional().bail()
		.isString().withMessage('Ingresa una direccion válida').bail(),

	body('capacidad')
    .optional().bail()
		.isNumeric().withMessage('Ingresa una capacidad válida').bail(),

  body('precio')
    .optional().bail()
		.isNumeric().withMessage('Ingresa un precio válido').bail(),

  body('ubicacion')
    .optional().bail()
		.isObject().withMessage('Ingresa una ubicación válida').bail(),

  body('ubicacion.latitud')
    .optional().bail()
		.isNumeric().withMessage('Ingresa una latitud válida').bail()
    .custom((value) => value >= -90 && value <= 90).withMessage('La latitud debe estar entre -90 y 90'),

  body('ubicacion.longitud')
    .optional().bail()
		.isNumeric().withMessage('Ingresa una longitud válida').bail()
    .custom((value) => value >= -180 && value <= 180).withMessage('La longitud debe estar entre -180 y 180'),
]

module.exports = {
	validarCrearEspacio,
  validarEditarEspacio
}