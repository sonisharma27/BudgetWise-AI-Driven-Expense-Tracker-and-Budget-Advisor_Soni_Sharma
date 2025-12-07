
import NavBar from "./Navbar";
import { Routes,Route } from "react-router-dom"
import Sidebarmenu from "./Sidebarmenu";
// import AIChat from "./AIChat";
// import { Container, Row, Col } from "react-bootstrap";
import Login from "../pages/Login";
import TransactionPage from "../pages/TransactionPage";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import ProfilePage from "../pages/ProfilePage";
import Budget from "../pages/Budget";
import ReportPage from "../pages/ReportPage";
import AIChat from "./AIChat";


function Layout({ children }) {
  return  (
     <div>
        <NavBar></NavBar>
      <Sidebarmenu>
       
      <Routes>
       
        <Route path="/register" element={<Register></Register>} />
        <Route path="/login" element={<Login></Login>} />
        {/* <Route path="*" element={<Layout></Layout>}></Route> */}
        <Route path="/profile" element={<ProfilePage></ProfilePage>} />
        <Route path="/transaction" element={<TransactionPage></TransactionPage>} />
        <Route path="/dashboard" element={<Dashboard></Dashboard>} />
        <Route path="/budget" element={<Budget></Budget>} />
         <Route path="/report" element={<ReportPage></ReportPage>} />
         <Route path="/ai" element={<AIChat></AIChat>} />
         <Route index element={<Dashboard></Dashboard>} />
      </Routes>
      </Sidebarmenu>  
       {/* <AIChat></AIChat> */}
    </div>
  );
}

export default Layout;
 