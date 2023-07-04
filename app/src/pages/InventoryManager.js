import ItemBrowser from "../components/item_browser/ItemBrowser";
import ItemDetails from "../components/item_details/ItemDetails";
import { useContext, useState, useEffect } from "react";
import { ItemContext } from "../context/ItemContext";
import config from "../config";
import Button from '@mui/material/Button';
import { UserContext } from "../context/UserContext";
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import AddItemDetails from "../components/item_details/AddItemDetails";
import { useCookies } from "react-cookie";
import { useNavigate } from 'react-router-dom';
import * as React from 'react';



const apiUrl = config[process.env.REACT_APP_NODE_ENV || "development"].apiUrl;

function InventoryManager() {
    const [itemsList, setItemsList] = useState([]);
    const [user, setUser] = useContext(UserContext);
    const [selectedItem, setSelectedItem]= useState({});
    const [addItem, setAddItem]= useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(["name"]);
    const navigate = useNavigate();
    const [checked, setChecked] = React.useState(true);



    function addToggle(){
        setAddItem(!addItem)
    }

    function logout(){
        removeCookie("crud_app_user");
        setUser({});
        navigate('/');
    }

    function filterToggle(){
        setChecked(!checked);
    }

    useEffect(()=>{
        let token =  document.cookie.split(";").find((element) => element.includes("crud_app_user")).split('=')[1]
        let options = {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
              "authorization": `bearer ${token}`,
            },
        };
        fetch(`${apiUrl}items`, options)
            .then(res=>{
                if(res.status === 200){
                    return(res.json())
                }else if(res.status === 404){
                    return false;
                }
            })
            .then(data => {
                if(data){
                    console.log(data);
                    setItemsList(data);
                }
            })
            .catch(err => console.error(err.status));
    }, [selectedItem]);


    return (
        <>
        <div>
            {user.hasOwnProperty("id")?<Button onClick={logout} sx={{ fontSize: 14, display:"inline-block", "&:hover":{color: "red"}}}>Logout</Button>:""}
        </div>
        <div>
            <Switch
            checked={checked}
            onChange={filterToggle}
            inputProps={{ 'aria-label': 'controlled' }}
            label= "My Items"
            />       
         </div>
        <div>
            {user.hasOwnProperty("id")?<Button onClick={addToggle} sx={{ fontSize: 14, display:"inline-block", "&:hover":{color: "red"}}}>Add Item</Button>:""}
        </div>
        <div style={{"text-align": "center", "width": "100%", "height": "100vh"}}>
            <ItemContext.Provider value={[selectedItem, setSelectedItem]}>
                <ItemBrowser toggleState={checked} items={itemsList} selectedItem={{setter:setSelectedItem}}/>
                {addItem?<AddItemDetails state={[addItem, setAddItem]}/>:<ItemDetails items={selectedItem}/>}
            </ItemContext.Provider>
        </div>
        </>
    );
  }
  
  export default InventoryManager;
  