const express = require('express');
const router = express.Router();

const verifyToken = require('./authMiddleware');
const { getCart, updateCartItem, deleteCartItem, addProductToCart } = require('./cartController');

router.get('/carrito', verifyToken, getCart);

router.post('/carrito', verifyToken, updateCartItem);

router.delete('/carrito', verifyToken, deleteCartItem);

router.post('/carrito/add', verifyToken, addProductToCart);

module.exports = router;
