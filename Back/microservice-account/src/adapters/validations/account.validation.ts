import Joi from "joi";

export const rechargeSchema = Joi.object({
    account_id: Joi.number().required(),
    amount: Joi.number().positive().required(),
});

export const purchaseSchema = Joi.object({
    account_id: Joi.number().required(),
    amount: Joi.number().positive().required(),
});

export const transferSchema = Joi.object({
    from_account_id: Joi.number().required(),
    to_account_id: Joi.number().required(),
    amount: Joi.number().positive().required(),
});
