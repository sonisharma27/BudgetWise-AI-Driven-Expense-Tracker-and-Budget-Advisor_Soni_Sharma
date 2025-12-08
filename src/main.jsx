
import React from "react"; 
import { createRoot } from "react-dom/client";  
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
// import SidebarMenu from "./pages/Sidebarmenu";


createRoot(document.getElementById('root')).render(
 <React.StrictMode>
  {/* <SidebarMenu></SidebarMenu> */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode> 
)
