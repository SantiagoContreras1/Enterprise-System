import User from "../auth/user.model.js"

export const existUser = async (name='') => {
    const existeUser = await User.findOne({name})

    if (existeUser) {
        throw new Error(`El admin de discord ${name} ya existe boludin.`)
    }
}