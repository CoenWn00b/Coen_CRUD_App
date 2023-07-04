import {StyleItemDetails} from "./styled_ItemDetails";
import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { UserContext } from "../../context/UserContext";
import { useContext, useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import config from "../../config";
import { ItemContext } from '../../context/ItemContext';

const apiUrl = config[process.env.REACT_APP_NODE_ENV || "development"].apiUrl;


function AddItemDetails(props) {
    const [user, setUser] = useContext(UserContext);
    const [addItem, setAddItem] = props.state;
    const [selectedItem, setSelectedItem] = useContext(ItemContext);

    console.log(user);

    function saveItem(){

        let token =  document.cookie.split(";").find((element) => element.includes("crud_app_user")).split('=')[1]
        console.log(token);   
        let itemName;
            let description;
            let quantity;
            if (document.getElementById("itemName").value){
                itemName = document.getElementById("itemName").value;}
            if (document.getElementById("description").value){
                description = document.getElementById("description").value;}
            if (document.getElementById("quantity").value){
                quantity = document.getElementById("quantity").value;}
                if (itemName && description && quantity){
                    let options = {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "authorization": `bearer ${token}`,
                          },
                        body: JSON.stringify({
                        item_name: itemName,
                        description: description,
                        quantity: quantity,
                        }),
                    };
                    fetch(`${apiUrl}item`, options)
                        .then(res=>{
                            if(res.status === 200){
                                return(res.json())
                            }else if(res.status === 400){
                                return false;
                            }
                        })
                        .then(data => {
                            setSelectedItem({});
                            setAddItem(false);
                        })
                        .catch(err => console.error(err.status));
                        
                };
    }
    

    return (
    <StyleItemDetails>
            <Card sx={{ minWidth: 275, height: "90vh" }} variant="outlined">
                    <CardContent>
                            <>
                                <TextField sx={{display:"block"}} id="itemName" label= "Name" variant="outlined" />                               
                                <TextField sx={{display:"block"}} id="description" label="Description"  variant="outlined" />
                                <TextField sx={{display:"block"}} id="quantity" label="Quantity" variant="outlined" />
                                <Button onClick={saveItem} sx={{ fontSize: 14, display:"inline-block", "&:hover":{color: "red"}}}>Save</Button>
                            </>
                        
                    </CardContent>
                    </Card>
    
    </StyleItemDetails>
    );
  }
  
  export default AddItemDetails;
  