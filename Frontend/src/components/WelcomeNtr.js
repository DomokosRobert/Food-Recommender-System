import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';

function WelcomeNtr() {
    const location = useLocation();
    const nutritionist = location.state.nutritionist;
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    useEffect(()=>{
        fetchUsers();
    },[]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/nutritionist/${nutritionist.id}/users`);
            setUsers(response.data);
        } catch (error){
            console.log('Error getting users', error);
        }
    };

    const handleView = (user) =>{
        navigate('/user-menus', { state: { user } });
    }
    const handleGoBack=()=>{
        navigate(-1);
    }
    return (
        <div className='container'>
            <h1 className='text-center'>Welcome {nutritionist.firstname} {nutritionist.lastname}</h1>
            {users.length === 0 ? (
                <div className='alert alert-info my-4'>
                    <p>No clients for this nutritionist.</p>
                </div>
            ):(users.map((user)=>(
                <div className="card my-4" key={user.id}>
                   <div className="card-body">
                    <h5 className="card-title">{user.name}</h5>
                    <p className="card-text">Age: {user.age}</p>
                    <p className="card-text">Weight: {user.weight}</p>
                    <p className="card-text">Height: {user.height}</p>
                    <p className='card-text'>Health status: {user.userType}</p>
                    <p className="card-text">Activity Level: {user.activityLevel}</p>
                    <p className="card-text">Goal: {user.goal}</p>
                    <button className="btn btn-primary me-2" onClick={() => handleView(user)}>
                        View Menus
                        </button>
                    </div>
                </div>
            )))}
            <button className='btn btn-secondary' onClick={handleGoBack} style={{ marginLeft: '10px' }}>
                        Log Off
            </button>
        </div>
    );
}

export default WelcomeNtr;