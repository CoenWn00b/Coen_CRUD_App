import ItemBrowser from "../components/item_browser/ItemBrowser";
import ItemDetails from "../components/item_details/ItemDetails";
import { useState, useEffect } from "react";
import { ItemContext } from "../context/ItemContext";
import config from "../config";

const apiUrl = config[process.env.REACT_APP_NODE_ENV || "development"].apiUrl;


function Guest() {
    const [selectedItem, setSelectedItem] = useState(
        {
            itemName: "",
            itemId: NaN,
            description: "",
            quantity: NaN
        }
    )
    const [itemsList, setItemsList] = useState([]);

    useEffect(()=>{
        let options = {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
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
    }, []);

    return (
    <div style={{"text-align": "center", "width": "100%", "height": "100vh"}}>
        <ItemContext.Provider value={[selectedItem, setSelectedItem]}>
            <ItemBrowser items={itemsList} selectedItem={{setter:setSelectedItem}}/>
            <ItemDetails items={selectedItem}/>
        </ItemContext.Provider>
    </div>
    );
  }
  
  export default Guest;
  