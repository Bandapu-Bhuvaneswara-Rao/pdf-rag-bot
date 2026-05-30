from flask import Flask, request, jsonify
from flask_cors import CORS

from rag import process_pdf, ask_question

app = Flask(__name__)

CORS(app)


@app.route("/process-pdf", methods=["POST"])
def process():

    try:

        data = request.json

        chunks = process_pdf(data["filePath"])

        return jsonify({
            "message": "PDF processed successfully",
            "chunks": chunks
        })

    except Exception as e:

        print("ERROR:", e)

        return jsonify({
            "error": str(e)
        }), 500


@app.route("/ask", methods=["POST"])
def ask():

    try:

        data = request.json

        answer = ask_question(data["question"])

        return jsonify({
            "answer": answer
        })

    except Exception as e:

        print("ERROR:", e)

        return jsonify({
            "error": str(e)
        }), 500


if __name__ == "__main__":

    app.run(debug=True, port=5000) 