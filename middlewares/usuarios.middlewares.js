const { body } = require('express-validator');
const passport = require('passport');
const Usuario = require('../models/Usuario');


// funciones para usarlas en los middlewares de validacion
// funcion para saber si ya se encuentra registrado un correo
const encuentraCorreo = async (correo) => {
    const usuario = await Usuario.findOne({correo});

    if(usuario) throw new Error('correo existente');

    return true;
 }

// funcion que verifica si el rol es correcto
const verificarRol = (rol) => {
	if (rol === 'admin' || rol === 'usuario' ) 
		return true;
	throw new Error('el rol es incorrecto');
}


// middlewares que valida los datos enviados a la ruta
const validarCrearCuenta = [
	body('correo')
		.not().isEmpty().withMessage('Correo es requerido').bail()
		.exists().withMessage('Correo es requerido').bail()
		.isEmail().withMessage('Ingresa un correo valido').bail()
		.custom(encuentraCorreo),

	body('password')
		.not().isEmpty().withMessage('Contraseña es requerida').bail()
		.exists().withMessage('Contraseña es requerido').bail()
		.isString().withMessage('Ingrese un contraseña valida').bail()
		.isLength({min: 8}).withMessage('La contraseña debe tener al menos 8 caracteres'),
    
  body('nombres')
		.not().isEmpty().withMessage("El nombre y apellido son requeridos").bail()	
		.exists().withMessage('Nombre es requerido').bail()
		.isString().withMessage('Ingresa un nombre valido').bail()
		.matches("^([\Na-zA-ZáéíóúÁÉÍÓÚñÑ' ]+)$").withMessage('Los nombres solo deben de tener letras'),  
]

const validarEditarCuenta = [
	body('correo')
		.optional().bail()
		.isEmail().withMessage('Ingresa un correo valido').bail()
		.custom(async (correo, { req }) => {
			const usuario = await Usuario.findOne({correo});
			const usuarioEditado = await Usuario.findById(req.params.id);
			
			if(usuario && usuarioEditado.correo !== correo) throw new Error('correo existente');

			return true;
		}),
    
	body('password')
		.optional().bail()
		.isString().withMessage('Ingrese una contraseña valida').bail()
		.isLength({min: 8}).withMessage('La contraseña debe tener al menos 8 caracteres'),
    
    body('nombres')
		.optional().bail()
		.isString().withMessage('Ingresa un nombre valido').bail()
        .matches("^([\Na-zA-ZáéíóúÁÉÍÓÚñÑ' ]+)$").withMessage('Los nombres solo deben de tener letras'),
                    	
	body('rol')
		.optional().bail()
		.isString().withMessage('Ingresa un rol valido').bail()
		.custom(verificarRol),
]



// funcion para saber si el token es valido
const auth = passport.authenticate('jwt', {session: false});

module.exports = {
	validarCrearCuenta,
  validarEditarCuenta,
	auth
}