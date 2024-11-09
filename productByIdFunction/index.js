const sql = require("mssql");
const connectDb = require("../dbConnection");

module.exports = async function (context, req) {
    const responseHeaders = { "Content-Type": "application/json" };
    const method = req.method;
    const pid = parseInt(context.bindingData.pid, 10); // Converte o `pid` para um número inteiro

    if (isNaN(pid)) {
        context.res = {
            status: 400,
            body: "O parâmetro 'pid' deve ser um número válido."
        };
        return;
    }

    try {
        const pool = await connectDb();

        if (method === "PUT") {
            const { name, description, compras } = req.body;
            let query = "UPDATE products SET ";
            const params = [];

            if (name !== undefined) {
                query += "name = @name, ";
                params.push({ name: "name", value: name, type: sql.NVarChar });
            }
            if (description !== undefined) {
                query += "description = @description, ";
                params.push({ name: "description", value: description, type: sql.NVarChar });
            }
            if (compras !== undefined) {
                query += "compras = @compras, ";
                params.push({ name: "compras", value: compras, type: sql.Int });
            }

            query = query.slice(0, -2); // Remove a última vírgula
            query += " WHERE pid = @pid";
            params.push({ name: "pid", value: pid, type: sql.Int });

            const request = pool.request();
            params.forEach(param => request.input(param.name, param.type, param.value));
            await request.query(query);

            context.res = {
                status: 200,
                headers: responseHeaders,
                body: { message: "Produto atualizado com sucesso!" }
            };
        } else if (method === "DELETE") {
            await pool.request().input("pid", sql.Int, pid).query("DELETE FROM products WHERE pid = @pid");
            context.res = {
                status: 200,
                headers: responseHeaders,
                body: { message: "Produto deletado com sucesso!" }
            };
        } else {
            context.res = {
                status: 405,
                body: "Método não suportado"
            };
        }
    } catch (error) {
        console.error("Erro ao manipular produto por ID:", error);
        context.res = {
            status: 500,
            headers: responseHeaders,
            body: "Erro ao manipular produto por ID"
        };
    }
};
