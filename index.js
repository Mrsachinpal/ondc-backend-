import express from "express";
const app = express();
import routers from "./src/routes/index.js";
import cors from "cors";
import bodyParser from "body-parser"
import morgan from "morgan";
import path from "path";
import { connectDB, connectMongodb } from './src/db/index.js';
connectDB();
connectMongodb()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(cors());
app.use((req, res, next) => {

    const req_headers = req.headers;
    console.log(JSON.stringify(req_headers.host));
    res.set({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
        "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
        "Content-Security-Policy": "default-src *",
        "X-Content-Security-Policy": "default-src *",
        "X-WebKit-CSP": "default-src *"
    })
    next();
});

app.use(routers);

app.get("/ondc-site-verification.html", (req, res) => {
    res.sendFile(path.join(__dirname, 'ondc-site-verification.html'));
});

app.get("/", async (req, res) => {
    res.send("Alright, Stage ONDC is running smoothly");
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`);
})
