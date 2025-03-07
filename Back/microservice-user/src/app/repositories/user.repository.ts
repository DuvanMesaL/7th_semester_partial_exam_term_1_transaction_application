import User, { UserCreationAttributes } from "../../models/user.model";

export interface UserRepository {
  createUser(userData: UserCreationAttributes): Promise<InstanceType<typeof User>>;
  getUserById(id: string): Promise<InstanceType<typeof User> | null>;
  getAllUsers(): Promise<InstanceType<typeof User>[]>;
  getUserByEmail(email: string): Promise<InstanceType<typeof User> | null>;
  getUserByDocument(documentNumber: string): Promise<InstanceType<typeof User> | null>;
  getUserByPhone(phone: string): Promise<InstanceType<typeof User> | null>;
  updateUser(id: string, updatedData: Partial<UserCreationAttributes>): Promise<InstanceType<typeof User> | null>;
  deleteUser(id: string): Promise<void>;
}
