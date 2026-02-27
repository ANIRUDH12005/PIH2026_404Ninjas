import { useState } from "react";
import axios from "axios";

function App() {
  const [form, setForm] = useState({
    age: "",
    income: "",
    occupation: "",
    state: ""
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post("http://127.0.0.1:8000/check", {
        age: Number(form.age),
        income: Number(form.income),
        occupation: form.occupation,
        state: form.state
      });

      setResult(response.data);
    } catch (error) {
      console.error(error);
      alert("Error connecting to backend.");
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>BharatAI - Intelligent Government Scheme Advisor</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="number"
          name="income"
          placeholder="Annual Income"
          value={form.income}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="text"
          name="occupation"
          placeholder="Occupation"
          value={form.occupation}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="text"
          name="state"
          placeholder="State"
          value={form.state}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          {loading ? "Checking..." : "Check Eligibility"}
        </button>
      </form>

      {result && result.status === "Success" && (
        <div style={styles.resultBox}>
          <h2>Best Match</h2>
          <p><strong>Scheme:</strong> {result.best_match.scheme_name}</p>
          <p><strong>Eligible:</strong> {result.best_match.eligible ? "Yes" : "No"}</p>
          <p><strong>Reason:</strong> {result.best_match.reason}</p>
          <p><strong>Confidence:</strong> {result.confidence}</p>

          <h3>Required Documents</h3>
          <ul>
            {result.best_match.required_documents.map((doc, index) => (
              <li key={index}>{doc}</li>
            ))}
          </ul>
        </div>
      )}

      {/* <div style={{ marginTop: "15px" }}>
        <strong>Eligibility Score:</strong>
        <div style={{
          height: "10px",
          backgroundColor: "#ddd",
          borderRadius: "5px",
          marginTop: "5px"
        }}>
        <div style={{
          width: `${result.best_match.eligibility_score}%`,
          height: "100%",
          backgroundColor: result.best_match.eligibility_score > 70 ? "green" : "orange",
          borderRadius: "5px"
        }} />
        </div>
        </div> */}

    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    padding: "40px",
    maxWidth: "700px",
    margin: "auto"
  },
  title: {
    textAlign: "center",
    marginBottom: "30px"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  input: {
    padding: "10px",
    fontSize: "16px"
  },
  button: {
    padding: "12px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    cursor: "pointer"
  },
  resultBox: {
    marginTop: "40px",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px"
  }
};

export default App;