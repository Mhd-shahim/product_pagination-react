import { useEffect, useState } from "react";

function App() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [pageInput, setPageInput] = useState(1);

  const totalPages = Math.ceil(totalCount / pageSize);

  const fetchProducts = async (pageNumber = page, size = pageSize) => {
    const res = await fetch(
      `http://127.0.0.1:8000/api/products/?page=${pageNumber}&page_size=${size}`
    );
    const data = await res.json();
    setProducts(data.results);
    // setTotalCount(data.count);
  };

  const fetchProductCount = async (pageNumber = page, size = pageSize) => {
    const res = await fetch(
      `http://127.0.0.1:8000/api/products/count/`
    );
    const data = await res.json();
    setTotalCount(data.count);
  };

  const loadData = async (pageNumber = page, size = pageSize) => {
    await fetchProductCount(pageNumber, size);
    await fetchProducts(pageNumber, size);
  };

  useEffect(() => {
    setPageInput(page);
    loadData();
  }, [page, pageSize]);

  const goToPage = () => {
    if (pageInput >= 1 && pageInput <= totalPages) {
      setPage(Number(pageInput));
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Product List</h2>
      <button onClick={() => loadData()}>Refresh</button>
      {/* Table */}
      <table border="1" cellPadding="8" width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.price}</td>
                <td>{p.description}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" align="center">
                No data
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div style={{ marginTop: "15px", display: "flex", gap: "8px" }}>
        <button onClick={() => setPage(1)} disabled={page === 1}>
          First
        </button>

        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
          Previous
        </button>

        <input
          type="number"
          value={pageInput}
          min="1"
          max={totalPages}
          onChange={(e) => setPageInput(e.target.value)}
          style={{ width: "60px" }}
        />

        <button onClick={goToPage}>Go</button>

        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= totalPages}
        >
          Next
        </button>

        <button
          onClick={() => setPage(totalPages)}
          disabled={page >= totalPages}
        >
          Last
        </button>

        {/* Page Size */}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPage(1);
            setPageInput(1);
          }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>

      <p style={{ marginTop: "10px" }}>
        Page {page} of {totalPages} | Total Records: {totalCount}
      </p>
    </div>
  );
}

export default App;
