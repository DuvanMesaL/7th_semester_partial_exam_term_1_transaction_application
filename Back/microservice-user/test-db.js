import  sequelize  from "./dist/infrastructure/database.js";
import userModel from "./models/user.js";

const User = userModel(sequelize);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a la base de datos exitosa.");

    const users = await User.findAll();
    console.log("📌 Usuarios en la base de datos:", users);

    await sequelize.close();
  } catch (error) {
    console.error("❌ Error en la conexión:", error);
  }
})();
