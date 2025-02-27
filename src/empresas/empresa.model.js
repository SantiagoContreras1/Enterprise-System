import {Schema,model} from "mongoose";

const EmpresaSchema = Schema({
    name:{
        type:String,
        required:[true,'Decinos el nombre de tu empresa, perdido.']
    },
    descripcion:{
        type: String,
        required:[true,'Decinos la descripción de tu empresa, perdido.']
    },
    impacto:{
        type:String,
        enum: ["bajo", "medio", "alto"], // Si hay categorías fijas
        required:[true,'Queremos saber el impacto. Ponelo.']
    },
    years:{
        type: Number,
        required:[true,'Años de experiencia, por favor boludin.'],
        min: [0, "Los años no pueden ser negativos, payaso."]
    },
    categoria:{
        type:String,
        required:[true,'Categoría de tu empresa, no seas un boludo.']
    },
    estado:{
        type:Boolean,
        default: true
    }
})

// Sobreescribir el método toJSON para modificar la respuesta del modelo
EmpresaSchema.methods.toJSON = function () {
    const { __v, _id, ...empresa } = this.toObject();
    return { uid: _id, ...empresa };
  };

export default model('Empresa',EmpresaSchema)