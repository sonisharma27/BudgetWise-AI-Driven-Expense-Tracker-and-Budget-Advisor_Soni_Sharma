import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Nav, Navbar, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import Login from "../pages/Login";
import Register from "../pages/Register";

function NavBar() {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("email");
      if (token && email) {
        setIsLoggedIn(true);
        setUserEmail(email);
      } else {
        setIsLoggedIn(false);
        setUserEmail("");
      }
    };

    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);
    return () => window.removeEventListener("storage", checkLoginStatus);
  }, []);

  const doLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  };

  return (
    <Container fluid>
      <Navbar expand="lg" bg="dark" data-bs-theme="dark">
        <Container fluid>
          <Navbar.Brand
            className="text-white fw-bold"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            BudgetWise
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto my-2 my-lg-0" navbarScroll>
              <Nav.Link className="text-white" onClick={() => navigate("/transaction")}>
                Transactions
              </Nav.Link>
              <Nav.Link className="text-white" onClick={() => navigate("/profile")}>
                Profile
              </Nav.Link>
            </Nav>

            <div className="d-flex align-items-center gap-4">
              {isLoggedIn ? (
                <>
                  <div className="d-flex align-items-center text-white">
                    <i
                      className="bi bi-person-circle text-info"
                      style={{ fontSize: "2rem", marginRight: "10px" }}
                    ></i>
                    <span>{userEmail}</span>
                  </div>
                  <Button variant="danger" onClick={doLogout}>
                    <i className="bi bi-box-arrow-right"></i> Logout
                  </Button>
                </>
              ) : (
                <Button variant="success" onClick={() => setShowLoginModal(true)}>
                  <i className="bi bi-box-arrow-in-right"></i> Login
                </Button>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* ✅ Login modal with props */}
   
<Login
  show={showLoginModal}
  handleClose={() => setShowLoginModal(false)}
  openRegister={() => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  }}
/>

<Register
  show={showRegisterModal}
  handleClose={() => setShowRegisterModal(false)}
  openLogin={() => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  }}
/>


    </Container>
  );
}

export default NavBar;
