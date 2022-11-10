import express from 'express'

import {Server as HTTPServer} from 'http'
import {Server as SocketServer } from 'socket.io'
import path from 'path';
import {fileURLToPath} from 'url';
import handlebars from 'express-handlebars'
import creacionDeTablas from './crearTablas.js'

import Contenedor from './src/Contenedores/classContenedor.js'
import Configuraciones from './src/config.js'

import ContenedorArchivo from './src/Contenedores/ContenedorArchivo.js'
import productosAleatorios from './src/productosAleatorios/fakerConsigna1.js'



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const httpServer = new HTTPServer(app)
const io = new SocketServer(httpServer)

const db = new Contenedor(Configuraciones.mySQL, "productos")
const mensajesArchivo = new ContenedorArchivo('mensajes.json')
creacionDeTablas()


app.set("json spaces", 2)
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname + "/public"));

app.engine('hbs', handlebars.engine({
    extname: 'hbs',
    layoutsDir: __dirname + '/views',
    defaultLayout: 'formulario',
}))

app.set('views', './views')
app.set('view engine', 'hbs')



io.on('connection', async(socket) => {
    console.log('un usuario se ha conectado')
    socket.emit('listadoProductos', await db.getAll())
    
    socket.on('productoAgregado', async (data) => {
        await db.createProduct(data)
        io.sockets.emit('listadoProductos', await db.getAll())
    })
    
    socket.emit('mensajes', await mensajesArchivo.getAll())
    
    socket.on('mensajeEnviado', async(data) => {
        console.log(data)
        mensajesArchivo.createMessage(data)
        io.sockets.emit('mensajes', await mensajesArchivo.getAll())
    })
})

app.get('/', (req, res) => {
    res.render('formulario', {
        layout: 'formulario',
        productosLength: 1
    })
})

app.get("/api/productos", async (req,res)=>{
    const getProductos = await db.getAll()
    res.send(getProductos)
})

app.get("/api/productos/:id", async (req,res)=>{
    const {id} = req.params
    const parseID = parseInt(id)
    const getProductos = await db.getById(parseID)
    res.send(getProductos)
})

app.post("/api/productos", async(req,res)=>{
    const {nombre, descripcion, codigo, foto, precio, stock} = req.body
    const date = new Date()
    let timestamp = date.toLocaleString();
    const nuevoProducto = {nombre, descripcion, foto, codigo, precio, stock, timestamp}
    await db.createProduct(nuevoProducto)

    res.send(nuevoProducto)
})

app.put("/api/productos/:id", async (req,res)=>{
    const {id} = req.params
    const nuevoProducto = req.body

    await db.updateProduct(id, nuevoProducto)
    res.send({productoActualizado: true, modificacion: nuevoProducto})
})

app.delete("/api/productos/:id", async (req,res)=>{
    const {id} = req.params
    await db.deleteProduct(id)

    res.send({productoEliminado: true})
})

app.get("/api/productos-test", (req,res)=>{
    const productos = productosAleatorios()
    res.send(productos)
})



httpServer.listen(8080, () => {
    console.log('Servidor Iniciado')
})