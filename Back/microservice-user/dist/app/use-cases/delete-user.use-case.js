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
exports.DeleteUserUseCase = void 0;
const exception_1 = require("../../exceptions/exception");
class DeleteUserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    execute(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("🚨 Eliminando usuario ID:", userId);
            const user = yield this.userRepository.findUserById(userId);
            if (!user)
                throw new exception_1.UserNotFoundError();
            yield this.userRepository.deleteUser(userId);
            console.log("✅ Usuario eliminado correctamente:", userId);
            return { message: "User deleted successfully" };
        });
    }
}
exports.DeleteUserUseCase = DeleteUserUseCase;
