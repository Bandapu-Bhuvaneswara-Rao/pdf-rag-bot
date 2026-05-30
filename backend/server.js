const express = require("express");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("pdf"), async (req, res) => {

    try {

        const fullPath = path.resolve(req.file.path);

        console.log("PDF PATH:", fullPath);

        const response = await axios.post(
            "http://127.0.0.1:5000/process-pdf",
            {
                filePath: fullPath
            }
        );

        res.json(response.data);

    } catch (err) {

        console.log(err.response?.data || err.message);

        res.status(500).json({
            error: "Upload failed"
        });
    }
});


app.post("/ask", async (req, res) => {

    try {

        const response = await axios.post(
            "http://127.0.0.1:5000/ask",
            {
                question: req.body.question
            }
        );

        res.json(response.data);

    } catch (err) {

        console.log(err.response?.data || err.message);

        res.status(500).json({
            error: "Question failed"
        });
    }
});


app.listen(3001, () => {

    console.log("Backend running on port 3001");

});