import express from "express";
import { searchCustomers } from "./agents/searchAgent.js";

const app = express();
const PORT = 3001;

app.get("/", (req, res) => {
  res.send("Agent Test Lab API is running!");
});

app.get("/api/customers", async (req, res) => {
  const keyword = String(req.query.name ?? "").trim();
  const logs = [];

  // Step 1: Search Agent
  logs.push("Search Agent: 検索開始");
  const results = searchCustomers(keyword);
  logs.push(`Search Agent: ${results.length}件取得`);

  // Step 2: Validator Server
  try {
    logs.push("Validator Agent: HTTP検証開始");

    const response = await fetch("http://localhost:3002/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ customers: results }),
    });

    if (!response.ok) {
      throw new Error(`Validator HTTP error: ${response.status}`);
    }

    const { isValid } = await response.json();
    logs.push(`Validator Agent: ${isValid ? "成功" : "失敗"}`);

    if (isValid !== true) {
      return res.status(500).json({
        error: "Customer data validation failed",
        logs,
      });
    }

    res.json({
      customers: results,
      logs,
    });
  } catch (error) {
    console.error("Validator Server Error:", error);

    logs.push("Validator Agent: 通信エラー");

    res.status(502).json({
      error: "Validator server unavailable",
      logs,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
