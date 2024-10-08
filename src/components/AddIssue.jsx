import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import { saveIssue } from '../ApiService/IssueSavingApiService';
import FetchingIssueCategory from '../ApiService/FetchingIssueCategory';

function AddIssue({ show, handleClose, projectId, onIssueSave }) {
    const fullName = localStorage.getItem('fullName');
    const [issue_category, setIssueCategory] = useState('');
    const [issue_status, setIssueStatus] = useState('Open');
    const [logged_by, setLogged_by] = useState(fullName);
    const [description, setDescription] = useState('');
    const [comments, setComments] = useState('');
    const [file, setFile] = useState(null);
    const [fixed_by, setFixedBy] = useState('');
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [issue_phase, setIssuePhase] = useState('');
    const [issue_taskormodule, setIssueTaskormodule] = useState('');
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

    const resetFields = () => {
        setIssueCategory('');
        setIssueStatus('Open');
        setLogged_by(fullName);
        setDescription('');
        setComments('');
        setFixedBy('');
        setIssueTaskormodule('');
        setIssuePhase('');
        setFile(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        const issueData = {
            issue_category,
            logged_by,
            issue_status,
            description,
            comments,
            projectId,
            fixed_by: issue_status === 'Fixed' ? fixed_by : '',
            issue_phase,
            issue_taskormodule,
        };

        const formData = new FormData();
        formData.append('issueData', JSON.stringify(issueData));
        if (file) {
            formData.append('image', file);
        }

        try {
            const response = await saveIssue(formData);
            console.log('Response:', response);
            setSaved(true);

            setTimeout(() => {
                handleClose();
                resetFields();
                onIssueSave(true);
                setSaved(false);
            }, 1000);
        } catch (error) {
            console.error('Error saving issue:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleCardClose = () => {
        setSaved(false);
        handleClose();
        resetFields();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add Issue</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="issueCategory">
                        <Form.Label>Issue Category</Form.Label>
                        <Form.Control as="select" value={issue_category} onChange={(e) => setIssueCategory(e.target.value)} required>
                            <option value="">Select Category</option>
                            {categoryOptions.map(option => (
                                <option key={option.category_id} value={option.category_name}>{option.category_name}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="Phase">
                        <Form.Label>Phase</Form.Label>
                        <Form.Control as="select" value={issue_phase} onChange={(e) => setIssuePhase(e.target.value)} required>
                            <option value="">Select Phase</option>
                            <option value="Analysis">Analysis</option>
                            <option value="Design">Design</option>
                            <option value="Development">Development</option>

                        </Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="Task/Module">
                        <Form.Label>Task/Module</Form.Label>
                        <Form.Control as="select" value={issue_taskormodule} onChange={(e) => setIssueTaskormodule(e.target.value)} >
                            <option value="">Select Task/Module</option>

                        </Form.Control>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="issueStatus">
                        <Form.Label>Issue Status</Form.Label>
                        <Form.Control as="select" value={issue_status} onChange={(e) => setIssueStatus(e.target.value)} required>
                            <option value="Open">Open</option>
                            <option value="Fixed">Fixed</option>
                        </Form.Control>
                    </Form.Group>

                    {issue_status === 'Fixed' && (
                        <Form.Group className="mb-3" controlId="fixedBy">
                            <Form.Label>Fixed By</Form.Label>
                            <Form.Control type="text" value={fixed_by} onChange={(e) => setFixedBy(e.target.value)} required />
                        </Form.Group>
                    )}

                    <Form.Group className="mb-3" controlId="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} required />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="comments">
                        <Form.Label>Comments</Form.Label>
                        <Form.Control as="textarea" rows={3} value={comments} onChange={(e) => setComments(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="file">
                        <Form.Label>Image</Form.Label>
                        <Form.Control type="file" onChange={handleFileChange} />
                    </Form.Group>

                    <Button variant="primary" type="submit" disabled={saving}>
                        {saving ? <Spinner animation="border" size="sm" /> : 'Submit'}
                    </Button>
                </Form>
                {saved && (
                    <Card className="text-center" style={{ backgroundColor: '#0a2bcb', color: 'white', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: '999', padding: '20px' }}>
                        <Card.Body>
                            <Card.Title>Issue Saved Successfully!</Card.Title>
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

export default AddIssue;
