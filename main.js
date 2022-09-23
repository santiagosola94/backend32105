const express = require('express')
const fs = require('fs')
const app = express()

const handlebars = require('express-handlebars')

const { Server: HTTPServer } = require('http')
const { Server: SocketServer } = require('socket.io')

const httpServer = new HTTPServer(app)
const io = new SocketServer(httpServer)

const productos = [{ title: 'Calculadora', price: 7500, thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-158.png' },
{ title: 'Cuaderno', price: 3200, thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/book-note-paper-school-158.png' },
{ title: 'Lapiz', price: 400, thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/pencil-pen-stationery-school-158.png' }]

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + "/public"));

app.engine('hbs', handlebars.engine({
    extname: 'hbs',
    layoutsDir: __dirname + '/views',
    defaultLayout: 'formulario',
}))

app.set('views', './views')
app.set('view engine', 'hbs')

io.on('connection', (socket) => {
    console.log('un usuario se ha conectado')
    socket.emit('listadoProductos', productos)
    socket.on('productoAgregado', (data) => {
        productos.push(data)
        io.sockets.emit('listadoProductos', productos)
    })
    socket.emit('mensajes', leerMensaje())
    socket.on('mensajeEnviado', (data) => {
        const leer = fs.readFileSync('./public/db/mensajes.json')
        const parsearMensajes = JSON.parse(leer)
        parsearMensajes.push(data)
        const stringifyProductos = JSON.stringify(parsearMensajes)
        fs.writeFileSync('./public/db/mensajes.json', `${stringifyProductos}`)
        io.sockets.emit('mensajes', leerMensaje())
    })
})


app.get('/', (req, res) => {
    res.render('formulario', {
        layout: 'formulario',
        productosLength: productos.length
    })
})


function leerMensaje() {
    const leer = fs.readFileSync('./public/db/mensajes.json')
    const parsearMensajes = JSON.parse(leer)
    return parsearMensajes
}


httpServer.listen(8080, () => {
    console.log('Servidor Iniciado')
})