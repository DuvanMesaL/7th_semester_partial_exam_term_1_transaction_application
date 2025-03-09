import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(
    process.env.DB_NAME!,
    process.env.DB_USER!,
    process.env.DB_PASSWORD!,
    {
        host: process.env.DB_HOST,
        dialect: "postgres",
        port: Number(process.env.DB_PORT),
        logging: false,
    }
);

import "../models/account";
import "../models/transaction";

export const initializeDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Conectado a la base de datos de cuentas.");
        await sequelize.sync();
    } catch (error) {
        console.error("❌ Error al conectar la base de datos:", error);
        process.exit(1);
    }
};

