export function validateCustomers(customers) {
  console.log("[Validator Agent] Received:", customers);

  const isValid =
    Array.isArray(customers) &&
    customers.every(
      (customer) =>
        typeof customer.id === "string" &&
        customer.id.length > 0 &&
        typeof customer.name === "string" &&
        customer.name.length > 0,
    );

  console.log("[Validator Agent] Valid:", isValid);

  return isValid;
}
