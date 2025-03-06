"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateId = validateId;
function validateId(req, res, next) {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
        res.status(400).json({ error: "Invalid user ID" });
        return;
    }
    req.params.id = userId.toString();
    next();
}
