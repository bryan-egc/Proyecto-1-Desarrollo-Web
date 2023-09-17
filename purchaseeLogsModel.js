const mongoose = require('mongoose');

const PurchaseLogSchema = new mongoose.Schema({
    UsuarioID: {
        type: String,
        ref: 'User',
        required: true
    },
    Productos: [{
        ProductoID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        Cantidad: {
            type: Number,
            required: true
        }
    }],
    FechaCompra: {
        type: Date,
        default: Date.now
    },
    Total: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('bitacora_compras', PurchaseLogSchema);
