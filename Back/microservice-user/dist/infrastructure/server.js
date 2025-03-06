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
exports.server = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
require("reflect-metadata");
const database_1 = require("./database");
const user_routes_1 = __importDefault(require("../adapters/user.routes"));
const errorHandler_1 = require("../middlewares/errorHandler");
const app = (0, express_1.default)();
exports.app = app;
// Middlewares de seguridad y optimización
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
// Rutas
app.use("/user", user_routes_1.default);
// Middleware de manejo de errores (debe estar después de las rutas)
app.use((err, req, res, next) => {
    (0, errorHandler_1.errorHandler)(err, req, res, next);
});
// Inicializar la base de datos antes de iniciar el servidor
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, database_1.initializeDatabase)();
        const PORT = process.env.PORT || 3001;
        const server = app.listen(PORT, () => {
            console.log(`✅ User Microservice running on port ${PORT}`);
        });
        return server;
    }
    catch (error) {
        console.error("❌ Error starting the server:", error);
        process.exit(1); // Forzar salida en caso de error crítico
    }
});
const server = startServer();
exports.server = server;
