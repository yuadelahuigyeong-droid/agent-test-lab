import { useState } from "react";

type Customer = {
  id: string;
  name: string;
};

function App() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<Customer[]>([]);
  const [error, setError] = useState("");
  const [logs, setLogs] = useState<string[]>([]);

  const handleSearch = async () => {
    setError("");

    try {
      const response = await fetch(
        `/api/customers?name=${encodeURIComponent(keyword.trim())}`,
      );

      if (!response.ok) {
        const errorData = await response.json();
        setLogs(errorData.logs ?? []);
        throw new Error(errorData.error ?? "Search failed");
      }

      const data = await response.json();
      setResults(data.customers);
      setLogs(data.logs);
    } catch {
      setResults([]);
      setError("検索中にエラーが発生しました。");
    }
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

      {error ? (
        <p>{error}</p>
      ) : results.length === 0 ? (
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
      <section>
        <h2>エージェント実行ログ</h2>
        <ul>
          {logs.map((log, index) => (
            <li key={index}>{log}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;
