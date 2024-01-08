import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [showNot, setShowNot] = useState(false);
  const [showFail, setShowFail] = useState(false);
  const [user, setUser] = useState({});
  const [nutritionist, setNutritionist] = useState({});
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (username === 'admin' && password === 'admin') {
        console.log('Admin login successful');
        navigate('/admin');
        return;
      }
      try {
        const userLogin = await axios.post('http://localhost:8080/api/user/login', { username, password });
  
        if (userLogin.status === 200) {
          console.log('User login successful');
          const userResponse = await axios.get('http://localhost:8080/api/user/username='+username);
          if(userResponse.status === 200){
            setUser(userResponse.data);
            navigate('/welcome', { state: { user: userResponse.data } });
            console.log('User:', JSON.stringify(userResponse.data));
            return;
          }
          else{
            console.log('Failed to get user');
            return;
          }
        }
      } catch (error) {

      }
      try {
        const nutritionistLogin = await axios.post('http://localhost:8080/api/nutritionist/login', { username, password });
  
        if (nutritionistLogin.status === 200) {
          console.log('Nutritionist login successful');
          const nutritionistResponse = await axios.get('http://localhost:8080/api/nutritionist/username='+username);
          if(nutritionistResponse.status === 200){
            setNutritionist(nutritionistResponse.data);
            navigate('/welcome-nutritionist', { state: { nutritionist: nutritionistResponse.data } });
            console.log('Nutritionist:', JSON.stringify(nutritionistResponse.data));
            return;
          }
          else{
            console.log('Failed to get nutritionist');
            return;
          }
          
        }
      } catch (error) {
        console.log('Login failed');
        setShowFail(true);
        setTimeout(() => {
          setShowFail(false);
        }, 5000);
      }
    } catch (error) {
      console.log('Error login:', error);
      setShowFail(true);
      setTimeout(() => {
        setShowFail(false);
      }, 5000);
    }
  };
  
  
  

  return (
    <div
      className="justify-content-center align-items-center"
    >
    <div className="container">
      <div className='card p-4'>
      <h1 className='text-center mb-4'>Login</h1>
      {showNot && (<div className='alert alert-success' role='alert'>
            User registered successfully!
        </div>)}
        {showFail && (<div className='alert alert-danger' role='alert'>
            Username or password incorrect!
        </div>)}
      <form className="form-card" onSubmit={handleSubmit}>
        <div className='row justify-content-end'>
            <div className='form-group col-12 flex-column d-flex'>
                <label htmlFor='username' className='form-control-label px-3'>Username:</label>
                <input
                    type="text"
                    className='input-space'
                    id='username'
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
          
        </div>
        <div className='row justify-content-end'>
        <div className='form-group col-12 flex-column d-flex'>
            <label htmlFor='password' className='form-control-label px-3'>Password:</label>
            <input
                type="password"
                className='input-space'
                id='password'
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
        </div>
        </div>
        <div className='d-grid gap-2'>
            <button className="btn btn-primary" type="submit">
                Login
            </button>
            <div>
                Don't have an account? <Link to="/register">Register</Link>
            </div>
        </div>
        
      </form>
    </div>
    </div>
    </div>
  );
}

export default Login;
