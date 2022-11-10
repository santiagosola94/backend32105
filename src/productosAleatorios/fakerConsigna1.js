import {faker} from '@faker-js/faker'

const {commerce, image} = faker
faker.locale = 'es_MX'


const productosAleatorios = () => {
    const listaProductosAleatorios = []
    for (let index = 0; index < 5; index++) {
        const nuevoProducto = {nombre: commerce.productName(), precio: commerce.price(500,2000,0, '$'), foto: image.food()}
        listaProductosAleatorios.push(nuevoProducto)
    }

    return listaProductosAleatorios
}

export default productosAleatorios