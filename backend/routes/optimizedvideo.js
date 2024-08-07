const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const AWS = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const authenticate = require('./middleware/authenticate'); // Adjust to your actual middleware

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

const s3Client = new AWS.S3({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

router.post('/upload', authenticate, upload.single('video'), (req, res) => {
  const filePath = req.file.path;
  const outputFilePath = `compressed-${req.file.originalname}`;

  ffmpeg(filePath)
    .output(outputFilePath)
    .videoCodec('libx264')
    .size('640x?')
    .on('end', async () => {
      const fileBuffer = fs.readFileSync(outputFilePath);
      const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: Date.now().toString() + '-' + req.file.originalname,
        Body: fileBuffer,
        ContentType: req.file.mimetype
      };

      try {
        const parallelUploads3 = new Upload({
          client: s3Client,
          params: uploadParams
        });

        parallelUploads3.on('httpUploadProgress', (progress) => {
          console.log(progress);
        });

        const result = await parallelUploads3.done();

        fs.unlinkSync(filePath); // Clean up the temp files
        fs.unlinkSync(outputFilePath);

        res.send({ videoUrl: result.Location });
      } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
      }
    })
    .on('error', (err) => {
      console.error(err);
      res.status(500).send(err.message);
    })
    .run();
});

module.exports = router;
