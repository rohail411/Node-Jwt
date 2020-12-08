const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
// Auth Routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

dotenv.config();

// Db Connection
mongoose.connect(process.env.DB_URL, { useUnifiedTopology: true }, () => console.log('Db Connected'));

//MidleWears
app.use(express.json());

app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);
app.get('/', (req, res) => {
	const path = './upload/video.mp4';
	const file = fs.statSync(path);
	const fileSi = file.size;
	const range = req.headers.range;
	if (range) {
		const parts = range.replace(/bytes=/, '').split('-');
		const start = parseInt(parts[0], 10);
		const end = parts[1] ? parseInt(parts[1], 10) : fileSi - 1;
		const chunkSi = end - start + 1;
		const file = fs.createReadStream(path, {
			start,
			end
		});
		const head = {
			'Content-Range': `bytes ${start}-${end}/${fileSi}`,
			'Accept-Ranges': 'bytes',
			'Content-Length': chunkSi,
			'Content-Type': 'video/mp4'
		};
		res.writeHead(206, head);
		file.pipe(res);
	} else {
		const head = {
			'Content-Length': fileSi,
			'Content-Type': 'video/mp4'
		};
		res.writeHead(head);
		fs.createReadStream(path).pipe(res);
	}
});

app.listen(3000, () => console.log('Servie starts'));
