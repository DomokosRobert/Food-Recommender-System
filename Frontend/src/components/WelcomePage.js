import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ItemsList from './ItemsList';
import axios from 'axios';
function WelcomePage(){
    
   const navigate = useNavigate();
   const location = useLocation();
   const user = location.state && location.state.user;
   const hasNutritionist = user && user.nutritionist;
   const [shoppingList,setShoppingList] = useState([]);
    const start = () =>{
        console.log('User:', JSON.stringify(user));
        navigate('/formpage',{state: {user}}); 
        
    }
    const view = () =>{
        console.log('User:', JSON.stringify(user));
        navigate('/viewpage',{state: {user}}); 
        
    }
    const searchNutritionist = () => {
        navigate('/viewntr');
      };
    const handleGoBack=()=>{
        navigate(-1);
    }
    const fetchItems = async () =>{
        try{
            const response = await axios.get(`http://localhost:8080/api/user/${user.id}/shoppingList/items`);
            setShoppingList(response.data.map(decodeURIComponent));
            console.log('Fetched items:', response.data);
        }catch(error){
                
            console.log("Error getting the items", error);

                
        }
    }
    useEffect(()=>{
        fetchItems();
    },[user]);
        return (
            <div className="App">
                
                <div className="container">
                <h1 className='text-centered'>Welcome to MenuMakerz</h1>
                <div className="row">
                <div className="col-md-6">
                    
                    <div className="card">
                    <div className="card-body">
                    <div className="row">
                    <button className="btn btn-primary btn-block mb-3" onClick={start}>
                    Generate New Menu
                    </button>
                    </div>
                    <div className="row">
                    <button className="btn btn-primary btn-block mb-3" onClick={view}>
                    View Saved Menus
                    </button>
                    </div>
                    <div className="row">
                    <button className="btn btn-secondary btn-block" onClick={handleGoBack}>
                    Log Off
                    </button>
                    </div>
                    </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card">
                    <div className="card-body">
                        {hasNutritionist ? (
                        <div>
                            <h3>Your Nutritionist</h3>
                            <p>Name: {user.nutritionist.firstname} {user.nutritionist.lastname}</p>
                            <p>Email: {user.nutritionist.email}</p>
                        </div>
                        ) : (
                        <button className="btn btn-primary btn-block" onClick={searchNutritionist}>
                            Search for a Nutritionist
                        </button>
                        )}
                    </div>
                    </div>
                </div>
                </div>
            </div>
            <ItemsList userId={user.id} shoppingList={shoppingList}/>
            </div>
        );
    
}


export default WelcomePage;