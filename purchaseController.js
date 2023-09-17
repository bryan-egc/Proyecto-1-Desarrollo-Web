const jwt = require('jsonwebtoken');
const User = require('./userModel');
const Product = require('./productModel');
const Cart = require('./cartModel');
const PurchaseLog = require('./purchaseeLogsModel');

exports.purchase = async (req, res) => {
    try {
        const userId = req.user.userID;

        const cart = await Cart.findOne({ UsuarioID: userId }).populate('Productos.ProductoID');

        if (!cart || cart.Productos.length === 0) {
            return res.status(400).json({ Mensaje: 'El carrito de compras está vacío.' });
        }

        const productsToUpdate = [];
        let totalAmount = 0;

        cart.Productos.forEach(async item => {
            const product = await Product.findById(item.ProductoID._id);
            product.Disponibilidad -= item.Cantidad;
            totalAmount += product.PrecioDescuento * item.Cantidad;

            productsToUpdate.push(product.save());
        });

        await Promise.all(productsToUpdate);

        const newPurchaseLog = new PurchaseLog({
            UsuarioID: userId,
            Productos: cart.Productos,
            Total: totalAmount
        });

        await newPurchaseLog.save();

        cart.Productos = [];
        await cart.save();

        res.json({ Mensaje: 'Compra realizada con éxito.' });

    } catch (error) {
        console.error('Error al realizar la compra: ', error);
        res.status(500).json({ Mensaje: 'Error al realizar la compra.' });
    }
};
