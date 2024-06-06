// src/Layout/Navbar.jsx
import React, { useState, useEffect } from 'react';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { PersonCircle } from 'react-bootstrap-icons';
import { Modal, Button } from 'react-bootstrap';
import AddIssue from '../components/AddIssue';
import './Navbar.css';
import IssueTable from '../components/IssueList';
import AddNewProjectModal from '../components/AddNewProjectModal';
import { fetchProjectList, deleteProjectById } from '../ApiService/ProjectSaveApiService';
import EditProject from '../components/EditProject';
import { CheckCircleFill } from 'react-bootstrap-icons'; // Importing the green tick icon

function CustomNavbar() {
    const [selectedProject, setSelectedProject] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showProjectWarning, setShowProjectWarning] = useState(false);
    const [project_id, setProjectId] = useState("");
    const [showIssueList, setShowIssueList] = useState(false);
    const [ShwoAddProjectModal, setShwoAddProjectModal] = useState(false);
    const [ShwoEditProjectModal, setShowEditProjectModal] = useState(false);
    const [showDeleteWarning, setShowDeleteWarning] = useState(false);
    const [success, setSuccess] = useState(false);
    const [saved, setSaved] = useState(false);
    const [update, setUpdate] = useState(false);


    const [projectOptions, setProjectOptions] = useState([]);
    const [error, setError] = useState("");





    useEffect(() => {
        async function fetchProjectListData() {
            try {
                const projects = await fetchProjectList();
                setProjectOptions(projects);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        }

        fetchProjectListData();
    }, [success, saved, update]);




    const handleSelect = (eventKey) => {
        const { projectId, projectName } = JSON.parse(eventKey);
        setSelectedProject(projectName);
        setProjectId(projectId);
        setShowProjectWarning(false);
    };

    const handleAddIssueClick = () => {
        if (!selectedProject) {
            setShowProjectWarning(true);
        } else {
            setShowModal(true);
        }
    };


    const handleIssueListViewClick = () => {
        if (!selectedProject) {
            setShowProjectWarning(true);
        } else {
            setShowIssueList(true);
        }
    };

    const handleAddProjectClick = () => {
        setShwoAddProjectModal(true);
    };
    const handleEditProjectClick = () => {
        if (!selectedProject) {
            setShowProjectWarning(true);
        } else {
            setShowEditProjectModal(true);
        }
    };

    const handleDeleteProjectClick = () => {
        if (!selectedProject) {
            setShowProjectWarning(true);
        } else {
            setShowDeleteWarning(true);
        }
    };

    // Function to handle delete confirmation
    const handleDeleteConfirmation = async () => {
        try {
            await deleteProjectById(project_id);
            setSuccess(true);
            setSelectedProject("");
        } catch (error) {
            console.error('Error deleting project:', error);
            setError('Failed to delete project. Please try again later.');
        } finally {
            setTimeout(() => {
                setShowDeleteWarning(false);
                setSuccess(false);
            }, 2000);

        }
    };

    const handleCloseModal = () => setShowModal(false);
    const handleCloseAddprojectModal = () => setShwoAddProjectModal(false);
    const handleCloseEditprojectModal = () => setShowEditProjectModal(false);


    return (
        <>
            {selectedProject && <AddIssue show={showModal} handleClose={handleCloseModal} projectId={project_id} />}
            <AddNewProjectModal show={ShwoAddProjectModal} handleClose={handleCloseAddprojectModal} onProjectSaved={() => setSaved(!saved)} />
            {selectedProject && ShwoEditProjectModal && <EditProject show={ShwoEditProjectModal} handleClose={handleCloseEditprojectModal}
                onProjectUpdate={() => setUpdate(!update)} projectId={project_id} />}

            {showIssueList && <IssueTable projectId={project_id} />}


            <Navbar bg="primary" expand="lg" className="fixed-top" variant="dark">
                <Container fluid>
                    <Navbar.Brand href="#" className="ms-5">
                        <img
                            src="src/assets/images/tigr.jpg"
                            width="50"
                            height="50"
                            className="d-inline-block align-top rounded-circle"
                            style={{ borderRadius: "50%" }}
                        />
                    </Navbar.Brand>
                    <Nav.Link title="Add New Project" className="me-3" onClick={handleAddProjectClick}>
                        Add New Project
                    </Nav.Link>

                    <NavDropdown
                        title={selectedProject === "" ? "Select Project" : selectedProject}
                        id="nav-dropdown"
                        onSelect={(eventKey) => handleSelect(eventKey)}
                        className="ms-3 custom-dropdown"
                    >
                        {selectedProject === "" && <NavDropdown.Item disabled>Select Project</NavDropdown.Item>}
                        {projectOptions.map(option => (
                            <NavDropdown.Item
                                key={option.project_id}
                                eventKey={JSON.stringify({ projectId: option.project_id, projectName: option.project_name })}
                            >
                                {option.project_name}
                            </NavDropdown.Item>
                        ))}
                    </NavDropdown>

                    <div className="selected-project me-3">
                        {selectedProject ? selectedProject : "No project selected"}
                    </div>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <Nav.Link title="Add Issue" onClick={handleAddIssueClick}>
                                Add Issue
                            </Nav.Link>
                            <Nav.Link title="View Issue List" onClick={handleIssueListViewClick}>
                                View Issue List
                            </Nav.Link>

                            <Nav.Link title="Edit Project" onClick={handleEditProjectClick}>
                                Edit Project
                            </Nav.Link>
                            <Nav.Link title="Delete Project" onClick={handleDeleteProjectClick} >
                                Delete Project
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>

                    <Navbar.Brand href="#">
                        <div className="d-flex align-items-center">
                            <PersonCircle size={35} className="rounded-circle me-2" title="My Profile" />
                        </div>
                    </Navbar.Brand>
                </Container>
            </Navbar>

            {/* Modal for warning */}
            <Modal show={showProjectWarning} onHide={() => setShowProjectWarning(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Warning</Modal.Title>
                </Modal.Header>
                <Modal.Body>Please select a project first</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowProjectWarning(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal for delete warning */}
            <Modal show={showDeleteWarning} onHide={() => setShowDeleteWarning(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Warning</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete?</Modal.Body>
                <Modal.Footer>
                    {error && <div className="text-danger">{error}</div>}
                    {success && (
                        <div className="text-success d-flex  justify-content-center">
                            <CheckCircleFill className="me-2" color="green" size={24} />
                            <span className="success-message">Successfully Deleted</span>
                        </div>
                    )}
                    {!error && !success && (
                        <>
                            <Button variant="secondary" onClick={() => setShowDeleteWarning(false)}>
                                Cancel
                            </Button>
                            <Button variant="danger" onClick={handleDeleteConfirmation}>
                                Delete
                            </Button>
                        </>
                    )}
                </Modal.Footer>
            </Modal>



        </>
    );
}

export default CustomNavbar;
