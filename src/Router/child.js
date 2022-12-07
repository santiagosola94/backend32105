process.on('message', msg => {
    console.log('mensaje del padre', msg)
    process.send({NumerosAleatorios: aleatorio(msg.cant)})
})

const aleatorio = (cant)=>{
    
    if (!cant) {
        console.log('La cantidad no fue definida')
        cant = 100000000
    }
    
    const contadorNumeros = []
    
    for (let index = 0; index < cant; index++) {
        contadorNumeros.push(Math.floor(Math.random() * 1000 + 1 ))
    }
    
    const repetidos = {};
    
    contadorNumeros.forEach(function(numero){
    repetidos[numero] = (repetidos[numero] || 0) + 1;
    });
    
    return repetidos
}