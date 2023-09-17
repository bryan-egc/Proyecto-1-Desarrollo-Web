const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./userRoutes');
const productRoutes = require('./productRoutes');
const cartRoutes = require('./cartRouter');
const purchaseRoutes = require('./purchaseRouter');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());  

mongoose.connect('mongodb+srv://desarrollo-web:umg123@desarrollo-web-proyecto.vzraoeo.mongodb.net/Proyecto_Final_DW', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Conectado a la base de datos MongoDB');
    })
    .catch(error => {
        console.error('Error al conectarse a la base de datos: ', error);
    });

app.get('/', (req, res) => {
    res.json({ message: 'API de E-commerce funcionando!' });
});

app.use('/api', userRoutes);
app.use('/api', productRoutes);
app.use('/api', cartRoutes);
app.use('/api', purchaseRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
