import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import 'bootstrap/dist/css/bootstrap.min.css';
import { IssueListFetch, updateIssueAPI, deleteIssueById } from '../ApiService/fetchIssueList';
import FetchingIssueCategory from '../ApiService/FetchingIssueCategory';
import { Modal, Button } from 'react-bootstrap';
import { AiOutlineCheckCircle, AiOutlineDelete, AiOutlineCloseCircle } from 'react-icons/ai';


function IssueTable({ projectId }) {
    const [issues, setIssueList] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [editing, setEditing] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState({});
    const [updated, setUpdated] = useState(false);
    const [deleted, setDeleted] = useState(false);



    useEffect(() => {
        async function fetchIssueList() {
            try {
                const issuesList = await IssueListFetch(projectId);
                console.log("Fetched issue list:", issuesList);
                setIssueList(issuesList);
            } catch (error) {
                console.error('Error fetching issue list:', error);
            }
        }

        fetchIssueList();
    }, [projectId, updated, deleted]);

    useEffect(() => {
        async function fetchIssueCategories() {
            try {
                const categories = await FetchingIssueCategory();
                setCategoryOptions(categories);
            } catch (error) {
                console.error('Error fetching issue categories:', error);
            }
        }

        fetchIssueCategories();
    }, []);

    const handleUpdate = async (issueId) => {
        const issueToUpdate = issues.find(issue => issue.issueid === issueId);
        try {
            //   console.log('Sending updated issue to backend:', issueToUpdate);
            const response = await updateIssueAPI(issueToUpdate);
            console.log('updated:', response);
            setShowModal(true);
            setModalContent({ type: 'success', message: 'Successfully updated.' });
            setUpdated(true);
        } catch (error) {
            console.error('Error updating issue:', error);
            setShowModal(true);
            setModalContent({ type: 'error', message: 'Failed to update.' });
        }
    };

    // Function to handle delete confirmation
    const handleDelete = async (issueId) => {
        try {
            const response = await deleteIssueById(issueId);
            setShowModal(true);
            setModalContent({ type: 'failure', message: 'Successfully deleted.' });
            setDeleted(true);
        } catch (error) {
            setShowModal(true);
            setModalContent({ type: 'error', message: 'Failed to delete.' });
        }
    };





    const handleCategoryChange = (issueId, newCategory) => {
        setIssueList(prevIssues =>
            prevIssues.map(issue =>
                issue.issueid === issueId ? { ...issue, issuecategory: newCategory } : issue
            )
        );
    };

    const handleStatusChange = (issueId, newStatus) => {
        setIssueList(prevIssues =>
            prevIssues.map(issue =>
                issue.issueid === issueId ? { ...issue, issuestatus: newStatus } : issue
            )
        );
    };

    const handleEdit = (issueId, field, value) => {
        setIssueList(prevIssues =>
            prevIssues.map(issue =>
                issue.issueid === issueId ? { ...issue, [field]: value } : issue
            )
        );
    };

    const handleDoubleClick = (issueId, field) => {
        setEditing({ issueId, field });
    };

    const handleBlur = () => {
        setEditing({});
    };

    const columns = [
        {
            name: 'Logged By',
            selector: row => row.loggedBy,
            sortable: true,
        },
        {
            name: 'Logged On',
            selector: row => row.loggedOn,
            sortable: true,
        },
        {
            name: 'Issue Category',
            selector: row => row.issuecategory,
            sortable: true,
            cell: row => (
                <select
                    value={row.issuecategory}
                    onChange={e => handleCategoryChange(row.issueid, e.target.value)}
                    className="form-select"
                >
                    {categoryOptions.map(category => (
                        <option key={category.category_id} value={category.category_name}>
                            {category.category_name}
                        </option>
                    ))}
                </select>
            ),
        },
        {
            name: 'Description',
            selector: row => row.description,
            sortable: true,
            cell: row => (
                editing.issueId === row.issueid && editing.field === 'description' ? (
                    <input
                        type="text"
                        value={row.description || ''}
                        onChange={e => handleEdit(row.issueid, 'description', e.target.value)}
                        onBlur={handleBlur}
                        autoFocus
                        className="form-control"
                    />
                ) : (
                    <div
                        onDoubleClick={() => handleDoubleClick(row.issueid, 'description')}
                        style={{ maxHeight: '100px', overflowY: 'auto' }}
                    >
                        {row.description || 'N/A'}
                    </div>
                )
            ),
        },
        {
            name: 'Comments',
            selector: row => row.comments,
            sortable: true,
            cell: row => (
                editing.issueId === row.issueid && editing.field === 'comments' ? (
                    <input
                        type="text"
                        value={row.comments || ''}
                        onChange={e => handleEdit(row.issueid, 'comments', e.target.value)}
                        onBlur={handleBlur}
                        autoFocus
                        className="form-control"
                    />
                ) : (
                    <div
                        onDoubleClick={() => handleDoubleClick(row.issueid, 'comments')}
                        style={{ maxHeight: '100px', overflowY: 'auto' }}
                    >
                        {row.comments || 'N/A'}
                    </div>
                )
            ),
        },
        {
            name: 'Fixed By',
            selector: row => row.fixedby,
            sortable: true,
            cell: row => (
                editing.issueId === row.issueid && editing.field === 'fixedby' ? (
                    <input
                        type="text"
                        value={row.fixedby || ''}
                        onChange={e => handleEdit(row.issueid, 'fixedby', e.target.value)}
                        onBlur={handleBlur}
                        autoFocus
                        className="form-control"
                    />
                ) : (
                    <div
                        onDoubleClick={() => handleDoubleClick(row.issueid, 'fixedby')}
                        style={{ maxHeight: '100px', overflowY: 'auto' }}
                    >
                        {row.fixedby || 'N/A'}
                    </div>
                )
            ),
        },
        {
            name: 'Issue Status',
            selector: row => row.issuestatus,
            sortable: true,
            cell: row => (
                <select
                    value={row.issuestatus}
                    onChange={e => handleStatusChange(row.issueid, e.target.value)}
                    className="form-select"
                >
                    <option value="Open">Open</option>
                    <option value="Fixed">Fixed</option>

                </select>
            ),
        },
        {
            name: 'Action',
            cell: row => (
                <div>
                    <AiOutlineCheckCircle
                        onClick={() => handleUpdate(row.issueid)}
                        style={{ marginRight: '10px', cursor: 'pointer' }}
                        size={30}
                        color="#28a745"
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
                    />
                </div>
            ),
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
                title={<div style={{ textAlign: 'center', fontWeight: 'bold', background: 'linear-gradient(195.8deg, rgba(11, 116, 176, 0.2) 0%, rgba(117, 73, 156, 0.2) 51%, rgba(189, 56, 97, 0.2) 81%)', color: '#800080', padding: '10px', borderRadius: '5px' }}>Issue List</div>}
                columns={columns}
                data={issues}
                pagination
                highlightOnHover
                striped
                customStyles={{
                    rows: {
                        style: {
                            '&:nth-of-type(odd)': {
                                backgroundColor: '#f3f3f3',
                            },
                            '&:nth-of-type(even)': {
                                backgroundColor: '#e2e2e2',
                            },
                        },
                    },
                    title: {
                        style: {
                            background: 'transparent', // Keep title background transparent
                            color: '#800080', // Set title text color to purple
                        },
                    },
                }}
            />
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
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    );
}

export default IssueTable;
