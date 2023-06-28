const fs   = require("fs");
const path = require("path");

const ruta_json = path.join(__dirname, "data.json");

function escribir(contenido) {
    return new Promise((resolve, reject) => {
        fs.writeFile(ruta_json, JSON.stringify(contenido, null, "\t"), "utf8", (error) => {
            if (error) reject(new Error("Error. No se puede escribir"));

            resolve(true);
        });
    });
}

function leer() {
    return new Promise((resolve, reject) => {
        fs.readFile(ruta_json, "utf8", (error, result) => {
            if (error) reject(new Error("Error. No se puede leer"));

            resolve(JSON.parse(result));
        });
    });
}

function generarId(productos) {
    let mayorId = 0;

    productos.forEach((producto) => {
        if (Number(producto.id) > mayorId) {
            mayorId = Number(producto.id);
        }
    });

    return mayorId + 1;
}

async function findOneById(id) {
    if (!id) throw new Error("Error. Ingresar Id valido.");

    const productos = await leer();
    const producto  = productos.find((element) => element.id === id);

    if (!producto) throw new Error(`Error. El Id ${id} no corresponde a un producto existente.`);

    return producto;
}

async function findAll() {
    const productos = await leer();
    return productos;
}

async function create(producto) {
    if (!producto?.rubro || !producto?.descripcion || !producto?.precio || !producto?.stock ) throw new Error("Error. Datos incompletos. Revisar");

    let productos = await leer();
    const productoConId = { id: generarId(productos), ...producto };

    productos.push(productoConId);
    await escribir(productos);

    return productoConId;
}

async function update(producto) {
    if (!producto?.id || !producto?.rubro || !producto?.descripcion || !producto?.precio || !producto?.stock) throw new Error("Error. Datos incompletos.");

    let productos   = await leer();
    const indice = productos.findIndex((element) => element.id === producto.id);

    if (indice < 0) throw new Error(`Error. El Id ${id} no corresponde a un producto existente.`);

    productos[indice] = producto;
    await escribir(producto);

    return productos[indice];
}

async function borrar(id) {
    if (!id) throw new Error("Error. Necesita ingresar Id Valida.");

    let productos   = await leer();
    const indice = productos.findIndex((element) => element.id === id);

    if (indice < 0) throw new Error(`Error. El Id ${id} no corresponde a un producto existente.`);

    const producto = productos[indice];
    productos.splice(indice, 1);
    await escribir(productos);

    return producto;
}

module.exports = { findOneById, findAll, create, update, borrar};