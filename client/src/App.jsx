import { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function App() {
  console.log("ENV VALUE:", import.meta.env.VITE_API_URL);

  const API_URL = import.meta.env.VITE_API_URL ;
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [loading, setLoading] = useState(false);

  const suggestionsRef = useRef(null);
console.log("API URL:", API_URL);
  // 🔥 Auto scroll when suggestions update
  useEffect(() => {
    if (suggestions && suggestionsRef.current) {
      suggestionsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [suggestions]);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/upload`, formData);
      setText(res.data.text);
      setSuggestions(res.data.suggestions);
    } catch (err) {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-poppins  p-5  items-center flex flex-col min-h-screen">
      <h2 className="font- text-center py-10 text-4xl font-bold text-gray-700">
        Social Media Content Analyzer
      </h2>

      <div className="content-center">
        <input
          className=" bg-blue-100 border border-gray-300 rounded-md p-2 my-5"
          type="file"
          accept=".pdf,image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button
          onClick={handleUpload}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-4 py-3 ml-2 transition"
        >
          Analyze
        </button>
      </div>

      {loading && <p className="text-blue-600 font-semibold">⏳ Analyzing...</p>}

      {text && (
        <>
          <div className="bg-green-100 p-4 rounded-md my-5 w-full max-w-3xl">
            <h3 className="font-bold mb-2">Extracted Text:</h3>
            <textarea
              className=" px-5 py-3 w-full rounded-md border resize-none"
              value={text}
              readOnly
              rows={8}
            />
          </div>

          <h3 className="font-bold">Suggestions:</h3>

          {/* 🔥 Attach ref here */}
          <div
            ref={suggestionsRef}
            className="py-4 rounded-md bg-gray-100 px-5 w-full max-w-3xl shadow-md"
          >
            <ReactMarkdown>{suggestions}</ReactMarkdown>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
