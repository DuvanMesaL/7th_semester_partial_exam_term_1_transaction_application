module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: { type: Sequelize.STRING, allowNull: false },
      lastname: { type: Sequelize.STRING, allowNull: false },
      age: { type: Sequelize.INTEGER, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      phone: { type: Sequelize.STRING, allowNull: false, unique: true },
      gender: { type: Sequelize.ENUM("M", "F"), allowNull: false },
      password: { type: Sequelize.STRING, allowNull: false },
      documentType: { type: Sequelize.STRING, allowNull: false },
      documentNumber: { type: Sequelize.STRING, allowNull: false, unique: true },
      refreshToken: { type: Sequelize.STRING, allowNull: true },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal("NOW()"), allowNull: false },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal("NOW()"), allowNull: false },
      deletedAt: { type: Sequelize.DATE, allowNull: true },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("users");
  }
};
