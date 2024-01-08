import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UpdateUser({ user, onClose, onUserUpdated }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    height: '',
    weight: '',
    age: ''
  });

  useEffect(() => {
    setFormData({
      username: user.username || '',
      password: user.password || '',
      name: user.name || '',
      email: user.email || '',
      height: user.height || '',
      weight: user.weight || '',
      age: user.age || ''
    });
  }, [user]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(`http://localhost:8080/api/user/user/${user.id}`, formData);
      if (response.status === 200) {
        onUserUpdated(response.data);
        onClose();
        window.location.reload();
      }
    } catch (error) {
      console.log('Error updating user:', error);
    }
  };

  return (
    <div className="popup-form">
      <h2>Update User</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
        />
        <label htmlFor="password">Password:</label>
        <input
          type="text"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
        />
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
        />
        <label htmlFor="email">Email:</label>
        <input
          type="text"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
        />
        <label htmlFor="height">Height:</label>
        <input
          type="text"
          id="height"
          name="height"
          value={formData.height}
          onChange={handleInputChange}
        />
        <label htmlFor="weight">Weight:</label>
        <input
          type="text"
          id="weight"
          name="weight"
          value={formData.weight}
          onChange={handleInputChange}
        />
        <label htmlFor="age">Age:</label>
        <input
          type="text"
          id="age"
          name="age"
          value={formData.age}
          onChange={handleInputChange}
        />

        <button type="submit">Update User</button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default UpdateUser;
