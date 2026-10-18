import express from "express";
import { validateCustomers } from "./agents/validatorAgent.js";

const app = express();
const PORT = 3002;

app.use(express.json());

app.post("/validate", (req, res) => {
  const customers = req.body.customers;
  const isValid = validateCustomers(customers);

  res.json({ isValid });
});

app.listen(PORT, () => {
  console.log(`Validator Server running at http://localhost:${PORT}`);
});
