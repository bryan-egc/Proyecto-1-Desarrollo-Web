const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    Identificador: String,
    Nombre: String,
    Marca: String,
    Disponibilidad: Number,
    Descuento: Number,
    PrecioDescuento: Number,
    Imagen: String,
    Descripcion: String,
    Categorias: [String],
    Habilitado: { type: Boolean, default: true } 
});

module.exports = mongoose.model('products', ProductSchema);
