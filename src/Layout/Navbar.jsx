// src/Layout/Navbar.jsx
import React, { useState, useEffect, useRef, useContext } from 'react';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { PersonCircle } from 'react-bootstrap-icons';
import { Modal, Button } from 'react-bootstrap';
import AddIssue from '../components/AddIssue';
import './Navbar.css';
import LogoChat from '../assets/images/support.png';
import LogoNav from '../assets/images/beassymbol.png';

import AddNewProjectModal from '../components/AddNewProjectModal';
import { fetchProjectList, deleteProjectById } from '../ApiService/ProjectSaveApiService';
import EditProject from '../components/EditProject';
import { CheckCircleFill } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import ChatBox from '../components/ChatBox';
import { Logout } from '../ApiService/SignupApiService';
import ChatNotification from '../components/ChatNotification';
import AddTask from '../components/AddTask';
import { issueTrackingContext } from '../components/Context';
function CustomNavbar() {
    //  const [selectedProject, setSelectedProject] = useState("");
    const { selectedProject, setSelectedProject,
        project_id, setProjectId,
        taskSavedStatus, setTaskSavedStatus, setLoginResponse,
        setIsAuthenticated, showProjectList, setShowProjectList,
        newProjectSaved, setNewProjectSaved,
        addIssueStatus, setAddIssueStatus } = useContext(issueTrackingContext);



    const [showModal, setShowModal] = useState(false);
    const [showProjectWarning, setShowProjectWarning] = useState(false);

    const [showIssueList, setShowIssueList] = useState(false);
    const [ShwoAddProjectModal, setShwoAddProjectModal] = useState(false);
    const [ShwoEditProjectModal, setShowEditProjectModal] = useState(false);
    const [showDeleteWarning, setShowDeleteWarning] = useState(false);
    const [success, setSuccess] = useState(false);

    const [update, setUpdate] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showChatBox, setShowChatBox] = useState(false);
    const [unreadMessageCount, setUnreadMessageCount] = useState(0);

    const [showAddTaskModal, setShowAddTaskModal] = useState(false);
    const [showTaskList, setShowTaskList] = useState(false);


    const [projectOptions, setProjectOptions] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const username = localStorage.getItem('username');
    const fullName = localStorage.getItem('fullName');


    const profileMenuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleProfileMenu = () => {
        setShowProfileMenu(!showProfileMenu);
    };


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
    }, [success, newProjectSaved, update]);




    const handleSelect = (eventKey) => {
        const { projectId, projectName } = JSON.parse(eventKey);
        setSelectedProject(projectName);
        setProjectId(projectId);
        setShowProjectWarning(false);
        showIssueList == true ? setShowIssueList(true) : setShowIssueList(false);
        showTaskList == true ? setShowTaskList(true) : setShowTaskList(false);
        setShowProjectList(false);
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
            setShowTaskList(false);
            // setShowIssueList(true);
            navigate(`/issueList/${project_id}`)

        }
    };

    const handleAddProjectClick = () => {
        setShwoAddProjectModal(true);
        setShowProjectList(false);
    };

    const handleAddTaskClick = () => {
        if (!selectedProject) {
            setShowProjectWarning(true);
        } else {
            setShowAddTaskModal(true);
        }
    };

    const handleTaskListViewClick = () => {
        if (!selectedProject) {
            setShowProjectWarning(true);
        } else {
            // setShowTaskList(true);
            setShowIssueList(false);
            navigate(`/taskList/${project_id}`);

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

    const handleProjectListClick = () => {
        // setShowProjectList(true);
        setShowIssueList(false);
        setSelectedProject("");
        navigate('/projectList');
        console.log('Project List clicked');
    };

    const handleLogout = async () => {
        if (window.confirm('Are you sure you want to log out?')) {
            try {
                const logoutResp = await Logout();
                if (logoutResp.status === 200) {
                    setIsAuthenticated(false);
                    localStorage.clear();
                    setShowProfileMenu(false);
                    navigate('/');
                } else {
                    console.log('Failed to logout:', logoutResp.status);
                }
            } catch (error) {
                console.error('Failed to clear local storage:', error);
            }
        }
    };

    const handleIssueStatus = () => {
        setAddIssueStatus(true);
    }

    const handleChatBox = () => {
        console.log("woking onclick");
        setShowChatBox(true);

    }

    const handleNewResourceAddClick = () => {
        if (!selectedProject) {
            setShowProjectWarning(true);
        } else {
            // setShowTaskList(true);
            setShowIssueList(false);
        }
    }
    const handleAddResourceInProjectClick = () => {
        if (!selectedProject) {
            setShowProjectWarning(true);
        } else {
            //  setShowTaskList(true);
            setShowIssueList(false);
        }
    }



    // const handleCloseChatBox = () => {
    //     setShowChatBox(false);
    // };

    const handleCloseModal = () => setShowModal(false);
    const handleCloseAddprojectModal = () => { setShwoAddProjectModal(false); setShowProjectList(true) }
    const handleCloseEditprojectModal = () => setShowEditProjectModal(false);
    const handleCloseTaskModal = () => { setShowAddTaskModal(false); }

    return (
        <>
            {selectedProject && <AddIssue show={showModal} handleClose={handleCloseModal} projectId={project_id} onIssueSave={handleIssueStatus} />}
            <AddNewProjectModal show={ShwoAddProjectModal} handleClose={handleCloseAddprojectModal} onProjectSaved={() => setNewProjectSaved(!newProjectSaved)} />
            {selectedProject && ShwoEditProjectModal && <EditProject show={ShwoEditProjectModal} handleClose={handleCloseEditprojectModal}
                onProjectUpdate={() => setUpdate(!update)} projectId={project_id} />}

            {selectedProject && <AddTask show={showAddTaskModal} handleClose={handleCloseTaskModal} projectId={project_id} />}




            <Navbar bg="primary" expand="lg" className="fixed-top" variant="dark">
                <Container fluid>
                    <Navbar.Brand href="#" className="ms-5">
                        <img
                            src={LogoNav}

                            width="70"
                            height="70"
                            className="d-inline-block align-top rounded-circle"
                            style={{ borderRadius: "50%" }}
                        />
                    </Navbar.Brand>
                    <Nav className="me-auto">
                        <NavDropdown title="Project" id="basic-nav-dropdown" className="ms-3 custom-dropdown">
                            <NavDropdown.Item onClick={handleAddProjectClick}>
                                Add New Project
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={handleProjectListClick}>
                                Project List
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>

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

                    <div className="selected-project me-1">
                        {selectedProject ? selectedProject : "No project selected"}
                    </div>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />

                    <Nav className="me-auto">
                        <NavDropdown title="Task" id="basic-nav-dropdown" className="ms-3 custom-dropdown">
                            <NavDropdown.Item onClick={handleAddTaskClick}>
                                Add Task
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={handleTaskListViewClick}>
                                View Tasks
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav className="me-auto">
                        <NavDropdown title="Issue" id="basic-nav-dropdown" className="ms-3 custom-dropdown">
                            <NavDropdown.Item onClick={handleAddIssueClick}>
                                Add Issue
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={handleIssueListViewClick}>
                                View Issues
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>

                    <Nav className="me-auto">
                        <NavDropdown title="Resource" id="basic-nav-dropdown" className="ms-3 custom-dropdown">
                            <NavDropdown.Item onClick={handleNewResourceAddClick}>
                                New Resource
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={handleAddResourceInProjectClick}>
                                Add Resource in Project
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>

                    <Navbar.Brand href="#" onClick={toggleProfileMenu}>
                        <div className="d-flex align-items-center">
                            <PersonCircle size={35} className="rounded-circle me-2" title="My Profile" />
                        </div>
                    </Navbar.Brand>
                    {showProfileMenu && (
                        <div className="profileMenu" ref={profileMenuRef}>
                            <ul>
                                <li>
                                    <b>Hi,</b>
                                    <br />
                                    {fullName ? fullName : username}!
                                </li>
                                <li onClick={handleLogout}><a>Logout</a></li>
                            </ul>
                        </div>
                    )}
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

            <div>
                {!showChatBox && (
                    <ChatNotification onUnreadMessageCountChange={setUnreadMessageCount} />
                )}
                <div>
                    {!showChatBox && (
                        <Button className="open-button" onClick={handleChatBox}>
                            {unreadMessageCount > 0 && (
                                <div className="unread-count-closed-box">
                                    <div className="speech-bubble">
                                        {unreadMessageCount}
                                    </div>
                                </div>
                            )}
                            <img
                                // src="src/assets/images/support.png"
                                src={LogoChat}
                                style={{ maxWidth: '70px', maxHeight: '70px' }}
                                alt="Support"
                            />
                        </Button>
                    )}
                    <ChatBox show={showChatBox} handleClose={() => setShowChatBox(false)} />
                </div>
            </div>

            {/* <div className="main-content">
                {selectedProject && showIssueList && <IssueTable projectId={project_id} addIssueStatus={addIssueStatus} onAddIssueStatusChange={() => setAddIssueStatus(!true)} />}
            </div> */}
            {/* <div className="main-content">
                {showProjectList && < ProjectList />}
            </div> */}
        </>
    );
}

export default CustomNavbar;
