import Register from "../components/register/Register";
import Login from "../components/login/Login";
import Button from '@mui/material/Button';
import config from "../config";
import { useNavigate } from "react-router-dom";

const apiUrl = config[process.env.REACT_APP_NODE_ENV || "production"].apiUrl;

function Splash() {

    let navigate = useNavigate(); 
    const routeChange = () =>{ 
        let path = `guest`; 
        navigate(path);
      }
    return (
        <>
        <h1 style={{"text-align": "center"}}>Coen's Tasty Snacks</h1>
        <div style={{"text-align": "center"}}>
            <Register/>
            <Login/>
        </div>
        <div style={{"text-align": "center"}}>
            <Button onClick={routeChange} variant="contained">Continue as Guest</Button>
        </div>
        </>

    );
  }
  
  export default Splash;
  