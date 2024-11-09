const sql = require("mssql");
const connectDb = require("../dbConnection");

module.exports = async function (context, req) {
    const responseHeaders = { "Content-Type": "application/json" };
    const method = req.method;

    try {
        const pool = await connectDb();

        if (method === "POST") {
            const { name, description } = req.body;
            await pool.request()
                .input("name", sql.NVarChar, name)
                .input("description", sql.NVarChar, description)
                .query("INSERT INTO products (name, description) VALUES (@name, @description)");

            context.res = {
                status: 201,
                headers: responseHeaders,
                body: { message: "Produto criado com sucesso!" }
            };
        } else if (method === "GET") {
            const result = await pool.request().query("SELECT * FROM products");
            context.res = {
                status: 200,
                headers: responseHeaders,
                body: result.recordset
            };
        } else {
            context.res = {
                status: 405,
                body: "Método não suportado"
            };
        }
    } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        context.res = {
            status: 500,
            headers: responseHeaders,
            body: "Erro ao buscar produtos"
        };
    }
};
