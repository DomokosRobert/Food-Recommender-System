import React, { useState } from 'react';
import axios from 'axios';

function UpdateNtr({ nutritionist, onClose, onUpdateNtr }) {
  const [formData, setFormData] = useState({
    username: nutritionist.username,
    password: nutritionist.password,
    firstname: nutritionist.firstname,
    lastname: nutritionist.lastname,
    email: nutritionist.email,
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
      const response = await axios.put(`http://localhost:8080/api/nutritionist/${nutritionist.id}`, formData);
      if (response.status === 200) {
        onUpdateNtr(response.data);
        onClose();
      }
    } catch (error) {
      console.log('Error updating nutritionist:', error);
    }
  };

  return (
    <div className="popup-form">
      <h2>Update Nutritionist</h2>
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
        <button type="submit" className="btn btn-sm btn-primary" style={{ marginRight: '8px' }}>
          Update Nutritionist
        </button>
        <button type="button" className="btn btn-sm btn-danger" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default UpdateNtr;
