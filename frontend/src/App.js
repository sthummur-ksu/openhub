import React, { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [context, setContext] = useState(""); // Default to empty string
  const [questions, setQuestions] = useState([]); // Default to empty array
  const [status, setStatus] = useState(""); // New state for tracking status
  const [loading, setLoading] = useState(false); // State for loading spinner

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      alert("Please upload a file!");
      return;
    }

    setStatus("Processing your PDF..."); // Set status to processing
    setLoading(true); // Set loading to true while processing

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Step 1: Extract text from PDF
      const response = await axios.post("http://127.0.0.1:5000/process-pdf", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Extracted Context:", response.data.context);

      if (response.data.status === "text_extracted") {
        setStatus("Text extracted from PDF successfully!"); // Success message for text extraction
        setContext(response.data.context);

        // Step 2: Once text is extracted, generate questions
        const questionResponse = await axios.post("http://127.0.0.1:5000/generate-questions", {
          context: response.data.context,
        });

        console.log("Generated Questions:", questionResponse.data.questions);

        if (questionResponse.data.status === "questions_generated") {
          setStatus("Questions generated successfully!"); // Success message for questions
          setQuestions(questionResponse.data.questions);
        } else {
          setStatus("Failed to generate questions.");
        }
      }
    } catch (error) {
      console.error("Error processing PDF:", error);
      setStatus("Failed to process PDF!"); // Failure message
    } finally {
      setLoading(false); // Set loading to false after process is complete
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Trivia Generator</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Submit"}
        </button>
      </form>

      {status && <div><strong>{status}</strong></div>} {/* Show status */}

      {context && context.trim() && (
        <div>
          <h2>Extracted Context:</h2>
          <div
            style={{
              background: "#333",
              color: "#fff",
              padding: "10px",
              maxHeight: "300px",
              overflowY: "auto",
            }}
          >
            <p>{context}</p>
          </div>
        </div>
      )}

      {questions && questions.length > 0 && (
        <div>
          <h2>Generated Questions:</h2>
          <ul>
            {questions.map((item, index) => (
              <li key={index}>
                <strong>Question {index + 1}:</strong> {item.question}
                <ul>
                  <li><strong>Correct Answer:</strong> {item.schema.correct_answer}</li>
                  <li><strong>Explanation:</strong> {item.schema.explanation}</li>
                  <li><strong>Hints:</strong>
                    <ul>
                      {item.schema.hints.map((hint, i) => (
                        <li key={i}>{hint}</li>
                      ))}
                    </ul>
                  </li>
                  <li><strong>Wrong Answers:</strong>
                    <ul>
                      {item.schema.wrong_answers.map((wrong, i) => (
                        <li key={i}>{wrong}</li>
                      ))}
                    </ul>
                  </li>
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
