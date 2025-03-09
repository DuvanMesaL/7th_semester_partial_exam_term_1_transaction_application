"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {

      Transaction.belongsTo(models.Account, {
        foreignKey: "account_id",
        as: "account",
        onDelete: "CASCADE",
      });
    }
  }
  Transaction.init(
    {
      account_id: DataTypes.INTEGER,
      type: DataTypes.STRING,
      amount: DataTypes.DECIMAL,
      date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Transaction",
      tableName: "transactions",
    }
  );
  return Transaction;
};
