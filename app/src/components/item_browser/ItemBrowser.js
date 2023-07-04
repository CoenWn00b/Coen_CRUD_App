import {StyleItemBrowser} from "./styled_ItemBrowser";
import ItemCard from "../item_card/ItemCard";
import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { UserContext } from "../../context/UserContext";
import { useContext, useState } from "react";
import config from "../../config";
import { ItemContext } from '../../context/ItemContext';

const apiUrl = config[process.env.REACT_APP_NODE_ENV || "development"].apiUrl;

//adapted from MUI Stack template
function ItemBrowser(props) {
    const [selectedItem, setSelectedItem] = useContext(ItemContext);

    const [user, setUser] = useContext(UserContext);
    const[addState, setAddState] = useState(false);

    let filteredList;
    console.log(props.toggleState);
    if(props.toggleState){
        filteredList=props.items.filter(item=>user.id==item.user_id);
    } else{
        filteredList=props.items;
    }
   
    return (
        <StyleItemBrowser>
                <Typography sx={{ fontSize: 36 }} color="text.secondary" gutterBottom>
                    Items List
                </Typography>
                <Box sx={{ width: '100%' }}>
                    <Stack spacing={2} sx={{display:"inline-block"}}>
                        {filteredList.map(item => <ItemCard data={item}/>)
                        }
                    </Stack>
                </Box>
        </StyleItemBrowser>
    );
  }
  
  export default ItemBrowser;
  