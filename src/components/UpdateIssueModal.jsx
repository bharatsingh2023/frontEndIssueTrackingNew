import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import { updateIssueAPI } from '../ApiService/fetchIssueList';
import FetchingIssueCategory from '../ApiService/FetchingIssueCategory';

function UpdateIssueModal({ show, handleClose, issueData, onProjectUpdate }) {
    const [issue_category, setIssueCategory] = useState('');
    const [issue_status, setIssueStatus] = useState('');
    const [description, setDescription] = useState('');
    // const [comments, setComments] = useState('');
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

    useEffect(() => {
        if (issueData) {
            setIssueCategory(issueData.issuecategory);
            setIssueStatus(issueData.issuestatus);
            setDescription(issueData.description);
            // setComments(issueData.comments);
            setFixedBy(issueData.fixedby);
            setIssuePhase(issueData.issue_phase);
            setIssueTaskormodule(issueData.issue_taskormodule);
        }
    }, [issueData]);

    const resetFields = () => {
        setIssueCategory('');
        setIssueStatus('');
        setDescription('');
        // setComments('');
        setFixedBy('');
        setIssuePhase('');
        setIssueTaskormodule('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        const updatedIssueData = {
            ...issueData,
            issuecategory: issue_category,
            issuestatus: issue_status,
            description,
            // comments,
            fixedby: issue_status === 'Fixed' ? fixed_by : '',
            issue_phase,
            issue_taskormodule,

        };

        try {
            const response = await updateIssueAPI(updatedIssueData);
            console.log('Response:', response);
            setSaved(true);
            setTimeout(() => {
                handleClose(true);
                resetFields();
                setSaved(false);
                onProjectUpdate();
            }, 1000);
        } catch (error) {
            console.error('Error updating issue:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleCardClose = () => {
        setSaved(false);
        handleClose(false);
        resetFields();
    };

    if (!issueData) return null;

    return (
        <Modal show={show} onHide={() => handleClose(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Update Issue</Modal.Title>
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

                    {/* <Form.Group className="mb-3" controlId="comments">
                        <Form.Label>Comments</Form.Label>
                        <Form.Control as="textarea" rows={3} value={comments} onChange={(e) => setComments(e.target.value)} />
                    </Form.Group> */}

                    <Button variant="primary" type="submit" disabled={saving}>
                        {saving ? <Spinner animation="border" size="sm" /> : 'Submit'}
                    </Button>
                </Form>
                {saved && (
                    <Card className="text-center" style={{ backgroundColor: '#0a2bcb', color: 'white', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: '999', padding: '20px' }}>
                        <Card.Body>
                            <Card.Title>Issue Updated Successfully!</Card.Title>
                            <Button variant="light" onClick={handleCardClose}>Close</Button>
                        </Card.Body>
                    </Card>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => handleClose(false)}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default UpdateIssueModal;
