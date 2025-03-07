import { body, param, query } from "express-validator";

export const validateCreateUser = [
  body("email").isEmail().withMessage("El email no es válido."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres."),
  body("name").notEmpty().withMessage("El nombre es obligatorio."),
];

export const validateGetUserById = [
    param("id").isUUID().withMessage("El ID del usuario no es válido."),
  ];

export const validateGetUserByEmail = [
  query("email").isEmail().withMessage("El email no es válido."),
];

export const validateUpdateUser = [
  param("id").isUUID().withMessage("El ID del usuario no es válido."),
  body("email").optional().isEmail().withMessage("El email no es válido."),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres."),
  body("name").optional().notEmpty().withMessage("El nombre no puede estar vacío."),
];

export const validateDeleteUser = [
  param("id").isUUID().withMessage("El ID del usuario no es válido."),
];
