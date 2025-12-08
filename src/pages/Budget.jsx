




import React, { useState, useEffect } from "react";
import { Card, ProgressBar, Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";

import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

export default function BudgetPage() {
  const [budget, setBudget] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [savingGoals, setSavingGoals] = useState([]);

  const [currency, setCurrency] = useState("₹"); // default

  // NEW: Currency map (only change you requested)
  const currencySymbols = {
    INR: "₹",
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
  };

  const [month, setMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [budgetForm, setBudgetForm] = useState({ title: "", limit: 0 });

  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalForm, setGoalForm] = useState({
    id: null,
    title: "",
    target: 0,
    saved: 0,
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadProfile();
    loadBudget();
    loadTransactions();
    loadSavingGoals();
  }, [month]);

  // Load Profile Currency
  const loadProfile = async () => {
    try {
      const res = await axios.get("http://localhost:8081/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const code = res.data.currency || "INR";
      setCurrency(currencySymbols[code] || "₹");
    } catch (e) {
      console.error("Error loading profile:", e);
    }
  };

  // Load Budget
  const loadBudget = async () => {
    try {
      const res = await axios.get("http://localhost:8081/api/budget", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBudget(res.data);
    } catch (e) {
      console.error("Error fetching budget:", e);
    }
  };

  // Load Transactions
  const loadTransactions = async () => {
    try {
      const res = await axios.get("http://localhost:8081/api/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(res.data);
    } catch (e) {
      console.error("Error fetching transactions:", e);
    }
  };

  // Load Saving Goals
  const loadSavingGoals = async () => {
    try {
      const res = await axios.get("http://localhost:8081/api/saving-goal", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavingGoals(res.data);
    } catch (e) {
      console.error("Error fetching saving goals:", e);
    }
  };

  // Calculate Spent for Category
  const calculateSpent = (category) => {
    return transactions
      .filter(
        (t) =>
          t.type === "expense" &&
          t.category?.trim().toLowerCase() === category.trim().toLowerCase() &&
          new Date(t.date || t.createdAt).getMonth() + 1 ===
            parseInt(month.split("-")[1]) &&
          new Date(t.date || t.createdAt).getFullYear() ===
            parseInt(month.split("-")[0])
      )
      .reduce((acc, t) => acc + parseFloat(t.amount), 0);
  };

  // Pie Chart
  const getPieChartData = () => {
    const categoryTotals = {};
    transactions.forEach((t) => {
      if (t.type === "expense") {
        const d = new Date(t.date || t.createdAt);
        if (
          d.getMonth() + 1 !== parseInt(month.split("-")[1]) ||
          d.getFullYear() !== parseInt(month.split("-")[0])
        )
          return;
        const cat = t.category?.trim().toLowerCase();
        if (cat)
          categoryTotals[cat] =
            (categoryTotals[cat] || 0) + parseFloat(t.amount);
      }
    });

    return {
      labels: Object.keys(categoryTotals),
      datasets: [
        {
          data: Object.values(categoryTotals),
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
            "#8DFF72",
            "#FF72D2",
          ],
        },
      ],
    };
  };

  // Line Chart
  const getLineChartData = () => {
    return {
      labels: savingGoals.map((g) => g.title),
      datasets: [
        {
          label: "Saved Amount",
          data: savingGoals.map((g) => g.saved),
          borderColor: "#36A2EB",
          backgroundColor: "#36A2EB33",
        },
        {
          label: "Target Amount",
          data: savingGoals.map((g) => g.target),
          borderColor: "#FF6384",
          backgroundColor: "#FF638433",
        },
      ],
    };
  };

  // Open Budget Modal
  const openBudgetModal = (b = null) => {
    if (b) setBudgetForm({ title: b.category, limit: b.limit });
    else setBudgetForm({ title: "", limit: 0 });
    setShowBudgetModal(true);
  };

  // Open Goal Modal
  const openGoalModal = (g = null) => {
    if (g) {
      setGoalForm({
        id: g.id,
        title: g.title,
        target: g.target,
        saved: g.saved,
      });
    } else {
      setGoalForm({ id: null, title: "", target: 0, saved: 0 });
    }
    setShowGoalModal(true);
  };

  // Save Budget
  const saveBudget = async () => {
    try {
      await axios.post(
        "http://localhost:8081/api/budget",
        { category: budgetForm.title, limit: Number(budgetForm.limit) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      await loadBudget();
      setShowBudgetModal(false);
    } catch (e) {
      console.error("Error saving budget:", e);
    }
  };

  // Delete Budget
  const deleteBudget = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/api/budget/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await loadBudget();
    } catch (e) {
      console.error("Error deleting budget:", e);
    }
  };

  // Save Goal
  const saveGoal = async () => {
    try {
      if (goalForm.id) {
        await axios.put(
          `http://localhost:8081/api/saving-goal/${goalForm.id}`,
          {
            title: goalForm.title,
            target: Number(goalForm.target),
            saved: Number(goalForm.saved),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        await axios.post(
          "http://localhost:8081/api/saving-goal",
          {
            title: goalForm.title,
            target: Number(goalForm.target),
            saved: Number(goalForm.saved),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

      await loadSavingGoals();
      setShowGoalModal(false);
    } catch (e) {
      console.error("Error saving goal:", e);
    }
  };

  // Delete Goal
  const deleteGoal = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/api/saving-goal/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await loadSavingGoals();
    } catch (e) {
      console.error("Error deleting goal:", e);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Monthly Budget & Saving Goals</h3>

      {/* Month Picker */}
      <div className="mb-4 d-flex align-items-center gap-3">
        <label>Month:</label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="form-control w-auto"
        />
        <Button
          onClick={() => {
            loadBudget();
            loadTransactions();
            loadSavingGoals();
          }}
        >
          Refresh
        </Button>
      </div>

      {/* Pie Chart */}
      <div className="card mb-4 p-3 shadow-sm">
        <h4 className="mb-3 text-center">Expense Breakdown</h4>
        <div style={{ width: "260px", height: "260px", margin: "0 auto" }}>
          <Pie data={getPieChartData()} />
        </div>
      </div>

      <Button className="mb-3 me-2" onClick={() => openBudgetModal()}>
        + Add / Edit Budget
      </Button>
      <Button className="mb-3" onClick={() => openGoalModal()}>
        + Add / Edit Saving Goal
      </Button>

      {/* Budgets */}
      <div className="row mb-4">
        {budget.map((b, i) => {
          const spent = calculateSpent(b.category);
          const remaining = b.limit - spent;
          const progress =
            b.limit > 0 ? Math.min((spent / b.limit) * 100, 100) : 0;

          return (
            <div key={i} className="col-md-6 mb-3">
              <Card>
                <Card.Body>
                  <div className="d-flex align-items-center mb-2">
                    <i className="bi bi-bag fs-3 me-2"></i>
                    <h5 className="mb-0">{b.category}</h5>

                    <Button
                      size="sm"
                      variant="outline-primary"
                      className="ms-auto me-2"
                      onClick={() => openBudgetModal(b)}
                    >
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => deleteBudget(b.id)}
                    >
                      Delete
                    </Button>
                  </div>

                  <p>
                    <strong>Limit:</strong> {currency}
                    {b.limit} <br />
                    <strong>Spent:</strong>{" "}
                    <span style={{ color: spent > b.limit ? "red" : "green" }}>
                      {currency}
                      {spent}
                    </span>{" "}
                    <br />
                    <strong>Remaining:</strong> {currency}
                    {remaining}
                  </p>

                  <ProgressBar
                    now={progress}
                    label={`${progress.toFixed(0)}%`}
                  />
                </Card.Body>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Saving Goals */}
      <div className="row mb-4">
        {savingGoals.map((g, i) => {
          const progress =
            g.target > 0 ? Math.min((g.saved / g.target) * 100, 100) : 0;
          return (
            <div key={i} className="col-md-6 mb-3">
              <Card>
                <Card.Body>
                  <div className="d-flex align-items-center mb-2">
                    <i className="bi bi-piggy-bank fs-3 me-2"></i>
                    <h5 className="mb-0">{g.title}</h5>

                    <Button
                      size="sm"
                      variant="outline-primary"
                      className="ms-auto me-2"
                      onClick={() => openGoalModal(g)}
                    >
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => deleteGoal(g.id)}
                    >
                      Delete
                    </Button>
                  </div>

                  <p>
                    <strong>Target:</strong> {currency}
                    {g.target} <br />
                    <strong>Saved:</strong>{" "}
                    <span
                      style={{
                        color: g.saved >= g.target ? "green" : "blue",
                      }}
                    >
                      {currency}
                      {g.saved}
                    </span>
                  </p>

                  <ProgressBar
                    now={progress}
                    label={`${progress.toFixed(0)}%`}
                  />
                </Card.Body>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Line Chart */}
      <div className="card mb-4 p-3 shadow-sm">
        <h4 className="mb-3 text-center">Saving Goals Progress</h4>
        <div style={{ width: "100%", height: "300px" }}>
          <Line data={getLineChartData()} />
        </div>
      </div>

      {/* Budget Modal */}
      <Modal show={showBudgetModal} onHide={() => setShowBudgetModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Budget</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                value={budgetForm.title}
                onChange={(e) =>
                  setBudgetForm({ ...budgetForm, title: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Limit ({currency})</Form.Label>
              <Form.Control
                type="number"
                value={budgetForm.limit}
                onChange={(e) =>
                  setBudgetForm({ ...budgetForm, limit: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowBudgetModal(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={saveBudget}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Saving Goal Modal */}
      <Modal show={showGoalModal} onHide={() => setShowGoalModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Saving Goal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={goalForm.title}
                onChange={(e) =>
                  setGoalForm({ ...goalForm, title: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Target Amount ({currency})</Form.Label>
              <Form.Control
                type="number"
                value={goalForm.target}
                onChange={(e) =>
                  setGoalForm({ ...goalForm, target: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Saved Amount ({currency})</Form.Label>
              <Form.Control
                type="number"
                value={goalForm.saved}
                onChange={(e) =>
                  setGoalForm({ ...goalForm, saved: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowGoalModal(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={saveGoal}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
