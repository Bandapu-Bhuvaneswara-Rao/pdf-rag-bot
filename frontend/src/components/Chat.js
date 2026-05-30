import axios from "axios";
import { useState } from "react";

function Chat() {

    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);

    const askQuestion = async () => {

        if (!question) {
            alert("Please enter question");
            return;
        }

        try {

            setLoading(true);

            const res = await axios.post(
                "http://localhost:3001/ask",
                {
                    question
                }
            );

            setAnswer(res.data.answer);

        } catch (err) {

            setAnswer("Error getting answer");

        } finally {

            setLoading(false);
        }
    };

    return (

        <div className="card">

            <h2>Ask Questions</h2>

            <textarea
                rows="5"
                placeholder="Ask something about the PDF..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
            />

            <button onClick={askQuestion}>
                {loading ? "Thinking..." : "Ask AI"}
            </button>

            <div className="answer-box">

                <h3>Answer</h3>

                <p>{answer}</p>

            </div>

        </div>
    );
}

export default Chat;