import { promises as fs } from 'fs'
import Configuraciones from '../config.js';
import {normalize, schema} from 'normalizr'

class ContenedorArchivo {
    constructor(ruta) {
        this.ruta = `${Configuraciones.fileSystem.path}/${ruta}`;
    }

    async getAll() {
        try {
            const data = await fs.readFile(this.ruta);
            const messageList = JSON.parse(data)
            const mensajesNormalizados = this.normalizar(messageList)
            return mensajesNormalizados
        } catch (error) {
            throw new Error(error);
        }
    }

    async createMessage(obj) {
        try {
            const data = await fs.readFile(this.ruta)
            const mensajesProductos = JSON.parse(data)
            //const productoIncluido = arrayProductos.some((producto)=> producto.nombre == obj.nombre)
            
            //if (productoIncluido == false) {
                // Este if se encarga de generar el ID y que no se repita
                if (mensajesProductos.mensajes.length == 0) {
                    obj.id = 1
                } else {
                    const listaIds = mensajesProductos.mensajes.map((mensaje)=> {
                        return mensaje.id
                    })
                    obj.id = listaIds.pop() + 1
                }
                mensajesProductos.mensajes.push(obj)
                const arrayMensajesStringify = JSON.stringify(mensajesProductos)
                await fs.writeFile(this.ruta, `${arrayMensajesStringify}`)
        } catch (error) {
            throw new Error(`Error al crear: ${error}`)
        }
    }

    async normalizar(data){
        const schemaAuthor = new schema.Entity('users')
        const schemaMensajes = new schema.Entity('message', {
            author: schemaAuthor
        })
        const listaMensajes = new schema.Entity('listadoMensajes', {
            mensajes: [schemaMensajes]
        })
        const normalizado = normalize(data, listaMensajes)
        return normalizado
    }
}

export default ContenedorArchivo