import React, { useState, useEffect, useContext } from 'react';
import DataTable from 'react-data-table-component';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AiOutlineDelete } from 'react-icons/ai';
import { fetchProjectList, deleteProjectById } from '../ApiService/ProjectSaveApiService';
import EditProject from './EditProject';
import '../App.css';
import { issueTrackingContext } from './Context';

function ProjectList() {
    const { newProjectSaved } = useContext(issueTrackingContext);

    const [projects, setProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [updated, setUpdated] = useState(false);
    const [deleted, setDeleted] = useState(false);

    useEffect(() => {
        async function getProjects() {
            try {
                const projects = await fetchProjectList();
                setProjects(projects);
                setUpdated(false);
                setDeleted(false);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        }

        getProjects();
    }, [updated, deleted, newProjectSaved]);

    const handleRowDoubleClick = (row) => {
        setSelectedProjectId(row.project_id);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProjectId(null);
    };

    const handleDeleteConfirmation = async (projectId) => {
        try {
            await deleteProjectById(projectId);
            setDeleted(true);
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    };

    const columns = [
        {
            name: 'Sl No',
            cell: (row, index) => index + 1,
            maxWidth: '50px',

        },
        {
            name: 'Name',
            selector: row => row.project_name,
            sortable: true,

        },
        {
            name: 'Duration',
            selector: row => row.project_duration,
            sortable: true,
            maxWidth: '100px',

        },
        {
            name: 'Start Date',
            selector: row => row.start_date,
            sortable: true,
            maxWidth: '100px',

        },
        {
            name: 'Team Size',
            selector: row => row.team_size,
            sortable: true,
            maxWidth: '80px',

        },
        {
            name: 'Client Name',
            selector: row => row.client_name,
            sortable: true,

        },
        {
            name: 'Project Manager Name',
            selector: row => row.project_manager_name,
            sortable: true,

        },
        {
            name: 'Customer Contact Person Name',
            selector: row => row.customer_contact_person_name,
            sortable: true,

        },
        {
            name: 'Type of Project',
            selector: row => row.type_of_project,
            sortable: true,
            maxWidth: '200px',

        },
        {
            name: 'Action',
            cell: row => (
                <div>
                    <AiOutlineDelete
                        onClick={() => {
                            if (window.confirm('Are you sure you want to delete?')) {
                                handleDeleteConfirmation(row.project_id);
                            }
                        }}
                        style={{ cursor: 'pointer' }}
                        size={30}
                        color="#dc3545"
                        title="Delete"
                    />
                </div>
            ),
            maxWidth: '150px',

        },
    ];

    const customStyles = {
        rows: {
            style: {
                minHeight: '80px', // override the row height
                '&:nth-of-type(odd)': {
                    backgroundColor: '#f3f3f3',
                },
                '&:nth-of-type(even)': {
                    backgroundColor: '#e2e2e2',
                },
            },
        },
        headCells: {
            style: {
                fontWeight: 'bold',
                whiteSpace: 'no-wrap', // Enable word wrap for header
                wordWrap: 'break-word',
                overflow: 'visible',
            },
        },
        cells: {
            style: {
                whiteSpace: 'no-wrap', // Enable word wrap for cells
                wordWrap: 'break-word',
                overflow: 'visible',
            },
        },
    };

    return (
        <>
            <DataTable
                title={<div style={{
                    textAlign: 'center', fontWeight: 'bold',
                    background: 'linear-gradient(195.8deg, rgba(11, 116, 176, 0.2) 0%, rgba(117, 73, 156, 0.2) 51%, rgba(189, 56, 97, 0.2) 81%)',
                    color: '#800080', padding: '10px', borderRadius: '5px'
                }}>Project List</div>}
                columns={columns}
                data={projects}
                pagination
                highlightOnHover
                onRowDoubleClicked={handleRowDoubleClick}
                customStyles={customStyles}
            />

            <EditProject
                show={showModal}
                handleClose={handleCloseModal}
                projectId={selectedProjectId}
                onProjectUpdate={() => setUpdated(!updated)}
            />
        </>
    );
}

export default ProjectList;
