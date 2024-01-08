import React, {useState} from 'react';
import axios from 'axios';
import {useLocation,useNavigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function WriteMenu() {
    const location = useLocation();
    const [breakfast, setBreakfast] = useState([{description: '', servingsize: ''},
    {description: '', servingsize: ''},
    {description: '', servingsize: ''}])
    const [lunch,setLunch] = useState([{description: '',servingsize: ''},
    {description: '', servingsize: ''},
    {description: '', servingsize: ''}]);
    const [dinner,setDinner] = useState([{description: '', servingsize: ''},
    {description: '', servingsize: ''},
    {description: '', servingsize: ''}]);

    const handleBreakfastChange = (index, e) => {
        const updateFoods = [...breakfast];
        updateFoods[index] = {...updateFoods[index],[e.target.name]: e.target.value}
        setBreakfast(updateFoods);
    }
    const handleLunchChange = (index, e) => {
        const updateFoods = [...lunch];
        updateFoods[index] = {...updateFoods[index],[e.target.name]: e.target.value}
        setLunch(updateFoods);
    }
    const handleDinnerChange = (index, e) => {
        const updateFoods = [...dinner];
        updateFoods[index] = {...updateFoods[index],[e.target.name]: e.target.value}
        setDinner(updateFoods);
    }
    const navigate = useNavigate();
    const handleSubmit= async (e)=>{
        e.preventDefault();
        
        const stringMenu = [...breakfast.map((food,index)=>({
            Description: {[index]: food.description},
            ServingSize: {[index]: parseInt(food.servingsize)},
        })), ...lunch.map((food,index)=>({
            Description: {[index]: food.description},
            ServingSize: {[index]: parseInt(food.servingsize)},
        })), ...dinner.map((food,index)=>({
            Description: {[index]: food.description},
            ServingSize: {[index]: parseInt(food.servingsize)},
        })),];
        const menu = {
            menuItems: stringMenu,
        };
        console.log(JSON.stringify(menu));

        try{
            const response = await axios.post(`http://localhost:8080/api/user/${location.state.user.id}/menus`, menu);
            if(response.status===200){
                console.log('Menu saved');
            }else
            {
                console.log('Failed to save menu ' + response.status);
            }
        }catch(error){
            console.log('Error saving the menu:', error);
        }
    };
    const handleGoBack=()=>{
        navigate(-1);
    }
    
    return (
        
        <div className="container-fluid px-1 py-5 mx-auto">
            <h2 className='text-center mb-4'>Write Menu Form</h2>
                <div className="card">
                    <form className="form-card" onSubmit = {handleSubmit}>
                        <div className='row justify-content-end'>
                            <div className='form-group col-12 flex-column d-flex'>
                                <h3>Breakfast</h3>
                                {breakfast.map( (food, index) => (
                                    <div key={index}>
                                    <label className='form-control-label px-3'>Description:<span className="text-danger"> *</span></label>
                                    <input
                                        className='input-space'
                                        type='text'
                                        id='description'
                                        name='description'
                                        value={food.description}
                                        onChange={(e)=> handleBreakfastChange(index, e)}
                                        placeholder="Enter description of the food"
                                        style={{ width: '400px' }}
                                    />
                                    <label className='form-control-label px-3'>Serving Size:<span className="text-danger"> *</span></label>
                                    <input
                                        className='input-space'
                                        type='text'
                                        id='servingsize'
                                        name='servingsize'
                                        value={food.servingsize}
                                        onChange={(e)=> handleBreakfastChange(index, e)}
                                        placeholder="Enter serving size in grams"
                                        style={{ width: '300px' }}
                                    />
                                    </div>
                                ))}
                                
                            </div>
                            <div className='form-group col-12 flex-column d-flex'>
                                <h3>Lunch</h3>
                                {lunch.map( (food, index) => (
                                    <div key={index}>
                                    <label className='form-control-label px-3'>Description:<span className="text-danger"> *</span></label>
                                    <input
                                        className='input-space'
                                        type='text'
                                        id='description'
                                        name='description'
                                        value={food.description}
                                        onChange={(e)=> handleLunchChange(index, e)}
                                        placeholder="Enter description of the food"
                                        style={{ width: '400px' }}
                                    />
                                    <label className='form-control-label px-3'>Serving Size:<span className="text-danger"> *</span></label>
                                    <input
                                        className='input-space'
                                        type='text'
                                        id='servingsize'
                                        name='servingsize'
                                        value={food.servingsize}
                                        onChange={(e)=> handleLunchChange(index, e)}
                                        placeholder="Enter serving size in grams"
                                        style={{ width: '300px' }}
                                    />
                                    </div>
                                ))}
                                
                            </div>
                            <div className='form-group col-12 flex-column d-flex'>
                                <h3>Dinner</h3>
                                {dinner.map( (food, index) => (
                                    <div key={index}>
                                    <label className='form-control-label px-3'>Description:<span className="text-danger"> *</span></label>
                                    <input
                                        className='input-space'
                                        type='text'
                                        id='description'
                                        name='description'
                                        value={food.description}
                                        onChange={(e)=> handleDinnerChange(index, e)}
                                        placeholder="Enter description of the food"
                                        style={{ width: '400px' }}
                                    />
                                    <label className='form-control-label px-3'>Serving Size:<span className="text-danger"> *</span></label>
                                    <input
                                        className='input-space'
                                        type='text'
                                        id='servingsize'
                                        name='servingsize'
                                        value={food.servingsize}
                                        onChange={(e)=> handleDinnerChange(index, e)}
                                        placeholder="Enter serving size in grams"
                                        style={{ width: '300px' }}
                                    />
                                    </div>
                                ))}
                                
                            </div>
                        </div>
                        <button className='btn btn-primary submit-btn' type='submit'>Add Menu</button>
                    </form>
                    <button className='btn btn-secondary' onClick={handleGoBack} style={{ marginLeft: '10px' }}>
                        Back to previous page
                    </button>
                </div>
        </div>
        
    );
}

export default WriteMenu;