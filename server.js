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

import session from 'express-session';
import MongoStore from 'connect-mongo';


import passport from "passport";
import { Strategy } from "passport-local";
import users from './src/MongoConnect/mongoConexion.js';
import bcrypt from 'bcrypt'

import flash from 'connect-flash'

import routerInfo from './src/Router/routerInfo.js';
import puerto from './src/minimist/minimist.js';
import routerAleatorio from './src/Router/api-randoms.js';
import configEnv from './configEnv.js';

//Configuracion de archivo .env
configEnv()


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

const advanceOptions = { useNewUrlParser: true, useUnifiedTopology: true }

app.use(session({
    secret: 'ASD123asd123ASD123asd123',
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://coderAdministrador:estrella1724@cluster0.egttbnl.mongodb.net/usuarios',
        mongoOptions: advanceOptions,
        ttl: 600
    }),
    resave: false,
    saveUninitialized: false
}))

/* rutas info y randoms*/

app.use(routerInfo)
app.use(routerAleatorio)

/* Rutas de Login/logout */
app.use(flash())



passport.use('register', new Strategy({passReqToCallback: true}, (req, username,password, done)=>{
    users.findOne({username}, (err, user)=>{
        if (err) return done(null, false)
        if (user) {return done(null, false, req.flash('message','El usuario ya existe'))}
        users.create({username, password: hashPassword(password)}, (err, user)=>{
            if (err) return done(null, false)
            return done(null, user)
        })
    })
}))

passport.use('login', new Strategy({passReqToCallback: true}, (req, username, password, done)=>{
    users.findOne({username}, (err, user)=>{
        if (err) return done(null, false)
        if (!user) return done(null, false, req.flash('message','El Usuario no existe'))
        if (!validarPassword(password, user.password)) return done(null, false, req.flash('message','Contraseña invalida'))
        if (user) return done(null, user)
    })
}))

const hashPassword = (pass)=>{
    return bcrypt.hashSync(pass, bcrypt.genSaltSync(10), null)
}

const validarPassword = (pass, passHash) => {
    return bcrypt.compareSync(pass, passHash)
}


passport.serializeUser((user, done)=> {
    done(null, user.username)
})

passport.deserializeUser((username, done)=>{
    users.findOne({username}, done)
})

app.use(passport.initialize())
app.use(passport.session())

const isLogged = (req,res,next)=>{
    req.isAuthenticated() ? next() : res.send({error: true, msj: "no estas loggeado"})
}

app.get('/register', (req,res)=>{
    res.render('register', {
        layout: 'register',
        message: req.flash('message')
    })
})

app.post('/register', passport.authenticate('register', {
    successRedirect: '/',
    failureRedirect: '/register',
    failureFlash: true
}));

app.get('/login', (req,res)=>{
    res.render('login', {
        layout: 'login',
        message: req.flash('message')
    })
})


app.post('/login', passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

app.get('/logout', isLogged, (req,res)=>{
    req.logout(function(err) {
        if (err) return res.send({error: err}); 
    })
    res.render('logout', {
        layout: 'logout'
    });
})

app.get('/', (req, res) => {
    if (req?.user?.username) {
        res.render('formulario', {
            layout: 'formulario',
            mostrarRegistro: false,
            usuario: req.user.username,
            productosLength: 1
        })
    } else {
        res.render('formulario', {
            layout: 'formulario',
            mostrarRegistro: true,
            productosLength: 1,
            message: req.flash('message')
        })
    }
})


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


httpServer.listen(puerto.port, () => {
    console.log(`Servidor Iniciado en el puerto:`, puerto.port)
})