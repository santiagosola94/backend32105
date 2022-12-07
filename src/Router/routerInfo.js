import { Router } from "express";

const routerInfo = Router()

routerInfo.get('/info', (req,res)=>{
    const data = {
        argumentosDeEntrada: process.argv.splice(2),
        sistemaOperativo: process.platform,
        versionDeNode: process.version,
        memoriaReservada: JSON.stringify(process.memoryUsage().rss),
        pathDeEjecucion: process.execPath,
        processId: process.pid,
        carpetaProyecto: process.cwd()
    }
    res.send(data)
})

export default routerInfo