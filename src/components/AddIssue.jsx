import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import { saveIssue } from '../ApiService/IssueSavingApiService';
import FetchingIssueCategory from '../ApiService/FetchingIssueCategory';

function AddIssue({ show, handleClose, projectId }) {
    const [issue_category, setIssueCategory] = useState('');
    const [issue_status, setIssueStatus] = useState('Open');
    const [description, setDescription] = useState('');
    const [comments, setComments] = useState('');
    const [fixed_by, setFixedBy] = useState('');
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

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
        setDescription('');
        setComments('');
        setFixedBy('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        const issueData = {
            issue_category,
            issue_status,
            description,
            comments,
            projectId,
            fixed_by: issue_status === 'Fixed' ? fixed_by : '',
        };

        try {
            const response = await saveIssue(issueData);
            console.log('Response:', response);
            setSaved(true);
            setTimeout(() => {
                handleClose();
                resetFields();
                setSaved(false); // Reset saved state after 3 seconds
            }, 3000);
        } catch (error) {
            console.error('Error saving issue:', error);
        } finally {
            setSaving(false);
        }
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

                    <Form.Group className="mb-3" controlId="issueStatus">
                        <Form.Label>Issue Status</Form.Label>
                        <Form.Control as="select" value={issue_status} onChange={(e) => setIssueStatus(e.target.value)} required>
                            <option value="Open">Open</option>
                            <option value="Fixed">Fixed</option>
                            <option value="Closed">Closed</option>
                            <option value="ReOpened">Re-Opened</option>
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

                    <Form.Control type="hidden" value={projectId} />

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
