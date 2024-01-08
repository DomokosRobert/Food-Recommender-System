import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
function ViewMenu() {
    const location = useLocation();
    const { menuItems: { menuItems: itemsArray } }= location.state;
    const navigate = useNavigate();
    const breakfast = Array.isArray(itemsArray) ? itemsArray.slice(0,3) : [];
    const lunch = Array.isArray(itemsArray) ? itemsArray.slice(3,6) : [];
    const dinner = Array.isArray(itemsArray) ? itemsArray.slice(6,9) : [];

    const handleGoBack=()=>{
        navigate(-1);
    }
    
    return (
          <div className="container">
            <h3>Breakfast</h3>
            <ul className="list-group">
              {breakfast.map(item => (
                <li className="list-group-item d-flex justify-content-between" key={item.ID}>
                  <span>{decodeURIComponent(item.Description[Object.keys(item.Description)[0]])}</span>
                  <span>{item.ServingSize[Object.keys(item.ServingSize)[0]]} grams</span>
                </li>
              ))}
            </ul>
            <h3>Lunch</h3>
            <ul className="list-group">
              {lunch.map(item => (
                <li className="list-group-item d-flex justify-content-between" key={item.ID}>
                  <span>{decodeURIComponent(item.Description[Object.keys(item.Description)[0]])}</span>
                  <span>{item.ServingSize[Object.keys(item.ServingSize)[0]]} grams</span>
                </li>
              ))}
            </ul>
            <h3>Dinner</h3>
            <ul className="list-group">
              {dinner.map(item => (
                <li className="list-group-item d-flex justify-content-between" key={item.ID}>
                  <span>{decodeURIComponent(item.Description[Object.keys(item.Description)[0]])}</span>
                  <span>{item.ServingSize[Object.keys(item.ServingSize)[0]]} grams</span>
                </li>
              ))}
            </ul>
            <button className='btn btn-secondary' onClick={handleGoBack}>Back</button>
          </div>
        
    );
  }
  

export default ViewMenu;