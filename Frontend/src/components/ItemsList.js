import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

function ItemsList({userId, shoppingList}) {
    const [isOpen,setOpen] = useState(false);
    const [itemList, setItems] = useState([]);
    
    
    const fetchItems = async () => {
        try{
            const response = await axios.get(`http://localhost:8080/api/user/${userId}/shoppingList/items`);
            setItems(response.data.map(decodeURIComponent));
            console.log('Fetched items:', response.data);
        }catch(error){
                
            console.log("Error getting items", error);

                
        }
    };
    useEffect(() => {
        fetchItems();
    },[userId]);

    useEffect(()=>{
        setItems(shoppingList.map(decodeURIComponent));
    },[shoppingList]);
    
    const handleToggle=()=>{
        setOpen(!isOpen);
    };
    const handleRemove = async (item) =>{
        
        try{
            const config = {
                headers: {
                    'Content-Type': 'text/plain',
                },
            }
            await axios.post(`http://localhost:8080/api/user/${userId}/shoppingList/removeItem`,item,config);
            fetchItems();
            
        }catch(error){
            console.log("Error removing", error);
        }

    }
    return (
        <div className='shopping-list'>
                    <button className='shopping-list-btn' onClick={handleToggle}>
                        {isOpen ? "Hide shopping list" : "Show shopping list"}
                    </button>
                    {isOpen && (
                        <div>
                            {itemList && itemList.length === 0 ? (
                        <p>No items added yet.</p>
                    ) : (
                        <ul className='list-group'>
                          {itemList.map((item)=>(
                            <li className='list-group-item d-flex justify-content-between' key={item}>
                                <span>{item}</span>
                                <button className='btn btn-danger' onClick={()=> handleRemove(item)}>X</button>
                            </li>
                          ))}
                        </ul>
                    )}
                        </div>
                    )
                    }     
        </div>
    );
}

export default ItemsList;