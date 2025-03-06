import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../infrastructure/database";

// 🛠 Definir la estructura base del usuario sin Sequelize
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
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

// 🛠 Para creación de usuario (sin `id`, `timestamps`)
interface UserCreationAttributes extends Optional<UserAttributes, "id" | "createdAt" | "updatedAt" | "deletedAt"> {}

// 🛠 Tipo para devolver solo datos planos (sin métodos Sequelize)
type UserPlainAttributes = Omit<User, keyof Model>;

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
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: { type: DataTypes.STRING, allowNull: false },
    lastname: { type: DataTypes.STRING, allowNull: false },
    age: { type: DataTypes.INTEGER, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    phone: { type: DataTypes.STRING, allowNull: false },
    gender: { type: DataTypes.ENUM("M", "F"), allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    documentType: { type: DataTypes.STRING, allowNull: false },
    documentNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    deletedAt: { type: DataTypes.DATE },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
    paranoid: true, // Soft delete
  }
);

export default User;
export { UserCreationAttributes, UserPlainAttributes };
