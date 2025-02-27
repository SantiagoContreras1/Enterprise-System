import { Router } from "express";
import { check } from "express-validator";
import {validarCampos} from "../middlewares/validar-campos.js"
import {saveEmpresa,getEmpresas,updateEmpresa,generarExcel} from "./empresas.controller.js"

const router = Router()

router.get("/get/",getEmpresas)

router.post(
    "/save/",
    [
        check("name").not().isEmpty().withMessage("El nombre es obligatorio"),
        check("impacto").not().isEmpty().withMessage("El impacto es obligatorio"),
        check("years").not().isEmpty().withMessage("Los años son obligatorios"),  
        validarCampos
    ],
    saveEmpresa
)

router.put(
    "/update/:id",
    [
        check("name").not().isEmpty().withMessage("El nombre es obligatorio"),
        check("impacto").not().isEmpty().withMessage("El impacto es obligatorio"),
        check("years").not().isEmpty().withMessage("Los años son obligatorios"),
        validarCampos
    ],
    updateEmpresa
)

router.get(
    "/reporte",
    generarExcel
)

export default router