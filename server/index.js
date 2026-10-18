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
  const logs = [];

  // Step 1: Search Agent
  logs.push("Search Agent: 検索開始");
  const results = searchCustomers(keyword);
  logs.push(`Search Agent: ${results.length}件取得`);

  // Step 2: Validator Agent
  logs.push("Validator Agent: 検証開始");
  const isValid = validateCustomers(results);
  logs.push(`Validator Agent: ${isValid ? "成功" : "失敗"}`);

  if (!isValid) {
    return res.status(500).json({
      error: "Customer data validation failed",
      logs,
    });
  }

  res.json({
    customers: results,
    logs,
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
