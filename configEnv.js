import * as dotenv from 'dotenv'

const configEnv = ()=>{
    dotenv.config()
    
    console.log({test: process.env.TEST})
}

export default configEnv
