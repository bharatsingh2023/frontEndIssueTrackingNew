import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import 'bootstrap/dist/css/bootstrap.min.css';
import { IssueListFetch, deleteIssueById } from '../ApiService/fetchIssueList';
import { Modal, Button } from 'react-bootstrap';
import { AiOutlineCheckCircle, AiOutlineDelete, AiOutlineCloseCircle, AiOutlineEdit } from 'react-icons/ai';
import UpdateIssueModal from './UpdateIssueModal';

function IssueTable({ projectId, addIssueStatus, onAddIssueStatusChange }) {
    const [issues, setIssueList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState({});
    const [updated, setUpdated] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [currentIssue, setCurrentIssue] = useState(null);



    useEffect(() => {


        async function fetchIssueList() {
            try {
                const issuesList = await IssueListFetch(projectId);
                console.log("issuesList--> ", issuesList);
                setIssueList(issuesList);
                setDeleted(false);
                onAddIssueStatusChange();
                setUpdated(false);
            } catch (error) {
                console.error('Error fetching issue list:', error);
            }
        }


        fetchIssueList();
    }, [projectId, updated, deleted, addIssueStatus]);



    const handleUpdate = (issue) => {
        setCurrentIssue(issue);
        setShowUpdateModal(true);
    };

    const handleDelete = async (issueId) => {
        try {
            const response = await deleteIssueById(issueId);
            setShowModal(true);
            setModalContent({ type: 'success', message: 'Successfully deleted.' });
            setDeleted(true);
        } catch (error) {
            setShowModal(true);
            setModalContent({ type: 'error', message: 'Failed to delete.' });
        }
    };

    const handleUpdateModalClose = (updated) => {
        setShowUpdateModal(false);
        if (updated) {
            setUpdated(true);
        }
    };

    const customRowStyles = {
        cursor: 'pointer',
        '&:hover': {
            '& td': {
                overflowX: 'auto',
            },
        },
    };

    const columns = [
        {
            name: 'Logged By',
            selector: row => row.loggedby,
            sortable: true,
            wrap: true,
            maxWidth: '150px',
        },
        {
            name: 'Logged On',
            selector: row => row.loggedOn,
            sortable: true,
            wrap: true,
            maxWidth: '100px',
        },
        {
            name: 'Issue Category',
            selector: row => row.issuecategory,
            sortable: true,
            wrap: true,
            maxWidth: '150px',
        },
        {
            name: 'Description',
            selector: row => row.description,
            sortable: true,
            wrap: true,
            style: {
                whiteSpace: 'pre-wrap',
                overflowY: 'auto',
                maxHeight: '150px',
                minHeight: '50px',
                padding: '10px',
                marginTop: '0',
                maxWidth: '400px',
            },
            cell: row => <div style={{ maxWidth: '400px' }}>{row.description}</div>,
        },
        {
            name: 'Comments',
            selector: row => row.comments,
            sortable: true,
            wrap: true,
            style: {
                whiteSpace: 'pre-wrap',
                overflowY: 'auto',
                maxHeight: '150px',
                minHeight: '50px',
                padding: '10px',
                marginTop: '0',
                maxWidth: '300px',
            },
            cell: row => <div style={{ maxWidth: '300px' }}>{row.comments}</div>,
        },
        {
            name: 'Fixed By',
            selector: row => row.fixedby,
            sortable: true,
            wrap: true,
            maxWidth: '100px',
        },
        {
            name: 'Issue Status',
            selector: row => row.issuestatus,
            sortable: true,
            wrap: true,
            maxWidth: '100px',
        },
        {
            name: 'Action',
            cell: row => (
                <div>
                    <AiOutlineEdit
                        onClick={() => handleUpdate(row)}
                        style={{ cursor: 'pointer', marginRight: '10px' }}
                        size={30}
                        color="#007bff"
                        title="Edit"
                    />
                    <AiOutlineDelete
                        onClick={() => {
                            if (window.confirm('Are you sure you want to delete?')) {
                                handleDelete(row.issueid);
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
        {
            name: 'Project ID',
            selector: row => row.projectid,
            omit: true,
        },
        {
            name: 'Issue ID',
            selector: row => row.issueid,
            omit: true,
        },
    ];

    return (
        <>
            <DataTable
                title={<div style={{
                    textAlign: 'center', fontWeight: 'bold',
                    background: 'linear-gradient(195.8deg, rgba(11, 116, 176, 0.2) 0%, rgba(117, 73, 156, 0.2) 51%, rgba(189, 56, 97, 0.2) 81%)',
                    color: '#800080', padding: '10px', borderRadius: '5px'
                }}>Issue List</div>}
                columns={columns}
                data={issues}
                pagination
                highlightOnHover
                striped
                onRowDoubleClicked={handleUpdate}
                customStyles={{
                    rows: {
                        style: {
                            '&:nth-of-type(odd)': {
                                backgroundColor: '#f3f3f3',
                            },
                            '&:nth-of-type(even)': {
                                backgroundColor: '#e2e2e2',
                            },
                            ...customRowStyles, // Apply custom row styles
                        },
                    },
                    title: {
                        style: {
                            background: 'transparent',
                            color: '#800080',
                        },
                    },
                }}
            />
            {currentIssue && (
                <UpdateIssueModal
                    show={showUpdateModal}
                    handleClose={handleUpdateModalClose}
                    issueData={currentIssue}
                    onProjectUpdate={() => setUpdated(!updated)}
                />
            )}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Body>
                    {modalContent.type === 'success' ? (
                        <AiOutlineCheckCircle style={{ color: 'green', fontSize: '2rem' }} />
                    ) : (
                        <AiOutlineCloseCircle style={{ color: 'red', fontSize: '2rem' }} />
                    )}
                    <p style={{ textAlign: 'center', marginTop: '1rem' }}>{modalContent.message}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => { setShowModal(false); setDeleted(true); }}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default IssueTable;
