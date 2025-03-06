import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../infrastructure/database";

// ✅ Definir atributos del modelo
interface AccountAttributes {
    id: string; // 🔄 Cambiado a UUID
    number: string;
    placeholder: string;
    cvc: string;
    due_date: Date;
    user_id: string;
    balance: number;
}

// ✅ Definir atributos opcionales para la creación
interface AccountCreationAttributes extends Optional<AccountAttributes, "id"> {}

export class Account extends Model<AccountAttributes, AccountCreationAttributes> implements AccountAttributes {
    public id!: string;
    public number!: string;
    public placeholder!: string;
    public cvc!: string;
    public due_date!: Date;
    public user_id!: string;
    public balance!: number;
}

Account.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4, // ✅ Generación automática
            primaryKey: true,
        },
        number: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        placeholder: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cvc: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        due_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: true,
        },
        balance: {
            type: DataTypes.DECIMAL(12, 2),
            defaultValue: 0,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Account",
        tableName: "accounts",
        timestamps: true,
        paranoid: true,
    }
);
