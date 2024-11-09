const sql = require("mssql");
const config = {
    user: process.env.SQL_SERVER_USER,
    password: process.env.SQL_SERVER_PASSWORD,
    database: process.env.SQL_SERVER_DATABASE,
    server: process.env.SQL_SERVER_HOST,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: true,
        trustServerCertificate: false
    },
    connectionTimeout: 30000, // 30 segundos
    requestTimeout: 30000     // 30 segundos
};

let pool;

async function connectDb() {
    if (!pool) { // Verifica se o pool já está criado
        try {
            pool = await sql.connect(config);
            console.log("Conectado ao banco de dados com sucesso.");
        } catch (err) {
            console.error("Erro ao conectar ao banco de dados:", err);
            throw err;
        }
    }
    return pool;
}

module.exports = connectDb;
