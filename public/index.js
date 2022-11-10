const socket = io()

socket.on('listadoProductos', (data) => {
    render(data)
})

socket.on('mensajes', (data) => {
    const schemaAuthor = new normalizr.schema.Entity('users')
    const schemaMensajes = new normalizr.schema.Entity('message', {
        author: schemaAuthor
    })
    const listadoMensajes = new normalizr.schema.Entity('listadoMensajes', {
        mensajes: [schemaMensajes]
    })
    const normalizado = JSON.stringify(data).length

    const objDenormalizado = normalizr.denormalize(data.result, listadoMensajes, data.entities)
    const denormalizadoLength = JSON.stringify(objDenormalizado).length

    const porcentajeDeCompresion = parseInt((denormalizadoLength - normalizado)*100/denormalizadoLength)

    console.log(`Normalizado: ${normalizado}`)
    console.log(`Denormalizado: ${denormalizadoLength}`)
    console.log(`Porcentaje de compresion: ${porcentajeDeCompresion}%`)

    const listaMensajes = objDenormalizado.mensajes.map((mensaje) =>
        `
        <li>
            <span style="color:blue"><b>${mensaje.author.id}</b></span> 
            <span style="color:red">[${mensaje.date}] :</span>
            <span style="color:green">${mensaje.text}</span>
            <span><img src=${mensaje.author.avatar}></span>
        </li>
    `).join(" ")
    document.getElementById('historialMensajes').innerHTML = listaMensajes
    document.getElementById('porcentajeCompresion').innerHTML = `<h2>Porcentaje de compresion: ${porcentajeDeCompresion}%</h2>`
})



function render(data) {
    const ArrayProductos = data.map((producto) =>
        `<tr>
            <td>${producto.Nombre}</td>
            <td>$${producto.Precio}</td>
            <td><img src=${producto.Foto} alt=""></td>
        </tr>`
    ).join(" ")
    document.getElementById('cuerpoTabla').innerHTML = ArrayProductos
}

async function crearProducto() {
    const Nombre = document.getElementById('Nombre').value
    const Precio = document.getElementById('Precio').value
    const Foto = document.getElementById('Foto').value
    const Descripcion = document.getElementById('Descripcion').value
    const Stock = document.getElementById('Stock').value
    const Codigo = document.getElementById('Codigo').value

    const date = new Date()
    let Timestamp = date.toLocaleString();
    const nuevoProducto = { nombre: Nombre, precio: Precio, foto: Foto, descripcion: Descripcion, stock: Stock, codigo: Codigo, timestamp: Timestamp }
    socket.emit('productoAgregado', nuevoProducto)
    return false;
}



function mensajeEnviado() {
    const emailUsuario = document.getElementById('emailUsuario').value
    const nombreUsuario = document.getElementById('nombrelUsuario').value
    const apellidolUsuario = document.getElementById('apellidoUsuario').value
    const edadUsuario = document.getElementById('edadUsuario').value
    const aliasUsuario = document.getElementById('aliasUsuario').value
    const avatarUsuario = document.getElementById('avatarUsuario').value
    const mensajeUsuario = document.getElementById('mensajeUsuario').value
    document.getElementById('mensajeUsuario').value = ""

    const fecha = new Date()
    let fechaParseada = fecha.toLocaleString();

    if (emailUsuario != "") {
        socket.emit('mensajeEnviado', { 
            author: {
                id: emailUsuario,
                nombre: nombreUsuario,
                apellido: apellidolUsuario,
                edad: edadUsuario,
                alias: aliasUsuario,
                avatar: avatarUsuario
            }, 
            text: mensajeUsuario, 
            date: fechaParseada
        })
        document.getElementById('emailIncorrecto').innerHTML = ""
    } else {
        document.getElementById('emailIncorrecto').innerHTML = '<div class="alert alert-warning">¡Ingrese un email!</div>'
    }
}



