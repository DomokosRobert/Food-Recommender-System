import React, { useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import MenuPage from './MenuPage';
import axios from 'axios';
import {useLocation, useNavigate} from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
function FormPage(){
    const [loading, setLoading] = useState(false);
    const [showMenu, setMenu]= useState(false);
    const [menuItems, setMenuItems] = useState([]);
    const [accuracy, setAccuracy] = useState(0);
    const [precision, setPrecision] = useState(0);
    const [recall, setRecall] = useState(0);
    const [f1, setF1] = useState(0);
    const location = useLocation();
    const navigate = useNavigate();
    const initialFormdata = location.state?.user
    ? {
        height: location.state.user.height || '',
        weight: location.state.user.weight || '',
        age: location.state.user.age || '',
        userType: 'HEALTHY',
        preferences: location.state.user.preferences || '',
        activityLevel: location.state.user.activityLevel || 'LITTLE',
        goal: location.state.user.goal || 'MAINTAIN'
    }
    : {
        height: '',
        weight: '',
        age: '',
        userType: 'HEALTHY',
        preferences: '',
        activityLevel: 'LITTLE',
        goal: 'MAINTAIN'
      };
    const [formdata, setFormData] = useState(initialFormdata);
    const handleInputChange = (event) =>{
        const { name, value} = event.target;
        setFormData({...formdata, [name]: value});
    }
    const handleSubmit = async (event) => {
        event.preventDefault();
        try{
            const response = await axios.put('http://localhost:8080/api/user/'+ location.state.user.id,formdata);
            if(response.status === 200){
                console.log('User updated',JSON.stringify(response.data));
                setLoading(true);
                const userObject = response.data;
                const sendResponse = await axios.post('http://localhost:7777/receive_user',userObject);
                if(sendResponse.status ===200){
                    console.log('User sent');
                    setMenuItems(sendResponse.data.menu);
                    setAccuracy(sendResponse.data.accuracy);
                    setPrecision(sendResponse.data.precision);
                    setRecall(sendResponse.data.recall);
                    setF1(sendResponse.data.f1score);
                    console.log('Accuracy', response.data.accuracy)
                    setMenu(true);
                }else{
                    console.log('Failed to send');
                }
            }else{
                console.log('Failed to update');
            } 
        }catch (error){
            console.log('Error user update:', error);
        } finally{
            setLoading(false);
        }
    }
    const handleCloseMenu = () =>{
        setMenu(false);
    }
    const handleSaveMenu = async () =>{

        try{
            const response = await axios.post(`http://localhost:8080/api/user/${location.state.user.id}/menus`, {
      menuItems: menuItems
    });
            if(response.status===200){
                console.log('Menu saved');
            }else
            {
                console.log('Failed to save ' + response.status);
            }
        }catch (error){
            console.log('Error saving the menu:', error);
        }
    }
    const handleGoBack=()=>{
        navigate(-1);
    }
    return (
        
        <div className="container-fluid px-1 py-5 mx-auto">
            <h2 className='text-center mb-4'>Please input your nutritional information</h2>
                <div className="card">
                    <form className="form-card" onSubmit = {handleSubmit}>
                        <div className='row justify-content-end'>
                            <div className='form-group col-12 flex-column d-flex'>
                                <label className='form-control-label px-3'>Height:<span className="text-danger"> *</span></label>
                                <input
                                    className='input-space'
                                    type='text'
                                    id='height'
                                    name='height'
                                    value={formdata.height}
                                    onChange={handleInputChange}
                                    placeholder="Enter your height"
                                />
                            </div>
                        </div>
                        <div className='row justify-content-end'>
                            <div className='form-group col-12 flex-column d-flex'>
                                <label className='form-control-label px-3'>Weight:<span className="text-danger"> *</span></label>
                                <input
                                    className='input-space'
                                    type='text'
                                    id='weight'
                                    name='weight'
                                    value={formdata.weight}
                                    onChange={handleInputChange}
                                    placeholder="Enter your Weight"
                                    
                                />
                            </div>
                        </div>
                        <div className='row justify-content-end'>
                            <div className='form-group col-12 flex-column d-flex'>
                                <label className='form-control-label px-3'>Age:<span className="text-danger"> *</span></label>
                                <input
                                    className='input-space'
                                    type='text'
                                    id='age'
                                    name='age'
                                    value={formdata.age}
                                    onChange={handleInputChange}
                                    placeholder="Enter your Age"
                                />
                            </div>
                        </div>
                        <div className='row justify-content-end'>
                            <div className='form-group col-12 flex-column d-flex'>
                                <label className='form-control-label px-3'>Health status:<span className="text-danger"> *</span></label>
                                <select
                                    className='form-control input-space'
                                    type='text'
                                    id='userType'
                                    name='userType'
                                    value={formdata.userType}
                                    onChange={handleInputChange}
                                    
                                >
                                    <option defaultValue="HEALTHY">Healthy</option>
                                    <option value="DIABETES">Diabetes</option>
                                    <option value="HYPERTENSIVE">Hypertensive</option>
                                </select>
                            </div>
                        </div>
                        <div className='row justify-content-end'>
                            <div className='form-group col-12 flex-column d-flex'>
                                <label className='form-control-label px-3'>Preferences:<span className="text-danger"> *</span></label>
                                <input
                                    className='input-space'
                                    type='text'
                                    id='preferences'
                                    name='preferences'
                                    value={formdata.preferences}
                                    onChange={handleInputChange}
                                    placeholder="Enter your preferences"
                                />
                            </div>
                        </div>
                        <div className='row justify-content-end'>
                            <div className='form-group col-12 flex-column d-flex'>
                                <label className='form-control-label px-3'>Activity level:<span className="text-danger"> *</span></label>
                                <select
                                    className='form-control input-space'
                                    type='text'
                                    id='activityLevel'
                                    name='activityLevel'
                                    value={formdata.activityLevel}
                                    onChange={handleInputChange}
                                    
                                >
                                    <option defaultValue="LITTLE">Little exercise</option>
                                    <option value="LIGHT">Light exercise</option>
                                    <option value="MODERATE">Moderate exercise</option>
                                    <option value="STRONG">Strong exercise</option>
                                    <option value="EXTREME">Extreme exercise</option>
                                </select>
                            </div>
                        </div>
                        <div className='row justify-content-end'>
                            <div className='form-group col-12 flex-column d-flex'>
                                <label className='form-control-label px-3'>What is your weight goal:<span className="text-danger"> *</span></label>
                                <select
                                    className='form-control input-space'
                                    type='text'
                                    id='goal'
                                    name='goal'
                                    value={formdata.goal}
                                    onChange={handleInputChange}
                                    
                                >
                                    <option value='LOSE'>Lose weight</option>
                                    <option value='MAINTAIN'>Maintain weight</option>
                                    <option value='GAIN'>Gain weight</option>
                                </select>
                            </div>
                        </div>
                        {loading ? (
                            <div className="text-center">
                            <Spinner animation="border" role="status">
                              <span className="sr-only">Loading...</span>
                            </Spinner>
                            <p>Generating menu...</p>
                          </div>
                        ) : (
                            <button className='btn btn-primary submit-btn' type='submit'>Create Menu</button>
                        )}
                        
                    </form>
                    <button className='btn btn-secondary' onClick={handleGoBack} style={{ marginLeft: '10px' }}>
                        Back to previous page
                    </button>
                    <MenuPage show = {showMenu} onClose={handleCloseMenu} menuItems ={menuItems} accuracy = {accuracy} precision = {precision} recall = {recall} f1 = {f1} onSave={handleSaveMenu}/>
                </div>
        </div>
        
    );
    
}

export default FormPage;