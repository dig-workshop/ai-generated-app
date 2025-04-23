import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

export const app = express();
const upload = multer({dest: 'uploads/'});

app.use(express.static('public'));

app.post('/upload', upload.single('pdf'), (req, res) => {
	if (!req.file) {
		return res.status(400).send('No file uploaded.');
	}
	if (req.file.mimetype !== 'application/pdf') {
		return res.status(400).send('Only PDF files are allowed.');
	}

	res.send(`File uploaded: ${req.file.filename}`);
});

app.get('/download/:filename', (req, res) => {
	console.log(req)
	const filePath = path.join(__dirname, 'uploads', req.params.filename);
	const fileStream = fs.createReadStream(filePath);
	fileStream.on('error', () => {
		res.status(404).send('File not found');
	});
	fileStream.pipe(res);
});

if (require.main === module) {
	app.listen(3000, () => {
		console.log('Server listening on http://localhost:3000')
	});
}
