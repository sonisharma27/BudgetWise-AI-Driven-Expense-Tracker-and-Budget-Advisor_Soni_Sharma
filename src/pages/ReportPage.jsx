import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Table, Button, ProgressBar, Row, Col } from "react-bootstrap";
import { Bar, Pie } from "react-chartjs-2";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
);

export default function ReportPage() {
  const [transactions, setTransactions] = useState([]);
  const [savingGoals, setSavingGoals] = useState([]);
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  const [currency, setCurrency] = useState("₹"); // default currency
  const token = localStorage.getItem("token");

  // Load currency from profile
  const loadProfileCurrency = async () => {
    try {
      const res = await axios.get("http://localhost:8081/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const code = res.data.currency || "INR";
      const currencyMap = {
        INR: "₹",
        USD: "$",
        EUR: "€",
        GBP: "£",
        JPY: "¥",
      };
      setCurrency(currencyMap[code] || "₹");
    } catch (error) {
      console.error("Error loading profile currency:", error);
    }
  };

  useEffect(() => {
    loadTransactions();
    loadSavingGoals();
    loadProfileCurrency();
  }, [month]);

  const loadTransactions = async () => {
    try {
      const res = await axios.get("http://localhost:8081/api/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(res.data);
    } catch (e) {
      console.error("Error loading transactions:", e);
    }
  };

  const loadSavingGoals = async () => {
    try {
      const res = await axios.get("http://localhost:8081/api/saving-goal", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavingGoals(res.data);
    } catch (e) {
      console.error("Error loading saving goals:", e);
    }
  };

  // Filter Month Transactions
  const monthData = transactions.filter((t) => {
    const d = new Date(t.date || t.createdAt);
    return (
      d.getMonth() + 1 === parseInt(month.split("-")[1]) &&
      d.getFullYear() === parseInt(month.split("-")[0])
    );
  });

  // Summary
  const totalIncome = monthData
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = monthData
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  // Expense by Category
  const categoryTotals = {};
  monthData.forEach((t) => {
    if (t.type === "expense") {
      const cat = t.category?.trim().toLowerCase();
      if (cat) categoryTotals[cat] = (categoryTotals[cat] || 0) + t.amount;
    }
  });

  // Bar Chart
  const barData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        label: "Expenses by Category",
        data: Object.values(categoryTotals),
        backgroundColor: "#36A2EB",
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Income vs Expense Pie Chart
  const pieData = {
    labels: ["Income", "Expenses"],
    datasets: [
      {
        data: [totalIncome, totalExpense],
        backgroundColor: ["#4CAF50", "#F44336"],
      },
    ],
  };

  // Saving Goal Total
  const totalSavingTarget = savingGoals.reduce((sum, s) => sum + s.target, 0);
  const totalSavingAchieved = savingGoals.reduce((sum, s) => sum + s.saved, 0);

  // Saving Goal Pie Chart
  const savingPie = {
    labels: ["Saved", "Remaining"],
    datasets: [
      {
        data: [totalSavingAchieved, totalSavingTarget - totalSavingAchieved],
        backgroundColor: ["#2196F3", "#E0E0E0"],
      },
    ],
  };

  // Generate PDF
  const downloadPDF = () => {
    const reportElement = document.getElementById("report-section");

    html2canvas(reportElement).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
      pdf.save(`Report-${month}.pdf`);
    });
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Monthly Report</h2>

      {/* Month Picker */}
      <div className="mb-4 d-flex align-items-center gap-3">
        <label>Select Month:</label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="form-control w-auto"
        />
        <Button onClick={loadTransactions}>Refresh</Button>
      </div>

      <div id="report-section">
        {/* Summary Section */}
        <div className="row mb-4">
          <div className="col-md-4">
            <Card className="p-3 shadow-sm">
              <h5>Total Income</h5>
              <h3 className="text-success">
                {currency}
                {totalIncome}
              </h3>
            </Card>
          </div>
          <div className="col-md-4">
            <Card className="p-3 shadow-sm">
              <h5>Total Expense</h5>
              <h3 className="text-danger">
                {currency}
                {totalExpense}
              </h3>
            </Card>
          </div>
          <div className="col-md-4">
            <Card className="p-3 shadow-sm">
              <h5>Net Savings</h5>
              <h3
                className={
                  totalIncome - totalExpense >= 0
                    ? "text-primary"
                    : "text-danger"
                }
              >
                {currency}
                {totalIncome - totalExpense}
              </h3>
            </Card>
          </div>
        </div>

        {/* Bar Chart */}
        <Row>
          <Col>
            <Card className="p-3 shadow-sm mb-4">
              <h4 className="text-center">Category-wise Expense</h4>
              <div style={{ width: "300px", height: "250px" }}>
                <Bar data={barData} options={barOptions} />
              </div>
            </Card>
          </Col>
          <Col>
            <Card className="p-3 shadow-sm mb-4">
              <h4 className="text-center">Income vs Expense</h4>
              <div style={{ width: "200px", margin: "0 auto", height: "200px" }}>
                <Pie data={pieData} />
              </div>
            </Card>
          </Col>
        </Row>

        {/* Saving Goals Summary */}
        <Card className="p-3 shadow-sm mb-4">
          <h4 className="mb-3">Saving Goals Summary</h4>
          <div className="row">
            <div className="col-md-6">
              <h5>Total Saving Target:</h5>
              <h3 className="text-info">
                {currency}
                {totalSavingTarget}
              </h3>

              <h5>Total Saved:</h5>
              <h3 className="text-success">
                {currency}
                {totalSavingAchieved}
              </h3>
            </div>

            <div className="col-md-6">
              <h5 className="text-center">Saving Progress</h5>
              <div style={{ width: "200px", margin: "0 auto", height: "200px" }}>
                <Pie data={savingPie} />
              </div>
            </div>
          </div>

          <hr />

          {/* Individual Saving Goals */}
          <h5 className="mt-3">Your Saving Goals</h5>
          {savingGoals.map((g, i) => {
            const percent = g.target
              ? Math.min((g.saved / g.target) * 100, 100)
              : 0;

            return (
              <Card key={i} className="p-3 mt-3 shadow-sm">
                <h6>{g.title}</h6>
                <p>
                  {currency}
                  {g.saved} / {currency}
                  {g.target}
                </p>

                <ProgressBar now={percent} label={`${percent.toFixed(1)}%`} />
              </Card>
            );
          })}
        </Card>

        {/* Recent Transactions */}
        <Card className="p-3 shadow-sm mb-4">
          <h4>Recent Transactions</h4>
          <Table hover bordered>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Category</th>
                <th>Amount ({currency})</th>
              </tr>
            </thead>
            <tbody>
              {monthData.map((t, i) => (
                <tr key={i}>
                  <td>{new Date(t.date || t.createdAt).toLocaleDateString()}</td>
                  <td className={t.type === "income" ? "text-success" : "text-danger"}>
                    {t.type}
                  </td>
                  <td>{t.category}</td>
                  <td>
                    {currency}
                    {t.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      </div>

      <Button className="mt-3" variant="primary" onClick={downloadPDF}>
        Download PDF Report
      </Button>
    </div>
  );
}
