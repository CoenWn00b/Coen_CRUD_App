import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { ItemContext } from '../../context/ItemContext';
import { useContext } from 'react';
import Button from '@mui/material/Button';
import { UserContext } from "../../context/UserContext";
import config from '../../config';

const apiUrl = config[process.env.REACT_APP_NODE_ENV || "development"].apiUrl;


//adapted from MUI card template
function ItemCard(props) {
    const [user, setUser] = useContext(UserContext);
    const [selectedItem, setSelectedItem] = useContext(ItemContext);
    function cardDisplay(){
        setSelectedItem(props.data);
    }

    const handleDelete = () => {
        let token =  document.cookie.split(";").find((element) => element.includes("crud_app_user")).split('=')[1];
        let options = {
            method: "DELETE",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "authorization": `bearer ${token}`,
            },
            body: JSON.stringify({
                id: props.data.id
            }),
        };
        
        fetch(`${apiUrl}item`, options)
            .then(res => {
                if(res.status === 200){
                    return true;
                }
            })
            .then(data => {
            })
            .catch(err => console.error(err))
    }

    return (
        <Card sx={{ minWidth: 275}} variant="outlined" onClick={cardDisplay}>
                <CardContent>
                    <Typography sx={{ fontSize: 28 }} color="text.secondary" gutterBottom>
                    {`Name: ${props.data.item_name}`}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {`ID: ${props.data.id}`}
                    </Typography>
                    <Typography variant="body2">
                    {`Description: ${props.data.description.substring(0,100)}...`}
                    </Typography>
                    <Typography variant="body2">
                    {`Quantity: ${props.data.quantity}`}
                    </Typography>
                    {user.hasOwnProperty("id")?<Button onClick={handleDelete} sx={{ fontSize: 14, display:"inline-block", "&:hover":{color: "green"}}}>Delete</Button>:""}
                </CardContent>
                </Card>
    
    );
  }
  
  export default ItemCard;
  