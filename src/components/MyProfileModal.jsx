import React from 'react';
import { Modal } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons CSS if you're using Bootstrap icons

function MyProfileModal({ show, onHide, userName, onLogout }) {
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>My Profile</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Hi {userName}!</p>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-danger" onClick={onLogout}>
                    <i className="bi bi-box-arrow-right"></i> Logout
                </button>
            </Modal.Footer>
        </Modal>
    );
}

export default MyProfileModal;
