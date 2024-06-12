import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import { fetchProjectById, UpdateProject } from '../ApiService/ProjectSaveApiService';

function EditProject({ show, handleClose, projectId, onProjectUpdate }) {
    const initialProjectData = {
        project_id: '',
        project_name: '',
        project_duration: '',
        start_date: '',
        team_size: '',
        client_name: '',
        project_manager_name: '',
        customer_contact_person_name: '',
        type_of_project: ''
    };

    const [projectData, setProjectData] = useState(initialProjectData);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        async function fetchProject() {
            try {
                const projectData = await fetchProjectById(projectId);
                setProjectData(projectData);
            } catch (error) {
                console.error('Error fetching project by ID:', error);
            }
        }

        if (projectId) {
            fetchProject();
        }
    }, [projectId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProjectData({ ...projectData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            const response = await UpdateProject(projectData);
            console.log('Response:', response);
            setSaved(true);
            onProjectUpdate();
            setTimeout(() => {
                resetFields();
                handleClose();
                setSaved(false);
            }, 2000);
        } catch (error) {
            console.error('Error updating project:', error);
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
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Update {projectData.project_name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="projectId">
                        <Form.Label>Project ID</Form.Label>
                        <Form.Control
                            type="text"
                            name="project_id"
                            value={projectData.project_id}
                            onChange={handleChange}
                            readOnly
                            required
                        />
                    </Form.Group>

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

                    <Form.Group controlId="clientName">
                        <Form.Label>Client Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="client_name"
                            value={projectData.client_name}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="projectManagerName">
                        <Form.Label>Project Manager Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="project_manager_name"
                            value={projectData.project_manager_name}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="customerContactPersonName">
                        <Form.Label>Customer Contact Person Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="customer_contact_person_name"
                            value={projectData.customer_contact_person_name}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="typeOfProject">
                        <Form.Label>Type of Project</Form.Label>
                        <Form.Control
                            as="select"
                            name="type_of_project"
                            value={projectData.type_of_project}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Type</option>
                            <option value="Development/Enhancement">Development/Enhancement</option>
                            <option value="Enhancement & Maintenance">Enhancement & Maintenance</option>
                            <option value="Maintenance & Support">Maintenance & Support</option>
                        </Form.Control>
                    </Form.Group>

                    <Button variant="primary" type="submit" style={{ marginTop: '1rem' }} disabled={saving}>
                        {saving ? <Spinner animation="border" size="sm" /> : 'Update Project'}
                    </Button>
                </Form>

                {saved && (
                    <Card className="text-center" style={{ backgroundColor: '#0a2bcb', color: 'white', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: '999', padding: '20px' }}>
                        <Card.Body>
                            <Card.Title>Updated Successfully!</Card.Title>
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
    );
}

export default EditProject;
