import React, { useState } from 'react';
import axios from 'axios';

function AddUser({ onClose, onUserAdded }) {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        name: '',
        email:'',
        height: '',
        weight:'',
        age:''
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
          const response = await axios.post('http://localhost:8080/api/user', formData);
          if (response.status === 201) {
            onUserAdded(response.data);
            onClose();
            window.location.reload();
          }
        } catch (error) {
          console.log('Error adding user:', error);
        }
      };
      return (
        <div className="popup-form">
          <h2>Add User</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" value={formData.username} onChange={handleInputChange} />
            <label htmlFor="password">Password:</label>
            <input type="text" id="password" name="password" value={formData.password} onChange={handleInputChange} />
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} />
            <label htmlFor="email">Email:</label>
            <input type="text" id="email" name="email" value={formData.email} onChange={handleInputChange} />
            <label htmlFor="height">Height:</label>
            <input type="text" id="height" name="height" value={formData.height} onChange={handleInputChange} />
            <label htmlFor="weight">Weight:</label>
            <input type="text" id="weight" name="weight" value={formData.weight} onChange={handleInputChange} />
            <label htmlFor="age">Age:</label>
            <input type="text" id="age" name="age" value={formData.age} onChange={handleInputChange} />

            <button type="submit" className="btn btn-sm btn-primary" style={{ marginRight: '8px' }}>Add User</button>
            <button type="button" className="btn btn-sm btn-danger" onClick={onClose}>Cancel</button>
          </form>
        </div>
      );
    }

export default AddUser;