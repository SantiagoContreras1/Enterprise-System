import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Definir __dirname manualmente
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import Empresa from "./empresa.model.js";
import Excel from "exceljs"

export const saveEmpresa = async (req,res) => {
    try {
        const data = req.body

        const empresa = await Empresa.create({
            name: data.name,
            descripcion: data.descripcion,
            impacto: data.impacto,
            years: data.years,
            categoria: data.categoria
        })

        await empresa.save()

        res.status(200).json({
            message: "Empresa creada con exito",
            data: empresa
        })
    } catch (error) {
        res.status(500).json({
            message: "Error al guardar la empresa",
            error: error.message
        })
    }
}

export const getEmpresas = async (req,res) => {
    const {years,categoria,orden} = req.query
    const query = {estado:true}
    try {
        // Filtrar por años
        if (years) {
            query.years = {$gte: Number(years)} // Greated than or equal, es $gte
        }

        // Filtrar por categoria
        if (categoria) {
            query.categoria = categoria
        }

        // De la A-Z y viceversa
        let option = {}
        if (orden === 'AZ') {
            option = {name:1}
        }else if (orden === 'ZA') {
            option = {name:-1}
        }

        // Ejecutar consulta con filtros y ordenamiento
        const empresas = await Empresa.find(query).sort(option);

        res.status(200).json({
            message: "Empresas encontradas",
            data: empresas
        })

    } catch (error) {
        res.status(500).json({
            message: "Error al obtener las empresas",
            error: error.message
        })
    }
}

export const updateEmpresa = async (req,res) => {
    try {
        const {id} = req.params
        const {...data} = req.body

        const empresa = await Empresa.findByIdAndUpdate(id,data,{new:true})

        res.status(200).json({
            message: "Empresa actualizada",
            empresa
        })

    } catch (error) {
        res.status(500).json({
            message: "Error al actualizar la empresa",
            error: error.message
        })
    }
}

export const generarExcel = async (req,res) => {
    try {
        const empresas = await Empresa.find() // Ir por las empresas

        if (!empresas) {
            return res.status(404).json({
                message: "No hay empresas para exportar"
            })
        }

        const workbook = new Excel.Workbook() // Crear el workbook
        workbook.created = new Date()

        // Crear una hojita, la primera fila es de encabezado, a partir de la segunda, escribe ya.
        const worksheet = workbook.addWorksheet('Empresas',{
            views: [{state:'frocen',ySplit: 1}],
            properties: {tabColor: {argb:'FFC000'}}
        })

        // Crear las columnas
        worksheet.columns = [
            {header: 'ID', key: '_id',width:25},
            {header: 'Nombre', key: 'name',width:25},
            {header: 'Descripción', key: 'descripcion',width:25},
            {header: 'Impacto', key: 'impacto',width:25},
            {header: 'Años de Experiencia', key: 'years',width:25},
            {header: 'Cateogría', key: 'categoria',width:25}
        ]

        // Darle estilos al encabezado
        worksheet.getRow(1).eachCell((cell)=> {
            cell.font = { bold: true, size: 20, color: { argb: 'FFFFFF' } };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '4F81BD' } // Color de fondo azul
            };
            cell.border = {
                bottom: { style: 'medium', color: { argb: '000000' } }
            };
        }) // Se le asigna el estilo al encabezado

        // Añadir filas
        empresas.forEach((empresa)=>{
            const row = worksheet.addRow({
                _id: empresa._id.toString(),
                name: empresa.name,
                descripcion: empresa.descripcion,
                impacto: empresa.impacto,
                years: empresa.years,
                categoria: empresa.categoria
            })

            // Aplicar alineación centrada a la celda de Impacto
            row.getCell('impacto').alignment = { horizontal: 'center', vertical: 'middle' }
            row.getCell('years').alignment = { horizontal: 'center',bold:true,size:17, vertical: 'middle' }
        })


        // Crear la carpeta Reports si no existe
        const reportsDir = path.join(__dirname, "../../Reports");
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir, { recursive: true });
        }

        // Crear el archivo
        const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
        const filePath = path.join(reportsDir, `reporte-${timestamp}.xlsx`);

        await workbook.xlsx.writeFile(filePath);

        res.status(200).json({
            message: "Archivo Excel generado con éxito",
            file: filePath
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al generar el archivo Excel",
            error: error.message
        })
    }
}