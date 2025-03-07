import { Op } from "sequelize";
import User, { UserCreationAttributes } from "../../models/user.model";
import { UserRepository } from "./user.repository";

export class UserRepositoryImpl implements UserRepository {
  async createUser(userData: UserCreationAttributes): Promise<User> {
    return await User.create(userData);
  }

  async getUserById(id: string): Promise<User | null> {
    return await User.findByPk(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await User.findOne({ where: { email } });
  }

  async getUserByDocument(documentNumber: string): Promise<User | null> {
    return await User.findOne({ where: { documentNumber } });
  }

  async getUserByPhone(phone: string): Promise<User | null> {
    return await User.findOne({ where: { phone } });
  }

  async updateUser(id: string, updatedData: Partial<UserCreationAttributes>): Promise<User | null> {
    const user = await User.findByPk(id);
    if (!user) return null;

    await user.update(updatedData);
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    const user = await User.findByPk(id);
    if (!user) return;

    await user.update({ deletedAt: new Date() });
  }
}
