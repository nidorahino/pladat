exports.PORT = process.env.NODE_ENV === 'production' ?  process.env.PORT : 5000;

exports.MONGO_URI = process.env.NODE_ENV === 'production' ? process.env.MONGO_URI_PROD : process.env.MONGO_URI_DEV;

exports.JWT_EMAIL_VERIFY_SIGN_OPTIONS = process.env.NODE_ENV === 'production' ? { expiresIn: '24h' } : { expiresIn: '24h' };

exports.SENDGRID_APIKEY = process.env.NODE_ENV === 'production' ? process.env.SEND_GRID_KEY_PROD : process.env.SEND_GRID_KEY_DEV;

exports.JWT_EMAIL_VERIFY_SIGN_KEY = process.env.NODE_ENV === 'production' ? process.env.JWT_EMAIL_VERIFY_SIGN_PROD : process.env.JWT_EMAIL_VERIFY_SIGN_DEV;

exports.JWT_EMAIL_VERIFY_SIGN_KEY_RECRUITER = process.env.NODE_ENV === 'production' ? process.env.JWT_EMAIL_VERIFY_SIGN_PROD_RECRUITER : process.env.JWT_EMAIL_VERIFY_SIGN_DEV_RECRUITER;

exports.CLIENT_ORIGIN = process.env.NODE_ENV === 'production' 
  ? process.env.CLIENT_ORIGIN
  : 'http://localhost:3000';

exports.PROJECT_EMAIL = process.env.NODE_ENV === 'production' ? process.env.PROJECT_EMAIL_PROD : process.env.PROJECT_EMAIL_DEV;

exports.IMAGE_UPLOAD_KEY = process.env.IMGBB_API_KEY;

exports.CLOUDINARY_NAME = process.env.CLOUD_NAME;

exports.CLOUDINARY_API_KEY = process.env.CLOUD_API_KEY;

exports.CLOUDINARY_SECRET = process.env.CLOUD_API_SECRET;

exports.CLOUDINARY_ENV_VAR = process.env.CLOUDINARY_URL;