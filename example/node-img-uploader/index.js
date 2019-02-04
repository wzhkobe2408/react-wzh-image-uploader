const express = require('express');
const cloudinary = require('cloudinary');
const formData = require('express-form-data');
const cors = require('cors');
const { CLIENT_ORIGIN, API_KEY, API_SECRET, CLOUD_NAME } = require('./config');

const app = express();

const PORT = process.env.PORT || 8080;

cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
});

app.use(
    cors({
        origin: CLIENT_ORIGIN,
    }),
);

app.use(formData.parse());

app.post('/image-upload', (req, res) => {
    const values = Object.values(req.files);
    const promises = values.map(image =>
        cloudinary.uploader.upload(image.path),
    );

    Promise.all(promises)
        .then(results => res.json(results))
        .catch(err => console.log(err));
});

app.post('/image-upload-single', (req, res) => {
    const path = Object.values(Object.values(req.files)[0])[0].path;
    cloudinary.v2.uploader.upload(path).then(image => res.json([image]));
});

app.listen(PORT, () => console.log(`App is running on port ${PORT}`));
