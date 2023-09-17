const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const User = require('./userModel');
const Product = require('./productModel');
const Cart = require('./cartModel');

exports.getCart = async (req, res) => {
    try {
        const userId = req.user.userID;
        console.log("UserID:", userId);

        const cart = await Cart.findOne({ UsuarioID: userId }).populate('Productos.ProductoID');

        if (!cart) {
            return res.status(404).json({ Mensaje: "Carrito de compra no encontrado." });
        }

        res.json(cart);
    } catch (error) {
        res.status(500).json({ Mensaje: "Error al obtener el carrito de compra." });
    }
};

exports.updateCartItem = async (req, res) => {
    try {
        const userId = req.user._id;
        const { ProductoID, Cantidad } = req.body;

        const product = await Product.findById(ProductoID);
        if (!product) {
            return res.status(404).json({ Mensaje: "Producto no encontrado." });
        }

        if (Cantidad > product.Disponibilidad) {
            return res.status(400).json({ Mensaje: "No hay suficiente disponibilidad del producto." });
        }

        await Cart.updateOne(
            { UsuarioID: userId, "Productos.ProductoID": ProductoID },
            { "Productos.$.Cantidad": Cantidad }
        );

        res.json({ Mensaje: "Cantidad de producto actualizada en el carrito." });
    } catch (error) {
        res.status(500).json({ Mensaje: "Error al actualizar el carrito de compra." });
    }
};

exports.deleteCartItem = async (req, res) => {
    try {
        const userId = req.user._id;
        const { ProductoID } = req.body;

        await Cart.updateOne(
            { UsuarioID: userId },
            { $pull: { Productos: { ProductoID: ProductoID } } }
        );

        res.json({ Mensaje: "Producto eliminado del carrito de compra." });
    } catch (error) {
        res.status(500).json({ Mensaje: "Error al eliminar el producto del carrito de compra." });
    }
};

exports.addProductToCart = async (req, res) => {
    try {
        const userId = req.user.userID;
        console.log("UserID:", userId);

        const { ProductoID, Cantidad } = req.body;

        const product = await Product.findById(ProductoID);
        if (!product) {
            return res.status(404).json({ Mensaje: "Producto no encontrado." });
        }

        if (Cantidad > product.Disponibilidad) {
            return res.status(400).json({ Mensaje: "No hay suficiente disponibilidad del producto." });
        }

        let cart = await Cart.findOne({ UsuarioID: userId });

        if (!cart) {
            cart = new Cart({ UsuarioID: userId, Productos: [] });
        }

        const productInCart = cart.Productos.find(p => p.ProductoID.toString() === ProductoID);

        if (productInCart) {
            productInCart.Cantidad += Cantidad;
        } else {
            cart.Productos.push({ ProductoID, Cantidad });
        }

        await cart.save();

        res.json({ Mensaje: "Producto añadido al carrito exitosamente." });

    } catch (error) {
        res.status(500).json({ Mensaje: "Error al añadir producto al carrito.", error });
    }
};
