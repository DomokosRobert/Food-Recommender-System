import React, { useEffect,useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
function SearchNutritionists() {
    const navigate = useNavigate();
    const [nutritionists,setNutritionists] = useState([]);
    useEffect(()=>{

        fetchNutritionists();
    }, []);
    const fetchNutritionists = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/nutritionist');
            setNutritionists(response.data);
        }catch (error) {
            console.log('Error getting nutritionists:', error);
        }
    };
    const handleGoBack=()=>{
        navigate(-1);
    }

    return (
        <div className="container">
        <h1>Nutritionists</h1>
            <div className="row">
                {nutritionists.map((nutritionist) => (
                <div className="col-md-4 mb-3" key={nutritionist.id}>
                    <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">{nutritionist.firstname} {nutritionist.lastname}</h5>
                        <p className="card-text">Email: {nutritionist.email}</p>
                    </div>
                    </div>
                </div>
                ))}
            </div>
            <button className='btn btn-secondary' onClick={handleGoBack}>Back</button>
        </div>
    );
}

export default SearchNutritionists;