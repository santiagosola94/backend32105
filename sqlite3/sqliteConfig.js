const sqliteConfig = {
    client: "sqlite3", 
    connection: {
        filename: "./sqlite3/db/ecommerce.sqlite",
    },
    useNullAsDefault: true
}
export default sqliteConfig;