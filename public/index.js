const socket = io.connect()

socket.on('mensaje', (data)=>{
    console.log(data)
})

socket.on('listadoProductos', (data)=>{
    console.log(data)
    render(data)
})

socket.on('mensajes', (data)=>{
    console.log(data)
    const listaMensajes = data.map((mensaje)=>
    `
        <li>
            <span style="color:blue"><b>${mensaje.email}</b></span> 
            <span style="color:red">[${mensaje.fecha}] :</span>
            <span style="color:green">${mensaje.msj}</span>
        </li>
    `).join(" ")
    document.getElementById('historialMensajes').innerHTML = listaMensajes
})



function render(data){
    const ArrayProductos = data.map((producto)=>
        `<tr>
            <td>${producto.title}</td>
            <td>$${producto.price}</td>
            <td><img src=${producto.thumbnail} alt=""></td>
        </tr>`
    ).join(" ")
    document.getElementById('cuerpoTabla').innerHTML = ArrayProductos
}

function crearProducto(){
    const titulo = document.getElementById('title').value
    const precio = document.getElementById('price').value
    const thumb = document.getElementById('thumbnail').value

    socket.emit('productoAgregado', {title: titulo, price: precio, thumbnail: thumb})
    return false;
}

function mensajeEnviado(){
    const emailUsuario = document.getElementById('emailUsuario').value
    const mensajeUsuario = document.getElementById('mensajeUsuario').value
    document.getElementById('mensajeUsuario').value = ""
    const fecha = new Date()

    if(emailUsuario != "") {
        socket.emit('mensajeEnviado', {email: emailUsuario, fecha, msj: mensajeUsuario})
        document.getElementById('emailIncorrecto').innerHTML = ""
    } else {
        document.getElementById('emailIncorrecto').innerHTML = '<div class="alert alert-warning">¡Ingrese un email!</div>'
    }
}