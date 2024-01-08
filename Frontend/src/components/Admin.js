import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import AddUser from './AddUser';
import AddNtr from './AddNtr';
import UpdateUser from './UpdateUser';
import UpdateNtr from './UpdateNtr';

function Admin() {
  const [users, setUsers] = useState([]);
  const [nutritionists, setNutritionists] = useState([]);
  const [selectUser, setSelectUser] = useState(null);
  const [selectNutritionist, setSelectNutritionist] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddNtr, setShowAddNtr] = useState(false);
  const [showUpdateUser, setShowUpdateUser] = useState(false);
  const [showUpdateNtr, setShowUpdateNtr] = useState(false);
  const [assignStatus,setAssign] = useState(null);
  const [showPopup, setPopup] = useState(false);
  useEffect(() => {
    fetchUsers();
    fetchNutritionists();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/user');
      setUsers(response.data);
      console.log(response.data);
    } catch (error) {
      console.log('Error getting users:', error);
    }
  };

  const fetchNutritionists = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/nutritionist');
      setNutritionists(response.data);
    } catch (error) {
      console.log('Error getting nutritionists:', error);
    }
  };

  const handleSelectUser = (user) => {
    setSelectUser(user);
  };

  const handleSelectNutritionist = (nutritionist) => {
    setSelectNutritionist(nutritionist);
  };

  const renderSelectUser = () => {
    if (selectUser) {
      return (
        <div>
          <h3>{selectUser.name}</h3>
          <p>Email: {selectUser.email}</p>
          <p>Username: {selectUser.username}</p>
        </div>
      );
    } else {
      return <p>No user selected</p>;
    }
  };

  const renderSelectNutritionist = () => {
    if (selectNutritionist) {
      return (
        <div>
          <h3>
            {selectNutritionist.firstname} {selectNutritionist.lastname}
          </h3>
          <p>Email: {selectNutritionist.email}</p>
        </div>
      );
    } else {
      return <p>No nutritionist selected</p>;
    }
  };

  const handleDeleteUser = async (user) => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/user/${user.id}`);
      if (response.status === 200) {
        setUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id));
        setSelectUser(null);
      }
    } catch (error) {
      console.log('Error deleting user:', error);
    }
  };

  const handleDeleteNutritionist = async (nutritionist) => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/nutritionist/${nutritionist.id}`);
      if (response.status === 200) {
        setNutritionists((prevNutritionists) => prevNutritionists.filter((n) => n.id !== nutritionist.id));
        setSelectNutritionist(null);
      }
    } catch (error) {
      console.log('Error deleting nutritionist:', error);
    }
  };

  const handleAddUser = () => {
    setShowAddUser(true);
  };

  const handleCloseAddUser = () => {
    setShowAddUser(false);
  };

  const handleUserAdded = (user) => {
    setUsers((prevUsers) => [...prevUsers, user]);
  };
  const handleAddNtr = () => {
    setShowAddNtr(true);
  };

  const handleCloseAddNtr = () => {
    setShowAddNtr(false);
  };

  const handleNtrAdded = (ntr) => {
    setNutritionists((prevNtr) => [...prevNtr, ntr]);
  };

  const handleUpdateUser = (user) => {
    setSelectUser(user);
    setShowUpdateUser(true);
  };

  const handleUpdateUserClose = () => {
    setShowUpdateUser(false);
  };

  const handleUserUpdated = (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
  };
  const handleUpdateNtr = (ntr) => {
    setSelectNutritionist(ntr);
    setShowUpdateNtr(true);
  };

  const handleUpdateNtrClose = () => {
    setShowUpdateNtr(false);
  };

  const handleNtrUpdated = (updatedNtr) => {
    setUsers((prevNtr) =>
      prevNtr.map((ntr) => (ntr.id === updatedNtr.id ? updatedNtr : ntr))
    );
  };
  const handleAssignment = async () =>{
    if(!selectUser || !selectNutritionist){
      alert('Please select both a nutritionist and an user!')
      return;
    }
    try{
      const response = await axios.put(`http://localhost:8080/api/user/${selectUser.id}/addNutritionist`,
        selectNutritionist.id,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if(response.status === 200){
        console.log('Assignment succesfull')
        setAssign('success');
        setPopup(true);
        setTimeout(()=>{
          setPopup(false);
        },2500);
      }else{
        setAssign('error');
      }
    }catch(e){
      setAssign('error');
    }
  }
  return (
    <div className="container-fluid px-1 py-5 mx-auto">
      
      {showAddUser && (
        <div className="add-user-popup">
          <AddUser onClose={handleCloseAddUser} onUserAdded={handleUserAdded} />
        </div>
      )}
      {showAddNtr && (
        <div className="add-user-popup">
          <AddNtr onClose={handleCloseAddNtr} onNtrAdded={handleNtrAdded} />
        </div>
      )}
      {showUpdateUser && selectUser && (
        <div className="add-user-popup">
          <UpdateUser user={selectUser} onClose={handleUpdateUserClose} onUserUpdated={handleUserUpdated} />
        </div>
      )}
      {showUpdateNtr && selectNutritionist && (
        <div className="add-user-popup">
          <UpdateNtr nutritionist={selectNutritionist} onClose={handleUpdateNtrClose} onUpdateNtr={handleNtrUpdated} />
        </div>
      )}
      <div className="card">
        <div className="row">
          <div className="col">
            <h2>Users</h2>
            <div className="mb-3">
              <button className="btn btn-sm btn-success" onClick={handleAddUser}>
                Add User
              </button>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    onClick={() => handleSelectUser(user)}
                    className={selectUser === user ? 'selected' : ''}
                  >
                    <td>{user.name}</td>
                    <td>
                      <button className="btn btn-sm btn-primary" style={{ marginRight: '8px' }} onClick={() => handleUpdateUser(user)}>
                        Update
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDeleteUser(user)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="col">
            <h2>Nutritionists</h2>
            <div className="mb-3">
              <button className="btn btn-sm btn-success" onClick={handleAddNtr}>Add Nutritionist</button>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {nutritionists.map((nutritionist) => (
                  <tr
                    key={nutritionist.id}
                    onClick={() => handleSelectNutritionist(nutritionist)}
                    className={selectNutritionist === nutritionist ? 'selected' : ''}
                  >
                    <td>
                      {nutritionist.lastname} {nutritionist.firstname}
                    </td>
                    <td>
                      <button className="btn btn-sm btn-primary" style={{ marginRight: '8px' }} onClick={() => handleUpdateNtr(nutritionist)}>
                        Update
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDeleteNutritionist(nutritionist)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      

      <div className="selected-section">
        <div>
          <h2>Selected User</h2>
          {renderSelectUser()}
        </div>
      </div>

      <div className="selected-section">
        <div>
          <h2>Selected Nutritionist</h2>
          {renderSelectNutritionist()}
        </div>
      </div>
      
      {selectUser && selectNutritionist && (
        <div>
          <button className='btn btn-sm btn-primary' onClick={handleAssignment}>
            Assign {selectNutritionist.firstname} to {selectUser.name}
          </button>
          {showPopup && (
            <div classname="popup">
              <p>{assignStatus === 'success' ? 'Assignment successful': 'Assignemnt failed'}</p>
            </div>
            
          )}
        </div>
      )}
      </div>
    </div>
  );
}

export default Admin;
