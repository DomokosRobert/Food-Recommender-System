import React, {useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ItemsList from './ItemsList';
function MenuList() {
    const location = useLocation();
    const [menus, setMenus] = useState([]);
    const { user } = location.state;
    const navigate = useNavigate();
    const [items,setItems] = useState([]);
    
    useEffect(() => {
        
        fetchMenus();
        fetchItems();
    },[user]);
    const fetchMenus = async () => {
        try{
            const response = await axios.get(`http://localhost:8080/api/user/${user.id}/menus`)
            setMenus(response.data);
        }catch (error){
            console.log('Error getting the menus:', error);
            
        }
    }
    const fetchItems = async () =>{
        try{
            const response = await axios.get(`http://localhost:8080/api/user/${user.id}/shoppingList/items`);
            setItems(response.data.map(decodeURIComponent));
            console.log('Fetched items:', response.data);
        }catch(error){
                
            console.log("Error getting the items", error);

                
        }
    }
    const handleViewMenu = (menu) => {
        const content = JSON.parse(menu.content);
        navigate('/view-menu-user',{ state:{userId: user.id, menuItems: content }});
        console.log('Current user id is:',user.id)
        console.log('Menu items are:',content)
    };
    const handleGoBack=()=>{
        navigate(-1);
    }
    const handleDelete = async (menu) =>{
       
        try{
            const response = await axios.delete(`http://localhost:8080/api/user/menu/${menu.id}`);
            if(response.status === 200){
                setMenus((prev) => prev.filter((m)=> m.id!==menu.id));
            }
        }catch(error){
            console.log('Error deleting menu:', error);
        }
    }
    return (
        <div className='container'>
            <h2 className='text-center mb-4'>Menus</h2>
            {menus.map((menu)=> 
            <div className='menu-item' key={menu.id}>
            <h3 className='menu-title'>Menu {menu.id}</h3>
            <button className='btn btn-primary' onClick={() => handleViewMenu(menu)} style={{margin: '10px'}}>View Menu</button>
            <button className='btn btn-danger' onClick={() => handleDelete(menu)}>Delete</button>
        </div>
            )}
            <button className='btn btn-secondary' onClick={handleGoBack} style={{ marginLeft: '10px' }}>
                        Back to previous page
                    </button>
            <ItemsList userId={user.id}  shoppingList={items}/>
        </div>
    );
}

export default MenuList;