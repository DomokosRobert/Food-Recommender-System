import React from 'react';
import { Modal, Button } from 'react-bootstrap';

function MenuPage({ show, onClose, menuItems,accuracy, precision, recall, f1 ,onSave }) {
  const itemsArray = Object.values(menuItems); 
  const breakfast = itemsArray.slice(0,3);
  const lunch = itemsArray.slice(3,6);
  const dinner = itemsArray.slice(6,9);
  const handleSave = () => {
    onSave(menuItems);
    onClose();
  }
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Menu</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <h3>Breakfast</h3>
          <ul className="list-group">
            {breakfast.map(item => (
              <li className="list-group-item d-flex justify-content-between" key={item.ID}>
                <span>{item.Description[Object.keys(item.Description)[0]]}</span>
                <span>{item.ServingSize[Object.keys(item.ServingSize)[0]]} grams</span>
              </li>
            ))}
          </ul>
          <h3>Lunch</h3>
          <ul className="list-group">
            {lunch.map(item => (
              <li className="list-group-item d-flex justify-content-between" key={item.ID}>
                <span>{item.Description[Object.keys(item.Description)[0]]}</span>
                <span>{item.ServingSize[Object.keys(item.ServingSize)[0]]} grams</span>
              </li>
            ))}
          </ul>
          <h3>Dinner</h3>
          <ul className="list-group">
            {dinner.map(item => (
              <li className="list-group-item d-flex justify-content-between" key={item.ID}>
                <span>{item.Description[Object.keys(item.Description)[0]]}</span>
                <span>{item.ServingSize[Object.keys(item.ServingSize)[0]]} grams</span>
              </li>
            ))}
          </ul>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default MenuPage;
