const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {}
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);

module.exports.agencySchema = Joi.object({
    name: Joi.string().required().escapeHTML(),
    add1: Joi.string().required().escapeHTML(),
    add2: Joi.string().allow('').escapeHTML(),
    state: Joi.string().required().escapeHTML(),
    city: Joi.string().required().escapeHTML(),
    phone_number: Joi.number().min(10000000).max(99999999).required(),
    description: Joi.string().required().escapeHTML(),
    deleteImages: Joi.array()
});

module.exports.clientSchema = Joi.object({
    name: Joi.string().required().escapeHTML(),
    email: Joi.string().email().required(),
    phone_number: Joi.number().min(1000000000).max(9999999999).required(),
    total_bill: Joi.number().min(10000).required(),
    deleteImages: Joi.string()
});