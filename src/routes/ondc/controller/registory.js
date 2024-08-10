import axios from "axios";
import { config } from "../../../config/index.js";
import _sodium from 'libsodium-wrappers';
import _ from 'lodash';
import fs from 'fs';

class RegistryController {
    async addNewSeller(req, res) {
        try {
            const privateKey = `${config.ondc_private_key}`;
            
            const registry_data = req.body;
            await _sodium.ready;
            const sodium = _sodium;
            const signing_string = registry_data.message.request_id;
            
            const signedMessage = sodium.crypto_sign_detached(signing_string, sodium.from_base64(privateKey, sodium.base64_variants.ORIGINAL));
            const signmsg = sodium.to_base64(signedMessage, sodium.base64_variants.ORIGINAL);
            const fileName = './ondc-site-verification.html';
            const content = `<html>
            <head>
              <meta name='ondc-site-verification' content='${signmsg}' />
             </head>
              <body>
                  ONDC Site Verification Page
              </body>
          </html>`;
            fs.writeFile(fileName, content, (err) => {
                if (err) {
                    console.error('Error writing to file:', err);
                } else {
                    console.log(`File '${fileName}' created and content written successfully!`);
                }
            });
            const { data } = await axios({
                url: `${config.subscribe_url}`,
                method: "POST",
                data: registry_data
            });
            res.status(200).json(data);
        } catch (error) {
            console.log("errro,", error);
        }
    }
}
export default new RegistryController();