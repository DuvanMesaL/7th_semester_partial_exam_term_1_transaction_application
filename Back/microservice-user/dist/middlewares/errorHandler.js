"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const exception_1 = require("../exceptions/exception");
const exception_2 = require("../exceptions/exception");
function errorHandler(err, req, res, next) {
    console.error("❌ Error Capturado:", err); // 🔍 DEBUG
    if (err instanceof exception_1.UserNotFoundError) {
        return res.status(404).json({ error: err.message }); // ✅ Devuelve siempre `error`
    }
    if (err instanceof exception_2.AppError) {
        return res.status(err.statusCode).json({ error: err.message });
    }
    res.status(500).json({ error: "Internal Server Error" });
}
