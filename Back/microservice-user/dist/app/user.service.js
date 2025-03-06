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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const database_1 = require("../infrastructure/database");
const user_entity_1 = require("../domain/user.entity");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const exception_1 = require("../exceptions/exception");
class UserService {
    constructor() {
        this.userRepository = database_1.AppDataSource.getRepository(user_entity_1.User);
    }
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield this.userRepository.findOne({ where: { email: userData.email } });
            if (existingUser)
                throw new exception_1.EmailAlreadyInUseError();
            const existingDocument = yield this.userRepository.findOne({ where: { documentNumber: userData.documentNumber } });
            if (existingDocument)
                throw new exception_1.DNIAlreadyInUseError();
            if (!userData.password || userData.password.length < 6)
                throw new exception_1.WeakPasswordError();
            const hashedPassword = yield bcryptjs_1.default.hash(userData.password, 10);
            const newUser = this.userRepository.create(Object.assign(Object.assign({}, userData), { password: hashedPassword }));
            const savedUser = yield this.userRepository.save(newUser);
            if (!savedUser.id)
                throw new Error("Error saving user: ID not generated");
            return { id: savedUser.id, message: "User created successfully" };
        });
    }
    updateUser(userId, userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOne({ where: { id: userId } });
            if (!user)
                throw new exception_1.UserNotFoundError();
            if (userData.email) {
                const existingEmail = yield this.userRepository.findOne({ where: { email: userData.email } });
                if (existingEmail && existingEmail.id !== userId)
                    throw new exception_1.EmailAlreadyInUseError();
            }
            if (userData.documentNumber) {
                const existingDocument = yield this.userRepository.findOne({ where: { documentNumber: userData.documentNumber } });
                if (existingDocument && existingDocument.id !== userId)
                    throw new exception_1.DNIAlreadyInUseError();
            }
            Object.assign(user, userData);
            yield this.userRepository.save(user);
            return { message: "User updated successfully" };
        });
    }
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOne({ where: { id: userId } });
            if (!user)
                throw new exception_1.UserNotFoundError();
            yield this.userRepository.remove(user);
            return { message: "User deleted successfully" };
        });
    }
    loginUser(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOne({ where: { email } });
            if (!user)
                throw new exception_1.UserNotFoundError();
            const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
            if (!isPasswordValid)
                throw new exception_1.IncorrectPasswordError();
            const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || "secretKey", { expiresIn: "1h" });
            return { token };
        });
    }
}
exports.UserService = UserService;
