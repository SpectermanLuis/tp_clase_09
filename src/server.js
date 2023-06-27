const express = require("express");
const { findOneById, findAll, create, update, destroy } = require("./database/data.manager.js");
const dotenv = require('dotenv');


dotenv.config();
const server = express();

// Middlewares
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Obtener todos los productos: Ruta GET http://127.0.0.1:3000/productos
server.get('/productos', (req, res) => {
    findAll()
        .then((productos) => res.status(200).send(productos))
        .catch((error) => res.status(400).send(error.message));
});

// Obtener un producto específico: Ruta GET http://127.0.0.1:3000/productos/1
server.get('/productos/:id', (req, res) => {
    const { id } = req.params;

    findOneById(Number(id))
        .then((producto) => res.status(200).send(producto))
        .catch((error) => res.status(400).send(error.message));
});

// Crear un nuevo producto: Ruta POST http://127.0.0.1:3000/productos
server.post('/productos', (req, res) => {
    const { rubro, descripcion, precio, stock } = req.body;

    create({ rubro,descripcion,precio,stock })
        .then((productos) => res.status(201).send(productos))
        .catch((error) => res.status(400).send(error.message));
});

// Actualizar un producto específico: Ruta PUT http://127.0.0.1:3000/productos/1
server.put('/productos/:id', (req, res) => {
    const { id } = req.params;
    const { rubro,descripcion,precio,stock } = req.body;

    update({ id: Number(id), rubro,descripcion,precio,stock })
        .then((producto) => res.status(200).send(producto))
        .catch((error) => res.status(400).send(error.message));
});

// Eliminar un producto  específico: Ruta DELETE http://127.0.0.1:3000/productos/1
server.delete('/productos/:id', (req, res) => {
    const { id } = req.params;

    destroy(Number(id))
        .then((producto) => res.status(200).send(producto))
        .catch((error) => res.status(400).send(error.message));
});

// Control de rutas inexistentes
server.use('*', (req, res) => {
    res.status(404).send(`<h1>Error 404</h1><h3>La URL indicada no existe en este servidor</h3>`);
});

// Método oyente de peticiones
server.listen(process.env.SERVER_PORT, process.env.SERVER_HOST, () => {
    console.log(`Ejecutandose en http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/productos`);
});