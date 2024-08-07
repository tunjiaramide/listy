const express = require('express');
const AWS = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const multer = require('multer');
const authenticate = require('../middleware/authenticate'); 



const router = express.Router();

const s3Client = new AWS.S3({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});
  
const upload = multer();


router.post('/upload', authenticate, upload.single('video'), async (req, res) => {
    try {
      const file = req.file;
      const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: Date.now().toString() + '-' + file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype
      };
  
      const parallelUploads3 = new Upload({
        client: s3Client,
        params: uploadParams
      });
  
      parallelUploads3.on('httpUploadProgress', (progress) => {
        console.log(progress);
      });
  
      const result = await parallelUploads3.done();
  
      res.send({ videoUrl: result.Location });
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
});

module.exports = router;