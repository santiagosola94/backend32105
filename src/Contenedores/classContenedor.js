import knex from "knex";

class Contenedor {
    constructor(configuracion, tabla) {
        this.knex = knex(configuracion)
        this.table = tabla
    }

    async getAll() {
        try {
            return await this.knex.select("*").from(this.table)
        } catch (error) {
            throw new Error(error);
        }
    }

    async getById(numero) {
        try {
            return await this.knex.select("*").from(this.table).where("id", numero)
        } catch (error) {
            throw new Error(error);
        }
    }

    async createProduct(obj) {
        try {
            return await this.knex.insert(obj).into(this.table)
        } catch (error) {
            throw new Error(error)
        }
    }

    async updateProduct(id, obj) {
        try {
            return await this.knex.from(this.table).where("id", id).update(obj)
        } catch (error) {
            throw new Error(error)
        }
    }

    async deleteProduct(number) {
        try {
            return await this.knex.from(this.table).where("id", number).del()
        } catch (error) {
            throw new Error(error)
        }
    }
}

export default Contenedor;