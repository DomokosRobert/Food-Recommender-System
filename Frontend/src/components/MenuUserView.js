import React, { useEffect, useState} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ItemsList from './ItemsList';
function MenuUserView() {
    const location = useLocation();
    const { menuItems: {menuItems: itemsArray }}= location.state;
    const {state: {userId: idUser}} = location;
    const navigate = useNavigate();
    const breakfast = Array.isArray(itemsArray) ? itemsArray.slice(0,3) : [];
    const lunch = Array.isArray(itemsArray) ? itemsArray.slice(3,6) : [];
    const dinner = Array.isArray(itemsArray) ? itemsArray.slice(6,9) : [];
    console.log('Menu Items:', itemsArray)
    const [shoppingList, setShoppingList] = useState([]);
    const fetchItems = async () =>{
      try{
        const response = await axios.get(`http://localhost:8080/api/user/${idUser}/shoppingList/items`);
        setShoppingList(response.data.map(decodeURIComponent));
        console.log('Fetched items:', response.data);
    }catch(error){
            
        console.log("Error getting the items", error);
    }
    }
    useEffect(()=>{
      fetchItems();
    },[idUser]);
    const handleGoBack=()=>{
        navigate(-1);
    }
    const handleAddItem = async (description) =>{
      try{
        const item = decodeURIComponent(description);
        const response = await axios.post(`http://localhost:8080/api/user/${idUser}/shoppingList/addItem`,item, {
          headers: {
            'Content-Type': 'text/plain',
          }
        });
        setShoppingList((prevItems)=>[...prevItems,item]);
        console.log('Added item:', response.data);
      }catch(error){
        console.log('Error adding');
      }
      
    }
    return (
          <div className="container">
            <h3>Breakfast</h3>
            <ul className="list-group">
              {breakfast.map(item => (
                <li className="list-group-item d-flex align-items-center" key={item.ID}>
                  <div className='flex-grow-1'>
                    <span>{decodeURIComponent(item.Description[Object.keys(item.Description)[0]])}</span>
                  </div>
                  <div className='mx-2'>
                    <span>{item.ServingSize[Object.keys(item.ServingSize)[0]]} grams</span>
                  </div>
                  <div>
                    <button className='btn btn-primary' onClick={() => handleAddItem(item.Description[Object.keys(item.Description)[0]])}>Add to shopping list</button>
                  </div>
                </li>
              ))}
            </ul>
            <h3>Lunch</h3>
            <ul className="list-group">
              {lunch.map(item => (
                <li className="list-group-item d-flex align-items-center" key={item.ID}>
                  <div className='flex-grow-1'>
                  <span>{decodeURIComponent(item.Description[Object.keys(item.Description)[0]])}</span>
                  </div>
                  <div className='mx-2'>
                    <span>{item.ServingSize[Object.keys(item.ServingSize)[0]]} grams</span>
                  </div>
                  <div>
                    <button className='btn btn-primary' onClick={() => handleAddItem(item.Description[Object.keys(item.Description)[0]])}>Add to shopping list</button>
                  </div>
                </li>
              ))}
            </ul>
            <h3>Dinner</h3>
            <ul className="list-group">
              {dinner.map(item => (
                <li className="list-group-item d-flex align-items-center" key={item.ID}>
                  <div className='flex-grow-1'>
                    <span>{decodeURIComponent(item.Description[Object.keys(item.Description)[0]])}</span>
                  </div>
                  <div className='mx-2'>
                    <span>{item.ServingSize[Object.keys(item.ServingSize)[0]]} grams</span>
                  </div>
                  <div>
                    <button className='btn btn-primary' onClick={() => handleAddItem(item.Description[Object.keys(item.Description)[0]])}>Add to shopping list</button>
                  </div>
                </li>
              ))}
            </ul>
            <button className='btn btn-secondary' onClick={handleGoBack}>Back</button>
            <ItemsList userId={idUser} shoppingList={shoppingList}/>
          </div>
        
    );
  }
  

export default MenuUserView;