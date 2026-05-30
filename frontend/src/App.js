import Upload from "./components/Upload";
import Chat from "./components/Chat";
import "./App.css";

function App() {

    return (

        <div className="app">

            <div className="overlay">

                <div className="container">

                    <h1 className="title">
                        PDF RAG Bot
                    </h1>

                    <p className="subtitle">
                        Upload your PDF and ask intelligent questions using AI
                    </p>

                    <Upload />

                    <Chat />

                </div>

            </div>

        </div>
    );
}

export default App;