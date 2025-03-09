import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../infrastructure/database";
import dayjs from "dayjs";

interface AccountAttributes {
    id: string;
    number: string;
    placeholder: string;
    cvc: string;
    due_date: string;
    user_id: string;
    balance: number;
}

interface AccountCreationAttributes extends Optional<AccountAttributes, "id"> {}

export class Account extends Model<AccountAttributes, AccountCreationAttributes> implements AccountAttributes {
    public id!: string;
    public number!: string;
    public placeholder!: string;
    public cvc!: string;
    public due_date!: string;
    public user_id!: string;
    public balance!: number;
}

Account.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
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
            type: DataTypes.STRING,
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

Account.beforeCreate((account, options) => {
    account.number = Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join("");
    account.cvc = Math.floor(100 + Math.random() * 900).toString();
    const expirationDate = dayjs().add(4, "year");
    account.due_date = expirationDate.format("MM/YY");
  });

  export default Account;