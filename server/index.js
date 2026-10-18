import express from "express";

const app = express();
const PORT = 3001;

const customers = [
  { id: "C001", name: "田中太郎" },
  { id: "C002", name: "佐藤花子" },
  { id: "C003", name: "鈴木一郎" },
];

app.get("/", (req, res) => {
  res.send("Agent Test Lab API is running!");
});

app.get("/api/customers", (req, res) => {
  const keyword = String(req.query.name ?? "").trim();

  const results = customers.filter((customer) =>
    customer.name.includes(keyword),
  );

  res.json(results);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
