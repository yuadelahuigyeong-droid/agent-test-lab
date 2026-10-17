import { useState } from "react";

const customers = [
  { id: "C001", name: "田中太郎" },
  { id: "C002", name: "佐藤花子" },
  { id: "C003", name: "鈴木一郎" },
];

function App() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<typeof customers>([]);

  const handleSearch = () => {
    const filtered = customers.filter((customer) =>
      customer.name.includes(keyword.trim()),
    );
    setResults(filtered);
  };

  return (
    <div>
      <h1>顧客検索システム</h1>

      <input
        type="text"
        placeholder="顧客名を入力"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />

      <button onClick={handleSearch}>検索</button>

      <h2>検索結果</h2>

      {results.length === 0 ? (
        <p>検索結果がありません。</p>
      ) : (
        <ul>
          {results.map((customer) => (
            <li key={customer.id}>
              {customer.id} - {customer.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
