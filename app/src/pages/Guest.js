import ItemBrowser from "../components/item_browser/ItemBrowser";
import ItemDetails from "../components/item_details/ItemDetails";
import { useState } from "react";
import { ItemContext } from "../context/ItemContext";

function Guest() {
    const [selectedItem, setSelectedItem] = useState(
        {
            itemName: "",
            itemId: NaN,
            description: "",
            quantity: NaN
        }
    )
    const [itemsList, setItemsList] = useState([
        {
            itemName: "Cheese",
            itemId: 1,
            description: "very delicious",
            quantity: 100
        },
        {
            itemName: "Sausage",
            itemId: 2,
            description: "sus",
            quantity: 69
        },
        {
            itemName: "Wine",
            itemId: 3,
            description: "drunk",
            quantity: 42
        },
        {
            itemName: "Ham",
            itemId: 4,
            description: "meh",
            quantity: 1
        },
        ]);
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
  