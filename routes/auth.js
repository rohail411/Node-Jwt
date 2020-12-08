const router = require('express').Router();
const User = require('../model/User');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ipfsClient = require('ipfs-http-client');

const { registerValidate, loginValidate } = require('../util/validation');
//Validations

router.post('/register', async (req, res) => {
	const { error } = registerValidate(req.body);
	if (error) return res.json(error);

	// Email checking
	const emailExist = await User.findOne({ email: req.body.email });
	if (emailExist) return res.status(400).json({ message: 'email already in use' });

	//Secure Password
	const salt = await bcryptjs.genSalt(10);
	const hashedPassword = await bcryptjs.hash(req.body.password, salt);

	// Create New User
	const user = User({
		name: req.body.name,
		email: req.body.email,
		password: hashedPassword
	});

	try {
		const saved = await user.save();
		res.status(200).json(saved);
	} catch (error) {
		res.status(400).json(error);
	}
});

router.post('/login', async (req, res) => {
	const { error } = loginValidate(req.body);
	if (error) return res.json(error);

	// Email checking
	const user = await User.findOne({ email: req.body.email });
	if (!user) return res.status(400).json({ message: 'email or password invalid' });

	const validPassword = await bcryptjs.compare(req.body.password, user.password);
	if (!validPassword) res.status(400).json({ message: 'email or password invalid' });

	const token = jwt.sign({ _id: user._id }, process.env.JSON_TOKEN);

	res.header('auth-token', token).json({ token: token });
});

router.post('/upload', (req, res) => {
	const ipfs = ipfsClient({
		host: 'api.ipfs.temporal.cloud',
		'api-path': '/api/v0/',
		port: '443',
		protocol: 'https'
		// headers: {
		// 	authorization:
		// 		'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1ODc0OTA2OTcsImlkIjoicm9oYWlsNDExIiwib3JpZ19pYXQiOjE1ODc0MDQyOTd9.FDUpBvhwnyY3vZl9ki2bIcEG9DHETaaEyErPmIPM-so'
		// }
	});
	console.log(req.body);
	const data = 'QmS4ustL54uo8FzR9455qaxZwuMiUhyvMcX9Ba8nUH4uVv';
	ipfs.add(data, (err, hash) => {
		if (err) return console.log(err);
		console.log('https://ipfs.io/ipfs/' + hash);
		res.send('https://ipfs.io/ipfs/' + hash);
	});
	console.log('end');
});

module.exports = router;
