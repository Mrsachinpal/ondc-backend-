import dotenv from "dotenv";
dotenv.config();
export const config = {
    dburl: process.env.DATABASE_URL,
    ondc_private_key: process.env.ONDC_PRIVATE_KEY,
    decrypt_private_key:process.env.ONDC_DECRYPT_PRIVATE_KEY,
    bpp_id:process.env.BPP_ID,
    bpp_uri: process.env.BPP_URI,
    uk_id:process.env.UK_ID,
    subscribe_url:process.env.SUBSCRIBE_URL,
    decrypt_url:process.env.DECRYPY_URL,
    db_name: process.env.DB_NAME,
    db_user_name: process.env.DB_USER_NAME,
    db_password: process.env.DB_PASSWORD,
    db_host: process.env.DB_HOST,
    secret_key: process.env.SECRET_KEY,
    mongo_url: process.env.MONGO_URL,
    ethereal_email:process.env.ETHEREAL_EMAIL,
    ethereal_password:process.env.ETHEREAL_PASSWORD,

}