import React, { useState } from "react";
import FileUpload from "./components/FileUpload"; // Import FileUpload component
import { Container, Typography, Box } from "@mui/material";

function App() {
  const [context, setContext] = useState(""); // State to store the extracted text

  return (
    <Container>
      <Box padding={4}>
        <Typography variant="h4" gutterBottom>
          Trivia Generator
        </Typography>
        <FileUpload setContext={setContext} /> {/* FileUpload Component */}
        {context && (
          <Box marginTop={4}>
            <Typography variant="h5">Extracted Context</Typography>
            <pre style={{ background: "#f4f4f4", padding: "10px" }}>{context}</pre>
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default App;
