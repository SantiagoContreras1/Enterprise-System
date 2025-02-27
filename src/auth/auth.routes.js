import { Router } from "express";
import { check } from "express-validator";
import {register,login,getAdmins,bananearAdmin} from "./auth.controller.js"
import { registerValidator,loginValidator } from "../middlewares/login.js";
import { validarCampos } from "../middlewares/validar-campos.js";

const router = Router()

router.get("/",getAdmins)

router.post(
    "/register",
    registerValidator,
    register
)

router.post(
    "/login",
    loginValidator,
    login
)

router.delete(
    "/bananearAdmin/:id",
    [
        check("id",'Pone el id si queres que elimine a alguien, payaso.').not().isEmpty(),
        validarCampos
    ],
    bananearAdmin
)

export default router