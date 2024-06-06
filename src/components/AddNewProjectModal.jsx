import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';

import { saveProject } from '../ApiService/ProjectSaveApiService';

function AddNewProjectModal({ show, handleClose, onProjectSaved }) {

    const initialProjectData = {
        project_duration: '',
        project_name: '',
        start_date: '',
        team_size: ''
    };

    const [projectData, setProjectData] = useState(initialProjectData);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProjectData({ ...projectData, [name]: value });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await saveProject(projectData);
            console.log('Response:', response);
            setSaved(true);
            onProjectSaved();
            setTimeout(() => {

                resetFields();
                handleClose();
                setSaved(false);
            }, 2000);
        } catch (error) {
            console.error('Error saving issue:', error);
        } finally {
            setSaving(false);
        }
    };

    const resetFields = () => {
        setProjectData(initialProjectData);
    };



    const handleCardClose = () => {
        setSaved(false);
        handleClose();
        resetFields();
    };




    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Project</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="projectName">
                            <Form.Label>Project Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="project_name"
                                value={projectData.project_name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="projectDuration">
                            <Form.Label>Project Duration</Form.Label>
                            <Form.Control
                                type="text"
                                name="project_duration"
                                value={projectData.project_duration}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="startDate">
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="start_date"
                                value={projectData.start_date}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="teamSize">
                            <Form.Label>Team Size</Form.Label>
                            <Form.Control
                                type="text"
                                name="team_size"
                                value={projectData.team_size}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>


                        <Button variant="primary" type="submit" style={{ marginTop: '1rem' }} disabled={saving}>
                            {saving ? <Spinner animation="border" size="sm" /> : 'Add Project'}
                        </Button>

                    </Form>
                    {saved && (
                        <Card className="text-center" style={{ backgroundColor: '#0a2bcb', color: 'white', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: '999', padding: '20px' }}>
                            <Card.Body>
                                <Card.Title>Saved Successfully!</Card.Title>
                                <Button variant="light" onClick={handleCardClose}>Close</Button>
                            </Card.Body>
                        </Card>
                    )}

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );

}

export default AddNewProjectModal;
