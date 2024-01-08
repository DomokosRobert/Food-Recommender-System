import React, {useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function UserMenus() {
    const location = useLocation();
    const [menus, setMenus] = useState([]);
    const { user } = location.state;
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchMenus = async () => {
            try{
                const response = await axios.get(`http://localhost:8080/api/user/${user.id}/menus`)
                setMenus(response.data);
            }catch (error){
                console.log('Error getting the menus:', error);
                
            }
        }
        fetchMenus();
    },[user]);
    
    const handleViewMenu = (menu) => {
        const content = JSON.parse(menu.content);
        navigate('/view-menu',{ state:{ menuItems: content }});
    };
    const handleAddMenu = () => {
        console.log('User:', JSON.stringify(user));
        navigate('/formpage',{state: {user}}); 
    }
    const handleWriteMenu = () => {
        console.log('User:', JSON.stringify(user));
        navigate('/formmenu',{state: {user}}); 
    }
    const handleGoBack=()=>{
        navigate(-1);
    }
    const handleDelete = (menu) =>{
        
        axios
        .delete(`http://localhost:8080/api/user/menu/${menu.id}`)
        .then((response) =>{
            if(response.status ===200){
                setMenus((prev)=> prev.filter((m)=> m.id !== menu.id))
            }
        })
        .catch( (error) =>{
            console.log('Error deleteing menu:', error);
        })
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
            <div className='d-grid gap-2'>
            <button className='btn btn-secondary' onClick={() => handleAddMenu()}>Generate New Menu</button>
            <button className='btn btn-secondary' onClick={() => handleWriteMenu()}>Prescribe New Menu</button>
            <button className='btn btn-secondary' onClick={() => handleGoBack()}>Back</button>  
        </div>
        </div>
    );
}

export default UserMenus;