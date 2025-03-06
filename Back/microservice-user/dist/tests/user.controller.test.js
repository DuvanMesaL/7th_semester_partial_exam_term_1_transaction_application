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
const supertest_1 = __importDefault(require("supertest"));
const server_1 = require("../infrastructure/server");
const database_1 = require("../infrastructure/database");
const user_entity_1 = require("../domain/user.entity");
let token;
let userId;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, database_1.initializeDatabase)();
}));
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield database_1.AppDataSource.getRepository(user_entity_1.User).clear();
    // ✅ Crear un usuario de prueba con los nuevos campos
    const response = yield (0, supertest_1.default)(server_1.app)
        .post("/user")
        .send({
        name: "Test User",
        lastname: "Testing",
        email: "test@example.com",
        phone: "123456789",
        gender: "M",
        password: "test123",
        documentType: "CC",
        documentNumber: "1234567890"
    });
    console.log("Response Body (POST /user):", response.body);
    userId = response.body.id;
    if (!userId)
        throw new Error("Error: userId is undefined or null");
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, database_1.closeDatabase)();
    const resolvedServer = yield server_1.server;
    yield new Promise((resolve) => resolvedServer.close(resolve));
    console.log("Server closed after tests.");
}));
describe("User API", () => {
    it("Debe registrar un usuario correctamente", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.app)
            .post("/user")
            .send({
            name: "Pedro",
            lastname: "Gómez",
            email: "pedro@example.com",
            phone: "987654321",
            gender: "M",
            password: "123456",
            documentType: "PPT",
            documentNumber: "9876543210"
        });
        console.log("Response Body (POST /user):", response.body);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("message", "User created successfully");
    }));
    it("Debe rechazar la creación de usuario con email duplicado", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.app)
            .post("/user")
            .send({
            name: "Pedro",
            lastname: "Gómez",
            email: "test@example.com",
            phone: "987654321",
            gender: "M",
            password: "123456",
            documentType: "PPT",
            documentNumber: "1122334455"
        });
        expect(response.status).toBe(400); // ✅ Se espera un 400, no un 500
        expect(response.body).toHaveProperty("error", "Email already in use");
    }));
    it("Debe rechazar la creación de usuario con documento duplicado", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.app)
            .post("/user")
            .send({
            name: "Pedro",
            lastname: "Gómez",
            email: "nuevo@example.com",
            phone: "987654321",
            gender: "M",
            password: "123456",
            documentType: "CC",
            documentNumber: "1234567890" // ❌ Documento ya existe
        });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "Document number already in use");
    }));
    it("Debe autenticar un usuario y devolver un token JWT", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.app)
            .post("/user/login")
            .send({ email: "test@example.com", password: "test123" });
        console.log("Response Body (POST /user/login):", response.body);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");
        token = response.body.token; // Guardamos el token para las siguientes pruebas
    }));
    it("Debe bloquear el login con credenciales incorrectas", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.app)
            .post("/user/login")
            .send({ email: "test@example.com", password: "wrongpassword" });
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("error", "Incorrect password");
    }));
    it("Debe permitir actualizar un usuario con un token válido", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.app)
            .put(`/user/${userId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Updated User", phone: "555666777" });
        console.log("Response Body (PUT /user):", response.body);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "User updated successfully");
    }));
    it("Debe bloquear actualización sin un token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.app)
            .put(`/user/${userId}`)
            .send({ name: "Hacker User" });
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("error", "Unauthorized access");
    }));
    it("Debe eliminar un usuario con un token válido", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.app)
            .delete(`/user/${userId}`)
            .set("Authorization", `Bearer ${token}`);
        console.log("Response Body (DELETE /user):", response.body);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "User deleted successfully");
    }));
    it("Debe bloquear el acceso a un usuario eliminado", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.app)
            .get(`/user/${userId}`)
            .set("Authorization", `Bearer ${token}`);
        console.log("🚨 Response Body (GET /user eliminado):", response.body); // 🔍 DEBUG
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: "User not found" }); // ✅ Ahora debería funcionar
    }));
});
