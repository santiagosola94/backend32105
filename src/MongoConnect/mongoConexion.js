import mongoose from 'mongoose'

mongoose.connect('mongodb+srv://coderAdministrador:estrella1724@cluster0.egttbnl.mongodb.net/usuarios', (err)=>{
    if (err) {
        return console.log('No se pudo conectar a mongo Atlas', err)
    } else{
        return console.log('Conectado a Mongo')
    }
})

const users = mongoose.model('usuarios', {
    username: String,
    password: String
})

export default users