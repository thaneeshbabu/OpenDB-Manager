import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import {
  FiTrendingUp,
  FiSearch,
  FiRefreshCw,
  FiDownload,
  FiChevronLeft,
  FiChevronRight,
  FiArrowUp,
  FiArrowDown,
  FiAlertCircle,
} from "react-icons/fi";

import styles from "./NSEData.module.css";
const API_URL = "http://localhost:5000/api/nse-data";
const PAGE_SIZE = 20;

export default function NSEDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Controls
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch Data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL);
      setData(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(err.message || "Failed to load stock market data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Formatters
  const formatNumber = (num) => {
    if (num === undefined || num === null || isNaN(num)) return "-";
    return Number(num).toLocaleString("en-IN");
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Sorting Handler
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Filter & Sort Pipeline
  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    if (search.trim() !== "") {
      const q = search.toLowerCase();
      result = result.filter((row) =>
        row.symbol?.toLowerCase().includes(q)
      );
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        // Handle numeric conversion where appropriate
        if (!isNaN(Number(aVal)) && !isNaN(Number(bVal))) {
          aVal = Number(aVal);
          bVal = Number(bVal);
        }

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, search, sortConfig]);

  // Pagination Slice
  const totalPages = Math.ceil(filteredAndSortedData.length / PAGE_SIZE) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredAndSortedData.slice(start, start + PAGE_SIZE);
  }, [filteredAndSortedData, currentPage]);

  // CSV Export
  const handleExportCSV = () => {
    if (filteredAndSortedData.length === 0) return;

    const headers = [
      "ID", "Symbol", "Series", "Date", "Open Price", "High Price", "Low Price",
      "Close Price", "Avg Price", "Prev Close", "Last Price", "Volume",
      "Turnover", "No. Trades", "Delivery Qty", "Delivery %"
    ];

    const keys = [
      "id", "symbol", "series", "date1", "open_price", "high_price", "low_price",
      "close_price", "avg_price", "prev_close", "last_price", "ttl_trd_qnty",
      "turnover_ltrs", "no_of_trades", "deliv_qty", "deliv_per"
    ];

    const csvRows = [
      headers.join(","),
      ...filteredAndSortedData.map((row) =>
        keys.map((k) => `"${row[k] !== undefined ? row[k] : ""}"`).join(",")
      )
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", `NSE_Stock_Data_${new Date().toISOString().slice(0, 10)}.csv`);
    a.click();
  };

  const renderSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return null;
    return sortConfig.direction === "asc" ? (
      <FiArrowUp className={styles.sortIcon} />
    ) : (
      <FiArrowDown className={styles.sortIcon} />
    );
  };

  return (
  <div>
      {/* Dashboard Header */}
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.iconBadge}>
            <FiTrendingUp />
          </div>
          <div>
            <h1 className={styles.title}>NSE Market Insights</h1>
            <p className={styles.subtitle}>Real-time National Stock Exchange Analytics</p>
          </div>
        </div>
  

    

        <button className={styles.refreshBtn} onClick={fetchData} disabled={loading}>
          <FiRefreshCw className={loading ? styles.spinning : ""} />
          Refresh
        </button>
      </header>

      {/* Main Card Container */}
      <div className={styles.card}>
        {/* Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.searchWrapper}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search by stock symbol (e.g., RELIANCE, TCS)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className={styles.actionsGroup}>
            <span className={styles.recordCounter}>
              <strong>{filteredAndSortedData.length}</strong> Records Found
            </span>
            <button
              className={styles.exportBtn}
              onClick={handleExportCSV}
              disabled={filteredAndSortedData.length === 0}
            >
              <FiDownload /> Export CSV
            </button>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className={styles.statusBox}>
            <div className={styles.spinner}></div>
            <p>Fetching market data...</p>
          </div>
        ) : error ? (
          <div className={styles.errorBox}>
            <FiAlertCircle />
            <span>{error}</span>
          </div>
        ) : (
          <>
            <div className={styles.tableResponsive}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th onClick={() => handleSort("id")}>ID {renderSortIcon("id")}</th>
                    <th onClick={() => handleSort("symbol")}>Symbol {renderSortIcon("symbol")}</th>
                    <th onClick={() => handleSort("series")}>Series {renderSortIcon("series")}</th>
                    <th onClick={() => handleSort("date1")}>Date {renderSortIcon("date1")}</th>
                    <th onClick={() => handleSort("open_price")}>Open {renderSortIcon("open_price")}</th>
                    <th onClick={() => handleSort("high_price")}>High {renderSortIcon("high_price")}</th>
                    <th onClick={() => handleSort("low_price")}>Low {renderSortIcon("low_price")}</th>
                    <th onClick={() => handleSort("close_price")}>Close {renderSortIcon("close_price")}</th>
                    <th onClick={() => handleSort("avg_price")}>Avg Price {renderSortIcon("avg_price")}</th>
                    <th onClick={() => handleSort("prev_close")}>Prev Close {renderSortIcon("prev_close")}</th>
                    <th onClick={() => handleSort("last_price")}>Last Price {renderSortIcon("last_price")}</th>
                    <th onClick={() => handleSort("ttl_trd_qnty")}>Volume {renderSortIcon("ttl_trd_qnty")}</th>
                    <th onClick={() => handleSort("turnover_ltrs")}>Turnover {renderSortIcon("turnover_ltrs")}</th>
                    <th onClick={() => handleSort("no_of_trades")}>Trades {renderSortIcon("no_of_trades")}</th>
                    <th onClick={() => handleSort("deliv_qty")}>Deliv Qty {renderSortIcon("deliv_qty")}</th>
                    <th onClick={() => handleSort("deliv_per")}>Deliv % {renderSortIcon("deliv_per")}</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((row) => {
                      const isHighVolume = Number(row.ttl_trd_qnty) > 10000;
                      return (
                        <tr key={row.id}>
                          <td>{row.id}</td>
                          <td className={styles.symbolCell}>{row.symbol}</td>
                          <td>
                            <span className={`${styles.badge} ${styles[row.series?.toLowerCase()] || styles.defaultBadge}`}>
                              {row.series || "EQ"}
                            </span>
                          </td>
                          <td>{formatDate(row.date1)}</td>
                          <td>₹{formatNumber(row.open_price)}</td>
                          <td className={styles.priceUp}>₹{formatNumber(row.high_price)}</td>
                          <td className={styles.priceDown}>₹{formatNumber(row.low_price)}</td>
                          <td>₹{formatNumber(row.close_price)}</td>
                          <td>₹{formatNumber(row.avg_price)}</td>
                          <td>₹{formatNumber(row.prev_close)}</td>
                          <td>₹{formatNumber(row.last_price)}</td>
                          <td>
                            <span className={isHighVolume ? styles.highVolume : ""}>
                              {formatNumber(row.ttl_trd_qnty)}
                            </span>
                          </td>
                          <td>₹{formatNumber(row.turnover_ltrs)}</td>
                          <td>{formatNumber(row.no_of_trades)}</td>
                          <td>{formatNumber(row.deliv_qty)}</td>
                          <td>{row.deliv_per ? `${row.deliv_per}%` : "-"}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="16" className={styles.noResults}>
                        No stock records found matching "{search}".
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {filteredAndSortedData.length > 0 && (
              <div className={styles.pagination}>
                <span className={styles.pageInfo}>
                  Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                </span>

                <div className={styles.paginationButtons}>
                  <button
                    className={styles.pageBtn}
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <FiChevronLeft /> Previous
                  </button>
                  <button
                    className={styles.pageBtn}
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next <FiChevronRight />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}