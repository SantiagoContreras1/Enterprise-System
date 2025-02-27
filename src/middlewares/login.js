import { body } from "express-validator";
import {validarCampos} from "../middlewares/validar-campos.js"

export const registerValidator = [
    body('name').not().isEmpty().withMessage('Admin pelotudo, el name es obviamente obligatorio.'),
    validarCampos
]

export const loginValidator =[
    body('name').not().isEmpty().withMessage('El name tenes que ponerlo. Payaso'),
    body('password','Password incorrecta. Seguro sos hacker.'),
    validarCampos
]