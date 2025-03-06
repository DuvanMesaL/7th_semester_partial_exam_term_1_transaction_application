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
exports.CreateUserUseCase = void 0;
const exception_1 = require("../../exceptions/exception");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class CreateUserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    execute(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userData.email)
                throw new exception_1.AppError("Email is required", 400);
            const existingUser = yield this.userRepository.findUserByEmail(userData.email);
            if (existingUser)
                throw new exception_1.EmailAlreadyInUseError();
            const existingDocument = yield this.userRepository.findUserByDocument(userData.documentNumber);
            if (existingDocument)
                throw new exception_1.DNIAlreadyInUseError();
            if (!userData.password || userData.password.length < 6)
                throw new exception_1.WeakPasswordError();
            const hashedPassword = yield bcryptjs_1.default.hash(userData.password, 10);
            return this.userRepository.createUser(Object.assign(Object.assign({}, userData), { password: hashedPassword }));
        });
    }
}
exports.CreateUserUseCase = CreateUserUseCase;
