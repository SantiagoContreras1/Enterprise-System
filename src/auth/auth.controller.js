import { hash,verify } from "argon2"

import User from "./user.model.js"
import {generarJWT} from "../helpers/generarJWT.js"

export const register = async (req,res) => {
    try {
        const data = req.body // Agarrar la data del body
        const passwordEncrypt = await hash(data.password)

        const user = await User.create({
            name: data.name,
            password: passwordEncrypt
        })

        res.status(200).json({
            message: "Ahí esta tu usario ve...",
            user: user
        })
    } catch (error) {
        res.status(500).json({
            ss: false,
            error: error.message
        })
    }
}

export const login = async (req,res) => {
    const {name,password} =req.body
    try {
        const user = await User.findOne({name})

        // VALIDACIONES
        if (!user) {
            return res.status(404).json({
                message: "El usuario no existe",
                ss: false
            })
        }

        if (!user.estado) {
            return res.status(403).json({
                message: "El usuario esta inactivo",
                ss: false
            })
        }

        // CONTRASEÑA
        const validPass = await verify(user.password,password)
        if (!validPass) {
            return res.status(403).json({
                msg: 'Contraseña incorrecta pelotudin.'
            })
        }

        const token = await generarJWT(user.id) // Genara el token con el aidi (ID)
        res.status(200).json({
            msg: 'Usuario autenticado boludín.',
            details:{
                name: user.name,
                token: token
            }
        })


    } catch (error) {
        res.status(500).json({
            ss: false,
            error: error.message
        })
    }
}

export const getAdmins = async (req,res) => {
    try {
        const query = {estado:true}

        const [total,admins] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
        ])

        res.status(200).json({
            ss: true,
            total,
            admins
        })
    } catch (error) {
        res.status(500).json({
            message: "Error fetching users",
            error: error.message
        })
    }
}

export const bananearAdmin = async (req,res) => {
    const {id} = req.params
    try {
        const user = await User.findById(id)

        if (!user) {
            return res.status(404).json({
                ss: false,
                message: "User not found boludo"
            })
        }

        user.estado = false
        await user.save()

        res.status(200).json({
            ss: true,
            message: "Admin bananeado successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: "Error bananeando user",
            error: error.message
        })
    }
}