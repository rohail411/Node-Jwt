const Joi = require('@hapi/joi');

//Registeration Validation
const registerValidate = (body) => {
	const schema = Joi.object({
		name: Joi.string().required().min(6),
		email: Joi.string().min(6).required().email(),
		password: Joi.string().min(8).required()
	});
	return schema.validate(body);
};
//Login Validation
const loginValidate = (body) => {
	const schema = Joi.object({
		email: Joi.string().min(6).required().email(),
		password: Joi.string().min(8).required()
	});
	return schema.validate(body);
};

module.exports = { registerValidate, loginValidate };
