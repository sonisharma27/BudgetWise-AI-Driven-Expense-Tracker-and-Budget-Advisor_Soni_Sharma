
import {Routes,Route} from "react-router-dom"
import Login from "./pages/Login"

import Layout from "./components/Layout"

function App(){
  return(
    <>
    
    <Routes>
      {/* <Route path="/login" element={<Login></Login>}></Route> */}
      <Route path='*' element={<Layout></Layout>}></Route>
    </Routes>
    
    
  
    
     </>
  )

}
export default App