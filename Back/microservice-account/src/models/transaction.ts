import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../infrastructure/database";

// ✅ Definir atributos del modelo
interface TransactionAttributes {
    id: string; // 🔄 Cambiado a UUID
    account_id: string; // 🔄 También UUID para relacionarlo con `Account`
    type: "income" | "outcome";
    amount: number;
    date: Date;
    updatedAt: Date;
}

// ✅ Definir atributos opcionales para la creación
interface TransactionCreationAttributes extends Optional<TransactionAttributes, "id"> {}

export class Transaction extends Model<TransactionAttributes, TransactionCreationAttributes> implements TransactionAttributes {
    public id!: string;
    public account_id!: string;
    public type!: "income" | "outcome";
    public amount!: number;
    public date!: Date;
    public updatedAt!: Date;
}

Transaction.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4, // ✅ Generación automática
            primaryKey: true,
        },
        account_id: {
            type: DataTypes.UUID, // ✅ Ahora es UUID
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM("income", "outcome"),
            allowNull: false,
        },
        amount: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        modelName: "Transaction",
        tableName: "transactions",
        timestamps: true,
    }
);
