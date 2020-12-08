const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
	const token = req.header('auth-token');
	if (!token) res.status(401).send('Access Denied');
	try {
		const verified = jwt.verify(token, process.env.JSON_TOKEN);
		req.user = verified;
		next();
	} catch (error) {
		console.log(error);
		res.status(400).send('Invalid Token');
	}
};
