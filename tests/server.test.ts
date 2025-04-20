const request = require('supertest');
const fs = require('fs');
const path = require('path');
const { app } = require('../index');

describe('PDF Upload/Download', () => {
  const uploadDir = path.join(__dirname, '../uploads');

  beforeAll(() => {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    // ダミーのtest.pdfを作成
    fs.writeFileSync(path.join(__dirname, 'test.pdf'), 'dummy pdf content');

    // ダミーのtest.jpgを作成
    fs.writeFileSync(path.join(__dirname, 'test.jpg'), 'dummy jpg content');
  });

  afterAll(() => {
    fs.rmSync(uploadDir, { recursive: true, force: true });

    // テストファイルも消す
    fs.rmSync(path.join(__dirname, 'test.pdf'), { force: true });
    fs.rmSync(path.join(__dirname, 'test.jpg'), { force: true });
  });

  describe('Upload PDF', () => {
    it('should upload a valid PDF file', async () => {
      const res = await request(app)
        .post('/upload')
        .attach('pdf', path.join(__dirname, 'test.pdf'));
      expect(res.statusCode).toBe(200);
      expect(res.text).toContain('File uploaded');
    });

    it('should not upload an invalid file type', async () => {
      const res = await request(app)
        .post('/upload')
        .attach('pdf', path.join(__dirname, 'test.jpg'));
      expect(res.statusCode).toBe(400);
      expect(res.text).toBe('Only PDF files are allowed.');
    });
  });

  describe('Download PDF', () => {
    it('should download an existing PDF file', async () => {
      const filename = 'test.pdf';
      const filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, 'test content');

      const res = await request(app).get(`/download/${filename}`);
      expect(res.statusCode).toBe(200);
      expect(res.text).toBe('test content');
    });

    it('should return 404 for a non-existing PDF file', async () => {
      const res = await request(app).get('/download/nonexistent.pdf');
      expect(res.statusCode).toBe(404);
      expect(res.text).toBe('File not found');
    });

    it('should not allow path traversal attack', async () => {
      const res = await request(app)
          .get('/download/..%2F.env')

      console.log('サーバー側で受け取ったレスポンス:', res);
      expect(400).toEqual(res.statusCode);
    });
  });
});
