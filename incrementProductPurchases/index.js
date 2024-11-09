const sql = require("mssql");
const connectDb = require("../dbConnection");

module.exports = async function (context, msg) {
    try {
        const pool = await connectDb();

        // Log para verificar o conteúdo de `msg`
        context.log("Mensagem recebida do Service Bus:", msg);

        // Acessa o `product_id` diretamente de `msg`
        const productId = msg.product_id;

        if (!productId) {
            console.error("ID do produto não encontrado na mensagem.");
            return;
        }

        await pool.request()
            .input("pid", sql.Int, productId)
            .query("UPDATE products SET compras = compras + 1 WHERE pid = @pid");

        console.log(`Compra registrada para o produto ID ${productId}.`);
    } catch (error) {
        console.error("Erro ao processar a mensagem do Service Bus:", error);
    }
};
