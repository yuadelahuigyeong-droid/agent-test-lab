const customers = [
  { id: "C001", name: "田中太郎" },
  { id: "C002", name: "佐藤花子" },
  { id: "C003", name: "鈴木一郎" },
];

export function searchCustomers(keyword) {
  console.log("[Search Agent] Received:", keyword);

  const results = customers.filter((customer) =>
    customer.name.includes(keyword.trim()),
  );

  console.log("[Search Agent] Results:", results);

  return results;
}
