"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
var express_1 = __importDefault(require("express"));
var multer_1 = __importDefault(require("multer"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
exports.app = (0, express_1.default)();
var upload = (0, multer_1.default)({ dest: 'uploads/' });
exports.app.use(express_1.default.static('public'));
exports.app.post('/upload', upload.single('pdf'), function (req, res) {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    if (req.file.mimetype !== 'application/pdf') {
        return res.status(400).send('Only PDF files are allowed.');
    }
    res.send("File uploaded: ".concat(req.file.filename));
});
exports.app.get('/download/:filename', function (req, res) {
    var normaraizedPath = path_1.default.normalize(req.params.filename);
    var filePath = path_1.default.resolve(__dirname, 'uploads', normaraizedPath);
    if (!filePath.startsWith(path_1.default.resolve(__dirname, 'uploads')))
        return res.status(400).send();
    var fileStream = fs_1.default.createReadStream(filePath);
    fileStream.on('error', function () {
        res.status(404).send('File not found');
    });
    fileStream.pipe(res);
});
if (require.main === module) {
    exports.app.listen(3000, function () {
        console.log('Server listening on http://localhost:3000');
    });
}
