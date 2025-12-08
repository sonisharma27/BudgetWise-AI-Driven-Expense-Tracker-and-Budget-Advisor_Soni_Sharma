import { useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Image,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    fullName: "",
    email: localStorage.getItem("email") || "",
    country: "",
    currency: "",
    profilePicture: null,
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setProfile({ ...profile, profilePicture: e.target.files[0] });
  };

  const handleSave = async () => {
    const loggedInEmail = localStorage.getItem("email");

    //  Check if entered email matches logged-in email
    if (profile.email.trim().toLowerCase() !== loggedInEmail?.toLowerCase()) {
      alert(" Entered email does not match your logged-in account!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("fullName", profile.fullName);
      formData.append("email", profile.email);
      formData.append("country", profile.country);
      formData.append("currency", profile.currency);
      if (profile.profilePicture) {
        formData.append("profilePicture", profile.profilePicture);
      }

      await axios.put("http://localhost:8081/user/profile", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert(" Profile updated successfully!");
      navigate("/dashboard"); // ✅ Redirect to transactions page
    } catch (error) {
      console.error(error);
      alert(" Error updating profile");
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-lg border-0 rounded-4">
            <Card.Body className="p-4">
              <h3 className="text-center mb-3 text-primary fw-bold">
                Your Budget Profile
              </h3>
              <p className="text-center text-muted mb-4">
                Manage your personal details and preferences.
              </p>

              {/* Profile Picture Section */}
              <div className="text-center mb-4">
                <label htmlFor="profilePictureUpload">
                  {profile.profilePicture ? (
                    <Image
                      src={URL.createObjectURL(profile.profilePicture)}
                      roundedCircle
                      width="120"
                      height="120"
                      className="object-fit-cover border border-2"
                      alt="Profile"
                    />
                  ) : (
                    <div
                      className="d-inline-flex align-items-center justify-content-center bg-light border rounded-circle"
                      style={{
                        width: "120px",
                        height: "120px",
                        color: "#888",
                        cursor: "pointer",
                      }}
                    >
                      Upload
                    </div>
                  )}
                </label>
                <Form.Control
                  id="profilePictureUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </div>

              {/* Form Section */}
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={profile.fullName}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={profile.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    type="text"
                    name="country"
                    placeholder="Enter your country"
                    value={profile.country}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Preferred Currency</Form.Label>
                  <Form.Select
                    name="currency"
                    value={profile.currency}
                    onChange={handleChange}
                  >
                    <option value="">Select currency</option>
                    <option value="INR">INR (₹) - Indian Rupee</option>
                    <option value="USD">USD ($) - US Dollar</option>
                    <option value="EUR">EUR (€) - Euro</option>
                    <option value="GBP">GBP (£) - British Pound</option>
                    <option value="JPY">JPY (¥) - Japanese Yen</option>
                  </Form.Select>
                </Form.Group>

                <div className="text-center">
                  <Button
                    variant="primary"
                    size="lg"
                    className="px-5 rounded-pill"
                    onClick={handleSave}
                  >
                    Save Profile
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;









