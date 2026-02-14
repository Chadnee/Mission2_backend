import dotenv from 'dotenv';
import { SignOptions } from 'jsonwebtoken';
import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bycrypt_slat_rounds: process.env.BYCRPT_SALT_ROUNDS,
  default_password: process.env.DEFAULT_PASS,
  node_env: process.env.NODE_ENV,
  jwt_access_secret: process.env.JWT_ACCESS_TOKEN,
  jwt_refresh_secret: process.env.JWT_REFRESH_TOKEN,
  jwt_access_expiresIn: process.env.JWT_ACCESS_EXPIRES_IN as SignOptions['expiresIn'],
  jwt_refresh_expiresIn: process.env.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'],
  reset_password_ui_link: process.env.RESET_PASSWORD_UI_LINK,
  clouddinary_cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_cloud_api_key:process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret:process.env.CLOUDINARY_API_SECRET,
  super_admin_pass:process.env.SUPER_ADMIN_PASSWORD,
  FRONTEND_URL:process.env.FRONTEND_URL
}; 