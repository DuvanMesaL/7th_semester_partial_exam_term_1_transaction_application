"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    static associate(models) {
      
      Account.hasMany(models.Transaction, {
        foreignKey: "account_id",
        as: "transactions",
        onDelete: "CASCADE",
      });
    }
  }
  Account.init(
    {
      number: DataTypes.STRING,
      placeholder: DataTypes.STRING,
      cvc: DataTypes.STRING,
      due_date: DataTypes.STRING,
      user_id: DataTypes.UUID,
      balance: DataTypes.DECIMAL,
    },
    {
      sequelize,
      modelName: "Account",
      tableName: "accounts",
    }
  );
  return Account;
};
