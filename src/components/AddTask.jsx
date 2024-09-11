import React, { useState, useContext } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import { saveTask } from '../ApiService/TaskApiServices';
import { issueTrackingContext } from './Context';

function AddTask({ show, handleClose, projectId }) {

    const { taskSavedStatus, setTaskSavedStatus } = useContext(issueTrackingContext);
    const fullName = localStorage.getItem('fullName');
    const [logged_by, setLogged_by] = useState(fullName);
    const [task_name, setTaskName] = useState('');
    const [saving, setSaving] = useState(false);
    const [estd_time, setEstdTime] = useState('');
    const [planned_start_date, setPlannedStartDate] = useState('');
    const [planned_end_date, setPlannedEndDate] = useState('');


    const resetFields = () => {
        setLogged_by(fullName);
        setEstdTime('');
        setPlannedStartDate('');
        setPlannedEndDate('');
        setTaskName('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        const taskData = {
            task_logged_by: logged_by,
            project_id: projectId,
            task_name,
            estd_time,
            planned_start_date,
            planned_end_date,

        };
        console.log('Task Request Object:', taskData);
        try {
            const response = await saveTask(taskData);
            console.log('Task Response :', response);
            if (response.status == 200) {
                alert('Task Saved Successfully')
                resetFields();
                handleClose();
                setTaskSavedStatus(!taskSavedStatus);
                setSaving(false);
            } else {
                alert('Task Saved Failed !!');
                setSaving(false)
            }

        } catch (error) {
            console.error('Error saving Task:', error);
            setSaving(false)
        }
    };

    const handlePlannedStartDate = (e) => {
        const selectedDate = e.target.value;
        const today = new Date().toISOString().split("T")[0];
        if (selectedDate < today) {
            alert("You cannot select a past date.");
            setPlannedStartDate(today);
        } else {
            setPlannedStartDate(selectedDate);
        }
    }

    const handlePlannedEndDate = (e) => {
        const selectedDate = e.target.value;
        const today = new Date().toISOString().split("T")[0];
        if (selectedDate < today) {
            alert("You cannot select a past date.");
            setPlannedEndDate(today);
        } else {
            setPlannedEndDate(selectedDate);
        }
    }

    const handleCloseButton = () => { resetFields(); handleClose(); }

    return (
        <Modal show={show} onHide={handleCloseButton}>
            <Modal.Header closeButton>
                <Modal.Title>Add Task</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="task_name">
                        <Form.Label>Task Name</Form.Label>
                        <Form.Control type="text" value={task_name} onChange={(e) => setTaskName(e.target.value)} required />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="estd_time">
                        <Form.Label>Estimated Time</Form.Label>
                        <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                            <Form.Control
                                type="text"
                                value={estd_time}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d*\.?\d*$/.test(value)) {
                                        setEstdTime(value);
                                    }
                                }}
                                style={{ flex: 1, paddingRight: '50px' }}
                            />
                            <span style={{
                                position: 'absolute',
                                right: 0,
                                background: '#adb5bd',
                                border: '1px solid #adb5bd',
                                borderRadius: '0 4px 4px 0',
                                padding: '0 15px',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 1
                            }}>
                                {estd_time === "1" ? "Hr" : "Hrs"}
                            </span>
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="planned_start_date">
                        <Form.Label>Planned Start Date</Form.Label>
                        <Form.Control type="Date" value={planned_start_date} onChange={(e) => { handlePlannedStartDate(e) }}
                            min={new Date().toISOString().split("T")[0]} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="planned_end_date">
                        <Form.Label>Planned End Date</Form.Label>
                        <Form.Control type="Date" value={planned_end_date} onChange={(e) => handlePlannedEndDate(e)}
                            min={new Date().toISOString().split("T")[0]} />
                    </Form.Group>



                    <Button variant="primary" type="submit" disabled={saving}>
                        {saving ? <Spinner animation="border" size="sm" /> : 'Submit'}
                    </Button>
                </Form>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseButton}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AddTask;
