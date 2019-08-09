const multer = require('multer');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: process.env.AWS_REGION
});
const s3 = new aws.S3();
const storage = multerS3({
  s3,
  acl: 'public-read',
  bucket: process.env.AWS_IMAGES_BUCKET,
  metadata: function (req, file, cb) {
    cb(null, {fieldName: file.fieldname});
  },
  key: function (req, file, cb) {
    const name = file.originalname.toLowerCase().split(' ').join('');
    const ext = MIME_TYPE_MAP[file.mimetype];
    const fileName = name + '-' + Date.now() + '.' + ext;
    cb(null, fileName)
  }
});

exports.storeImage = multer({ storage }).single('image');

