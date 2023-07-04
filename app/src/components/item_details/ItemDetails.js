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


function ItemDetails(props) {
    const [user, setUser] = useContext(UserContext);
    const [selectedItem, setSelectedItem] = useContext(ItemContext);

    console.log(user);
    const[editState, setEditState] = useState(false);
    const[addState, setAddState] = useState(false);
console.log(props.items.item_name);

    function editToggle(){

        if(editState){
            let itemName;
            let description;
            let quantity;
            let id;
            let token =  document.cookie.split(";").find((element) => element.includes("crud_app_user")).split('=')[1]

            if (document.getElementById("item_name").value){
                itemName = document.getElementById("item_name").value;}
            if (document.getElementById("description").value){
                description = document.getElementById("description").value;}
            if (document.getElementById("quantity").value){
                quantity = document.getElementById("quantity").value;}
            if (document.getElementById("id").value){
                id = document.getElementById("id").value;}
                if (itemName && description && quantity){
                    let options = {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "authorization": `bearer ${token}`,
                          },
                        body: JSON.stringify({
                        item_name: itemName,
                        id: id,
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
                            setEditState(!editState);
                        })
                        .catch(err => console.error(err.status));
                        
                };
            }
            else{
        setEditState(!editState);}
    }
    

    return (
    <StyleItemDetails>
            <Card sx={{ minWidth: 275, height: "90vh" }} variant="outlined">
                    <CardContent>
                        {editState?
                            <>
                                <TextField sx={{display:"block"}} id="item_name" label= "Name" defaultValue ={props.items.item_name} variant="outlined" />
                                <TextField disabled sx={{ display: "block" }} id="id" label= "ID" defaultValue={props.items.id} >
                                
                                </TextField>                                
                                <TextField sx={{display:"block"}} id="description" label="Description" defaultValue ={props.items.description} variant="outlined" />
                                <TextField sx={{display:"block"}} id="quantity" label="Quantity" defaultValue ={props.items.quantity} variant="outlined" />
                                {user.hasOwnProperty("id") && props.items.hasOwnProperty("id")?<EditIcon onClick={editToggle} sx={{ display:"inline-block", "&:hover":{color: "red"}}}></EditIcon>:""}
                            </>
                        :
                            <>
                                <Typography sx={{ fontSize: 28, display:"inline-block" }}  gutterBottom>
                                {`Name: ${props.items.item_name}`}
                                </Typography>
                                {user.hasOwnProperty("id") && props.items.hasOwnProperty("id")?<EditIcon onClick={editToggle} sx={{ display:"inline-block", "&:hover":{color: "red"}}}></EditIcon>:""}
                                <Typography sx={{ display: "block" }} >
                                {`ID: ${props.items.id}`}
                                </Typography>
                                <Typography variant="body2">
                                {`Description: ${props.items.description}`}
                                </Typography>
                                <Typography variant="body2">
                                {`Quantity: ${props.items.quantity}`}
                                </Typography>
                            </>
                        }
                        
                    </CardContent>
                    </Card>
    
    </StyleItemDetails>
    );
  }
  
  export default ItemDetails;
  