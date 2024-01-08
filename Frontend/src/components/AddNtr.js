import React, { useState } from 'react';
import axios from 'axios';

function AddNtr({ onClose, onNtrAdded }) {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        firstname: '',
        lastname: '',
        email:''
      });
    
      const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };
      const handleSubmit = async (event) => {
        event.preventDefault();
        try {
          const response = await axios.post('http://localhost:8080/api/nutritionist', formData);
          if (response.status === 201) {
            onNtrAdded(response.data);
            onClose();
            window.location.reload();
          }
        } catch (error) {
          console.log('Error adding nutritionist:', error);
        }
      };
      return (
        <div className="popup-form">
          <h2>Add Nutritionist</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" value={formData.username} onChange={handleInputChange} />
            <label htmlFor="password">Password:</label>
            <input type="text" id="password" name="password" value={formData.password} onChange={handleInputChange} />
            <label htmlFor="firstname">First Name:</label> 
            <input type="text" id="firstname" name="firstname" value={formData.firstname} onChange={handleInputChange} />
            <label htmlFor="lastname">Last Name:</label>
            <input type="text" id="lastname" name="lastname" value={formData.lastname} onChange={handleInputChange} />  
            <label htmlFor="email">Email:</label>
            <input type="text" id="email" name="email" value={formData.email} onChange={handleInputChange} />
             <button type="submit" className="btn btn-sm btn-primary" style={{ marginRight: '8px' }}>Add Nutritionist</button>
            <button type="button" className="btn btn-sm btn-danger" onClick={onClose}>Cancel</button>
          </form>
        </div>
      );
    }

export default AddNtr;