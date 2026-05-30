import axios from "axios";
import { useState } from "react";

function Upload() {

    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");

    const uploadFile = async () => {

        if (!file) {
            alert("Please select a PDF");
            return;
        }

        const formData = new FormData();

        formData.append("pdf", file);

        try {

            const res = await axios.post(
                "http://localhost:3001/upload",
                formData
            );

            setMessage(res.data.message);

        } catch (err) {

            setMessage("Upload Failed");
        }
    };

    return (

        <div className="card">

            <h2>Upload PDF</h2>

            <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
            />

            <button onClick={uploadFile}>
                Upload PDF
            </button>

            <p>{message}</p>

        </div>
    );
}

export default Upload;