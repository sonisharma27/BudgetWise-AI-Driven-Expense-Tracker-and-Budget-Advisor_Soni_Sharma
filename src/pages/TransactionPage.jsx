



import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

export default function TransactionPage() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const preSelectedCategory = location.state?.selectedCategory || "";

  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    date: "",
    type: "expense",
    description: "",
  });

  const token = localStorage.getItem("token");

  // -----------------------------------
  //  NEW — currency state + mapping
  // -----------------------------------
  const [currency, setCurrency] = useState("₹");

  const currencySymbols = {
    INR: "₹",
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
  };

  // -----------------------------------
  //  NEW — fetch profile for currency
  // -----------------------------------
  const fetchProfileCurrency = async () => {
    try {
      const res = await axios.get("http://localhost:8081/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userCurrency = res.data.currency || "INR";
      setCurrency(currencySymbols[userCurrency] || "₹");
    } catch (error) {
      console.error("Error fetching user currency:", error);
    }
  };

  // -------------------------------
  // FETCH TRANSACTIONS
  // -------------------------------
  const fetchTransactions = async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  // -------------------------------
  // FETCH CATEGORIES
  // -------------------------------
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8081/api/budget/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchProfileCurrency(); // 🔥 NEW
    fetchTransactions();
    fetchCategories();
  }, []);

  // OPEN ADD TRANSACTION MODAL
  const openAddModal = () => {
    setIsEdit(false);
    setEditId(null);

    setFormData({
      category: preSelectedCategory || "",
      amount: "",
      date: "",
      type: "expense",
      description: "",
    });

    setShowModal(true);
  };

  // ADD TRANSACTION
  const handleAddTransaction = async () => {
    try {
      await axios.post("http://localhost:8081/api/transactions", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setShowModal(false);
      fetchTransactions();
    } catch (error) {
      console.error("Error adding transaction:", error);
      alert("Failed to add transaction");
    }
  };

  // OPEN EDIT MODAL
  const openEditModal = (txn) => {
    setIsEdit(true);
    setEditId(txn.id);

    setFormData({
      category: txn.category,
      amount: txn.amount,
      date: txn.date,
      type: txn.type,
      description: txn.description,
    });

    setShowModal(true);
  };

  // UPDATE TRANSACTION
  const handleUpdateTransaction = async () => {
    try {
      await axios.put(
        `http://localhost:8081/api/transactions/${editId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowModal(false);
      fetchTransactions();
    } catch (error) {
      console.error("Error updating transaction:", error);
      alert("Failed to update");
    }
  };

  // DELETE
  const handleDeleteTransaction = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?"))
      return;

    try {
      await axios.delete(`http://localhost:8081/api/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchTransactions();
    } catch (error) {
      console.error("Error deleting transaction:", error);
      alert("Delete failed");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Your Transactions</h2>

      <Button variant="primary" onClick={openAddModal}>
        + Add Transaction
      </Button>

      {/* TABLE */}
      <Table striped bordered hover className="mt-3 text-center">
        <thead className="table-primary">
          <tr>
            <th>#</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Description</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {transactions.length > 0 ? (
            transactions.map((txn, index) => (
              <tr key={txn.id || index}>
                <td>{index + 1}</td>
                <td>{txn.category}</td>

                {/* 🔥 REPLACED ₹ WITH DYNAMIC CURRENCY */}
                <td>{currency}{txn.amount.toFixed(2)}</td>

                <td
                  style={{
                    color: txn.type === "income" ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
                  {txn.type}
                </td>

                <td>{txn.description || "-"}</td>
                <td>
                  {txn.date
                    ? new Date(txn.date).toLocaleDateString()
                    : "No Date"}
                </td>

                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => openEditModal(txn)}
                  >
                    Edit
                  </Button>

                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteTransaction(txn.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No transactions found</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? "Edit Transaction" : "Add Transaction"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>

            {/* CATEGORY */}
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="">-- Select Category --</option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>
                    {cat}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Amount */}
            <Form.Group className="mb-3">
              <Form.Label>Amount ({currency})</Form.Label>
              <Form.Control
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
              />
            </Form.Group>

            {/* Type */}
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </Form.Select>
            </Form.Group>

            {/* Description */}
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </Form.Group>

            {/* Date */}
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>

          {isEdit ? (
            <Button variant="success" onClick={handleUpdateTransaction}>
              Update
            </Button>
          ) : (
            <Button variant="primary" onClick={handleAddTransaction}>
              Save
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}
