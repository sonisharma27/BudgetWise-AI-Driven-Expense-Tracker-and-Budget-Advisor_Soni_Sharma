import { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

function Login({ show, handleClose, openRegister }) {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:8081/api/auth/login", loginData);

      // ✅ Store token & email
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("email", loginData.email);

      // ✅ Notify other components (Navbar) about login
      window.dispatchEvent(new Event("storage"));

      handleClose(); // Close modal
      navigate("/dashboard"); // Redirect to dashboard
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data);
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-person-circle text-primary me-2"></i>
          Sign In
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          {/* Email */}
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="example@email.com"
              value={loginData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Password */}
          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter your password"
              value={loginData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <a href="/forgot-password" className="small text-decoration-none">
              Forgot password?
            </a>
          </div>

          <Button type="submit" variant="primary" className="w-100 fw-bold">
            <i className="bi bi-box-arrow-in-right me-2"></i> Sign In
          </Button>
        </Form>

        {/* Register link */}
        <div className="text-center mt-3">
          <p className="mb-0">
            Don’t have an account?{" "}
            <span
              className="text-primary fw-semibold"
              style={{ cursor: "pointer", textDecoration: "underline" }}
              // onClick={() => {
              //   handleClose();
              //   navigate("/register");
              // }}
              onClick={() => {
  handleClose();
  openRegister();
}}

            >
              Sign Up
            </span>
          </p>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default Login;
