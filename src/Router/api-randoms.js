import { Router } from "express";
import {fork} from 'child_process'

const forked = fork('./src/Router/child.js')

const routerAleatorio = Router()

routerAleatorio.get('/api/randoms', (req,res)=>{
    let {cant} = req.query
    forked.send({mensaje: 'inicio', cant})

    forked.on('message', msg =>{
        console.log(msg)
    } )

    res.send('test')
})

export default routerAleatorio