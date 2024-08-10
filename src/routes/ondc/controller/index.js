import axios from "axios";
import { config } from "../../../config/index.js";


class OndcApiControler {

    async OnSubscribe(req, res) {
        try {
            console.log(req.body);
            const { subscriber_id, challenge } = req.body;
            let decrypt_private_key = `${config.decrypt_private_key}`;
            const { data } = await axios({
                url: `${config.decrypt_url}`,
                method: "POST",
                data: {
                    "client_private_key": `${decrypt_private_key}`,
                    challenge,
                },
            });
            res.status(200).json(data);
        } catch (error) {
            console.log("errro,", error);
        }
    }
    async Search(req, res) {
        try {
            console.log(req.body);
            console.log(process.env.TZ);
            const dataToSend = {
                message: {
                    ack: { status: 'ACK' }
                } 
            }
            res.status(200).json(dataToSend);
        } catch (error) {
            console.log("errro,", error);
        }
    }
}
export default new OndcApiControler();

