import Splash from "./pages/Splash"
import Guest from "./pages/Guest"
import InventoryManager from "./pages/InventoryManager"
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { UserContext } from "./context/UserContext";

function App() {
  let cookie = document.cookie.split(";").find((element) => element.includes("crud_app_user"));
  let [user, setUser] = useState({})
  if(cookie && !user.id){
    let payloadData = JSON.parse(atob(cookie.split(".")[1]).replaceAll("[", "").replaceAll("]", ""));
    setUser({
      id: payloadData.id,
      firstName: payloadData.first_name,
      lastName: payloadData.last_name,
    });
  }
  useEffect(() => {
    if (!document.cookie.includes("crud_app_user")) {
      setUser({});
    } else {
      cookie = document.cookie.split(";").find((element) => element.includes("crud_app_user"));
      let payloadData = JSON.parse(atob(cookie.split(".")[1]).replaceAll("[", "").replaceAll("]", ""));
      setUser({
        id: payloadData.id,
        firstName: payloadData.first_name,
        lastName: payloadData.last_name,
        standard: payloadData.standard,
        command_staff: payloadData.commandStaff,
        administrator: payloadData.administrator,
      });
    }
  }, [document.cookie]);
  if(cookie){
    return (
      <UserContext.Provider value={[user, setUser]}>
        <div className="App">
              <Router>
                <Routes>
                  <Route path="/" element={<InventoryManager/>} />
                </Routes>
              </Router>
        </div>
      </UserContext.Provider>
    );
  }
  else{
  return (
    <UserContext.Provider value={[user, setUser]}>
      <div className="App">
            <Router>
              <Routes>
                <Route path="/" element={<Splash/>} />
                <Route path="/guest" element={<Guest/>} />
              </Routes>
            </Router>
      </div>
    </UserContext.Provider>
  );
  }
}


export default App;
