import knex from "knex";
import Configuraciones from "./src/config.js";


const db = knex(Configuraciones.sqliteConfig)
const dbMySQL = knex(Configuraciones.mySQL)
const creacionDeTablas = ()=>{
    db.schema.hasTable('tablaMensajes').then(function (exists) {
            if (!exists) {
                console.log('Se ha creado tablaMensajes')
                return db.schema.createTable('tablaMensajes', (table) => {
                    table.increments("ID")
                    table.string("email").notNullable()
                    table.string("fecha").notNullable()
                    table.string("msj").notNullable()
                });
            } else {
                console.log('La tabla -tablaMensajes- ya esta creada')
            }
        })
        .catch((e) => {
            console.error(e);
        })
        .finally((e) => {
            db.destroy()
        });
    
    
    dbMySQL.schema.hasTable('productos').then(function (exists) {
            if (!exists) {
                console.log('Tabla Creada')
                return dbMySQL.schema.createTable('productos', (table) => {
                    table.increments("ID")
                    table.string("Nombre", 30).notNullable()
                    table.string("Descripcion").notNullable()
                    table.float("Precio")
                    table.integer("Stock")
                    table.string("Codigo", 10)
                    table.string("Foto")
                    table.string("Timestamp")
                });
            } else {
                console.log('La tabla -productos- ya esta creada')
            }
        })
        .catch((e) => {
            console.error(e);
        })
        .finally((e) => {
            dbMySQL.destroy()
        })
}
export default creacionDeTablas;