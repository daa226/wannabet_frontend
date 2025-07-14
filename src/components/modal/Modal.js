
import React from 'react';
import './Modal.css'; 

const Modal = ({ onClose, children }) => {
  return (
    <div className="ModalOverlay" onClick={onClose}>
      <div className="ModalContent" onClick={(e) => e.stopPropagation()}>
        <button className="CloseButton" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
