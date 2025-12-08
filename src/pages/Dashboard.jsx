

// import React, { useEffect, useState } from "react";
// import { Button, Card, Col, Container, Row, Navbar, Nav } from "react-bootstrap";
// import "bootstrap-icons/font/bootstrap-icons.css";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import Login from "./Login"; // ✅ Make sure path is correct

// function Dashboard() {
//   const [showLoginModal, setShowLoginModal] = useState(false);
//   const [transactions, setTransactions] = useState([]);
//   const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });

//   const navigate = useNavigate();

//   // ✅ Fetch transactions from backend
//   useEffect(() => {
//     const fetchTransactions = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get("http://localhost:8081/api/transactions", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         setTransactions(response.data);

//         // Calculate totals
//         const income = response.data
//           .filter((t) => t.type === "income")
//           .reduce((acc, t) => acc + t.amount, 0);
//         const expense = response.data
//           .filter((t) => t.type === "expense")
//           .reduce((acc, t) => acc + t.amount, 0);

//         setSummary({
//           income,
//           expense,
//           balance: income - expense,
//         });
//       } catch (error) {
//         console.error("Error fetching transactions:", error);
//       }
//     };

//     fetchTransactions();
//   }, []);

//   return (
//     <>
//       {/* 🟢 Navbar */}
//       {/* <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
//         <Container fluid>
//           <Navbar.Brand href="#">💰 BudgetWise</Navbar.Brand>
//           <Navbar.Toggle aria-controls="navbarScroll" />
//           <Navbar.Collapse id="navbarScroll">
//             {/* <Nav className="me-auto my-2 my-lg-0" navbarScroll>
//               <Nav.Link onClick={() => navigate("/")}>Home</Nav.Link>
//               <Nav.Link onClick={() => navigate("/features")}>Features</Nav.Link>
//               <Nav.Link onClick={() => navigate("/pricing")}>Pricing</Nav.Link>
//               <Nav.Link onClick={() => navigate("/profile")}>Profile</Nav.Link>
//               {/* <Nav.Link onClick={() => navigate("/transaction")}>Transaction</Nav.Link> */}
//             {/* </Nav> */} 

//             {/* <Button
//               className="ms-2"
//               variant="success"
//               onClick={() => setShowLoginModal(true)}
//             >
//               <i className="bi bi-box-arrow-in-right me-1"></i> Login
//             </Button>
//           </Navbar.Collapse>
//         </Container>
//       </Navbar> */} 

//       {/* 🟡 Dashboard Body */}
//       <Container fluid className="p-4 bg-light min-vh-100">
//         <Row className="mb-4">
//           <Col className="d-flex justify-content-between align-items-center">
//             <h2 className="fw-bold">
//               📊 Dashboard <small className="text-muted fs-6">Overview</small>
//             </h2>
//             <Button variant="outline-primary" onClick={() => navigate("/profile")}>
//               <i className="bi bi-gear-fill me-2"></i> Settings
//             </Button>
//           </Col>
//         </Row>

//         {/* Summary Cards */}
//         <Row className="g-4 mb-4">
//           <Col md={4}>
//             <Card className="shadow-sm text-center border-success">
//               <Card.Body>
//                 <i className="bi bi-cash-coin text-success" style={{ fontSize: "2rem" }}></i>
//                 <h5 className="mt-2">Total Income</h5>
//                 <h3 className="fw-bold text-success">₹{summary.income}</h3>
//               </Card.Body>
//             </Card>
//           </Col>

//           <Col md={4}>
//             <Card className="shadow-sm text-center border-danger">
//               <Card.Body>
//                 <i className="bi bi-credit-card text-danger" style={{ fontSize: "2rem" }}></i>
//                 <h5 className="mt-2">Total Expense</h5>
//                 <h3 className="fw-bold text-danger">₹{summary.expense}</h3>
//               </Card.Body>
//             </Card>
//           </Col>

//           <Col md={4}>
//             <Card className="shadow-sm text-center border-primary">
//               <Card.Body>
//                 <i className="bi bi-wallet2 text-primary" style={{ fontSize: "2rem" }}></i>
//                 <h5 className="mt-2">Remaining Balance</h5>
//                 <h3 className="fw-bold text-primary">₹{summary.balance}</h3>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>

