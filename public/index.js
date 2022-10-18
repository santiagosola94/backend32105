const socket = io()

socket.on('listadoProductos', (data) => {
    render(data)
})

socket.on('mensajes', (data) => {
    const listaMensajes = data.map((mensaje) =>
        `
        <li>
            <span style="color:blue"><b>${mensaje.email}</b></span> 
            <span style="color:red">[${mensaje.fecha}] :</span>
            <span style="color:green">${mensaje.msj}</span>
        </li>
    `).join(" ")
    document.getElementById('historialMensajes').innerHTML = listaMensajes
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
    const mensajeUsuario = document.getElementById('mensajeUsuario').value
    document.getElementById('mensajeUsuario').value = ""

    const fecha = new Date()
    let fechaParseada = fecha.toLocaleString();

    if (emailUsuario != "") {
        socket.emit('mensajeEnviado', { email: emailUsuario, fecha: fechaParseada, msj: mensajeUsuario })
        document.getElementById('emailIncorrecto').innerHTML = ""
    } else {
        document.getElementById('emailIncorrecto').innerHTML = '<div class="alert alert-warning">¡Ingrese un email!</div>'
    }
}



