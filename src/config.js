const Configuraciones = {
    fileSystem: {
        path: './db'
    },
    mySQL: {
        client: "mysql",
        connection: {
            host: "localhost",
            port: 3306,
            user: "root",
            database: "entrega8"
        }
    },
    sqliteConfig: {
        client: "sqlite3", 
        connection: {
            filename: "./sqlite3/db/ecommerce.sqlite",
        },
        useNullAsDefault: true
    }
}

export default Configuraciones