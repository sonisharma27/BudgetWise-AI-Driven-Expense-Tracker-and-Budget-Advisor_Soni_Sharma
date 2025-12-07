import { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register({ show, handleClose,openLogin  }) {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("http://localhost:8081/api/auth/register", user);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("email", user.email);

        // Notify other components (Navbar)
        window.dispatchEvent(new Event("storage"));

        setSuccess("Registration successful!");
        handleClose();
        navigate("/dashboard");
      } else {
        setSuccess("Registered successfully, please login!");
        handleClose();
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Registration error:", err);
      if (err.response && err.response.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-person-plus-fill text-primary me-2"></i> Create Account
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          {/* Name */}
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="John Doe"
              value={user.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Email */}
          <Form.Group className="mb-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="example@email.com"
              value={user.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Password */}
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter your password"
              value={user.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100 fw-bold">
            <i className="bi bi-person-check-fill me-2"></i> Sign Up
          </Button>
        </Form>

        <div className="text-center mt-3">
          <p className="mb-0">
            Already have an account?{" "}
            <span
              className="text-primary fw-semibold"
              style={{ cursor: "pointer", textDecoration: "underline" }}
              onClick={() => {
  handleClose();
  openLogin();
}}

            >
              Sign In
            </span>
          </p>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default Register;
