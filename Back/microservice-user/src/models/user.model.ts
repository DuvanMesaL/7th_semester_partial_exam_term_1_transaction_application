import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../infrastructure/database";
import bcrypt from "bcrypt";

interface UserAttributes {
  id: string;
  name: string;
  lastname: string;
  age: number;
  email: string;
  phone: string;
  gender: "M" | "F";
  password: string;
  documentType: string;
  documentNumber: string;
  refreshToken?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id" | "createdAt" | "updatedAt" | "deletedAt"> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public name!: string;
  public lastname!: string;
  public age!: number;
  public email!: string;
  public phone!: string;
  public gender!: "M" | "F";
  public password!: string;
  public documentType!: string;
  public documentNumber!: string;
  public refreshToken?: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;
}

User.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    lastname: { type: DataTypes.STRING, allowNull: false },
    age: { type: DataTypes.INTEGER, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    phone: { type: DataTypes.STRING, allowNull: false, unique: true },
    gender: { type: DataTypes.ENUM("M", "F"), allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    documentType: { type: DataTypes.STRING, allowNull: false },
    documentNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
    refreshToken: { type: DataTypes.STRING, allowNull: true },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    deletedAt: { type: DataTypes.DATE },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
    paranoid: true,
  }
);

export default User;
export { UserCreationAttributes};