//         {/* Recent Transactions */}
//         <Card className="shadow-sm mb-4">
//           <Card.Body>
//             <h5 className="fw-bold mb-3">🔔 Recent Transactions</h5>
//             {transactions.slice(-5).reverse().map((t, index) => (
//               <div
//                 key={index}
//                 className="d-flex justify-content-between border-bottom py-2"
//               >
//                 <span>
//                   <i
//                     className={`bi ${
//                       t.type === "income"
//                         ? "bi-arrow-down-circle text-success"
//                         : "bi-arrow-up-circle text-danger"
//                     } me-2`}
//                   ></i>
//                   {t.description}
//                 </span>
//                 <span
//                   className={`fw-bold ${
//                     t.type === "income" ? "text-success" : "text-danger"
//                   }`}
//                 >
//                   ₹{t.amount}
//                 </span>
//               </div>
//             ))}
//           </Card.Body>
//         </Card>

//         {/* Buttons */}
//         <div className="text-center mt-4">
//           <Button
//             variant="success"
//             className="me-3"
//             onClick={() => navigate("/transaction")}
//           >
//             ➕ Add Expense
//           </Button>
//           <Button variant="info">📅 View Monthly Report</Button>
//         </div>
//       </Container>

//       {/* 🟠 Login Modal */}
//       {showLoginModal && <Login />}
//     </>
//   );
// }

// export default Dashboard;







import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Login from "./Login";

function Dashboard() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [currency, setCurrency] = useState("₹"); // ✅ NEW but safe addition

  const navigate = useNavigate();

  const currencySymbols = {
    INR: "₹",
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥"
  };

  // ✅ Fetch profile + transactions
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // 🔹 Fetch user profile (only added part)
        const profileRes = await axios.get("http://localhost:8081/user/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const userCurrency = profileRes.data.currency || "INR";
        setCurrency(currencySymbols[userCurrency] || "₹");

        // 🔹 Fetch transactions (your original code)
        const response = await axios.get("http://localhost:8081/api/transactions", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTransactions(response.data);

        const income = response.data
          .filter((t) => t.type === "income")
          .reduce((acc, t) => acc + t.amount, 0);

        const expense = response.data
          .filter((t) => t.type === "expense")
          .reduce((acc, t) => acc + t.amount, 0);

        setSummary({
          income,
          expense,
          balance: income - expense,
        });
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Container fluid className="p-4 bg-light min-vh-100">
        <Row className="mb-4">
          <Col className="d-flex justify-content-between align-items-center">
            <h2 className="fw-bold">
              📊 Dashboard <small className="text-muted fs-6">Overview</small>
            </h2>
            <Button variant="outline-primary" onClick={() => navigate("/profile")}>
              <i className="bi bi-gear-fill me-2"></i> Settings
            </Button>
          </Col>
        </Row>

        {/* Summary Cards */}
        <Row className="g-4 mb-4">
          <Col md={4}>
            <Card className="shadow-sm text-center border-success">
              <Card.Body>
                <i className="bi bi-cash-coin text-success" style={{ fontSize: "2rem" }}></i>
                <h5 className="mt-2">Total Income</h5>
                <h3 className="fw-bold text-success">{currency}{summary.income}</h3>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="shadow-sm text-center border-danger">
              <Card.Body>
                <i className="bi bi-credit-card text-danger" style={{ fontSize: "2rem" }}></i>
                <h5 className="mt-2">Total Expense</h5>
                <h3 className="fw-bold text-danger">{currency}{summary.expense}</h3>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="shadow-sm text-center border-primary">
              <Card.Body>
                <i className="bi bi-wallet2 text-primary" style={{ fontSize: "2rem" }}></i>
                <h5 className="mt-2">Remaining Balance</h5>
                <h3 className="fw-bold text-primary">{currency}{summary.balance}</h3>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Recent Transactions */}
        <Card className="shadow-sm mb-4">
          <Card.Body>
            <h5 className="fw-bold mb-3">🔔 Recent Transactions</h5>
            {transactions.slice(-5).reverse().map((t, index) => (
              <div
                key={index}
                className="d-flex justify-content-between border-bottom py-2"
              >
                <span>
                  <i
                    className={`bi ${
                      t.type === "income"
                        ? "bi-arrow-down-circle text-success"
                        : "bi-arrow-up-circle text-danger"
                    } me-2`}
                  ></i>
                  {t.description}
                </span>
                <span
                  className={`fw-bold ${
                    t.type === "income" ? "text-success" : "text-danger"
                  }`}
                >
                  {currency}{t.amount}
                </span>
              </div>
            ))}
          </Card.Body>
        </Card>

        {/* Buttons */}
        <div className="text-center mt-4">
          <Button
            variant="success"
            className="me-3"
            onClick={() => navigate("/transaction")}
          >
            ➕ Add Expense
          </Button>
          <Button variant="info">📅 View Monthly Report</Button>
        </div>
      </Container>

      {showLoginModal && <Login />}
    </>
  );
}

export default Dashboard;
