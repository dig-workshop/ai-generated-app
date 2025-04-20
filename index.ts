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
	const uploadsDir = path.resolve(__dirname, 'uploads');
	const requestedPath = path.resolve(uploadsDir, req.params.filename);
	if (!requestedPath.startsWith(uploadsDir)) {
		return res.status(400).send('Invalid file path');
	}
	if (requestedPath.startsWith(uploadsDir)) {
		const fileStream = fs.createReadStream(requestedPath);
		fileStream.on('error', () => {
			res.status(404).send('File not found');
		});
		fileStream.pipe(res);
	}
});

app.listen(3000, () => {
	console.log('Server listening on port 3000');
});