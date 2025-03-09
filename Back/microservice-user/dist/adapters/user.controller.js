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
exports.validateUserController = exports.loginUserController = exports.updateUserController = exports.deleteUserController = exports.getUserController = exports.createUserController = exports.getAllUsersController = void 0;
const exception_1 = require("../exceptions/exception");
const create_user_use_case_1 = require("../app/use-cases/create-user.use-case");
const get_user_use_case_1 = require("../app/use-cases/get-user.use-case");
const update_user_use_case_1 = require("../app/use-cases/update-user.use.case");
const delete_user_use_case_1 = require("../app/use-cases/delete-user.use-case");
const login_user_use_case_1 = require("../app/use-cases/login-user.use-case");
const get_all_user_use_case_1 = require("../app/use-cases/get-all-user.use-case");
const user_repository_impl_1 = require("../app/repositories/user.repository.impl");
const userRepository = new user_repository_impl_1.UserRepositoryImpl();
const createUserUseCase = new create_user_use_case_1.CreateUserUseCase(userRepository);
const updateUserUseCase = new update_user_use_case_1.UpdateUserUseCase(userRepository);
const deleteUserUseCase = new delete_user_use_case_1.DeleteUserUseCase(userRepository);
const loginUserUseCase = new login_user_use_case_1.LoginUserUseCase(userRepository);
const getUserUseCase = new get_user_use_case_1.GetUserUseCase(userRepository);
const getAllUsersUseCase = new get_all_user_use_case_1.GetAllUsersUseCase(userRepository);
const getAllUsersController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield getAllUsersUseCase.execute();
        res.status(200).json(users);
    }
    catch (error) {
        next(error);
    }
});
exports.getAllUsersController = getAllUsersController;
const createUserController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield createUserUseCase.execute(req.body);
        res.status(201).json(result);
    }
    catch (error) {
        next(error);
    }
});
exports.createUserController = createUserController;
const getUserController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = Number(req.params.id);
        if (isNaN(userId)) {
            res.status(400).json({ error: "Invalid user ID" });
            return;
        }
        const user = yield getUserUseCase.execute(userId);
        if (!user || user.deletedAt) {
            throw new exception_1.UserNotFoundError();
        }
        res.status(200).json(user);
    }
    catch (error) {
        next(error);
    }
});
exports.getUserController = getUserController;
const deleteUserController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = Number(req.params.id);
        if (isNaN(userId))
            throw new Error("Invalid user ID");
        yield deleteUserUseCase.execute(userId);
        res.status(200).json({ message: "User deleted successfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteUserController = deleteUserController;
const updateUserController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = Number(req.params.id);
        if (isNaN(userId))
            throw new Error("Invalid user ID");
        const updatedUser = yield updateUserUseCase.execute(userId, req.body);
        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    }
    catch (error) {
        next(error);
    }
});
exports.updateUserController = updateUserController;
const loginUserController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const response = yield loginUserUseCase.execute(email, password);
        res.json(response);
    }
    catch (error) {
        next(error);
    }
});
exports.loginUserController = loginUserController;
const validateUserController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json({ message: "Token is valid", user: req.user });
    }
    catch (error) {
        next(error);
    }
});
exports.validateUserController = validateUserController;
