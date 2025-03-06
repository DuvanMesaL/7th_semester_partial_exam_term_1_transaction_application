'use strict';
import { Model, DataTypes } from "sequelize";
import sequelize from "../dist/infrastructure/database.js";

class User extends Model {
  static associate(models) {
    // Define asociaciones aquí si es necesario
  }
}

User.init({
  name: DataTypes.STRING,
  lastname: DataTypes.STRING,
  age: DataTypes.INTEGER,
  email: DataTypes.STRING,
  phone: DataTypes.STRING,
  gender: DataTypes.ENUM("M", "F"),
  password: DataTypes.STRING
}, {
  sequelize,
  modelName: "User",
});

export default User;
