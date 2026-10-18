import express from "express";
import { searchCustomers } from "./agents/searchAgent.js";
import { validateCustomers } from "./agents/validatorAgent.js";

const app = express();
const PORT = 3001;

app.get("/", (req, res) => {
  res.send("Agent Test Lab API is running!");
});

app.get("/api/customers", (req, res) => {
  const keyword = String(req.query.name ?? "").trim();

  // Step 1: Search Agent
  const results = searchCustomers(keyword);

  // Step 2: Validator Agent
  const isValid = validateCustomers(results);

  if (!isValid) {
    return res.status(500).json({
      error: "Customer data validation failed",
    });
  }

  res.json(results);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
