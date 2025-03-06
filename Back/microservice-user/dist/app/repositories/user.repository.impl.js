"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepositoryImpl = void 0;
const user_entity_1 = require("../../domain/user.entity");
const database_1 = require("../../infrastructure/database");
const typeorm_1 = require("typeorm");
class UserRepositoryImpl {
    constructor() {
        this.repository = database_1.AppDataSource.getRepository(user_entity_1.User); // ✅ Inicializamos el repositorio
    }
    findUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.findOne({
                where: { id: userId, deletedAt: (0, typeorm_1.IsNull)() }, // ✅ Usa IsNull() en lugar de `null`
            });
        });
    }
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = this.repository.create(userData);
            yield this.repository.save(user);
            return { id: user.id, message: "User created successfully" };
        });
    }
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.findOne({ where: { email } });
        });
    }
    findUserByDocument(documentNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.findOne({ where: { documentNumber } });
        });
    }
    updateUser(userId, userData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repository.update(userId, userData);
            return { message: "User updated successfully" };
        });
    }
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repository.update(userId, { deletedAt: new Date() }); // ✅ Marca como eliminado
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.find({ where: { deletedAt: (0, typeorm_1.IsNull)() } }); // ✅ Usa IsNull() para comparar nulos
        });
    }
}
exports.UserRepositoryImpl = UserRepositoryImpl;
