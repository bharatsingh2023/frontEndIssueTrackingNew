import React, { useState, useEffect, useContext } from 'react';
import { fetchTasksByProjectId, updateTaskById } from '../ApiService/TaskApiServices';
import { AiOutlineDelete } from 'react-icons/ai';
import { issueTrackingContext } from './Context';
import { useParams } from 'react-router-dom';

function TaskTable() {
    const { taskSavedStatus, setTaskSavedStatus } = useContext(issueTrackingContext);

    const [tasks, setTasks] = useState([]);
    const [editCell, setEditCell] = useState(null);
    const [editedValues, setEditedValues] = useState({});
    const [rowColors, setRowColors] = useState({});


    const { project_id } = useParams();
    useEffect(() => {

        async function fetchTaskList() {
            try {
                const taskList = await fetchTasksByProjectId(project_id);
                console.log("taskList", taskList);
                setTasks(taskList);
            } catch (error) {
                console.error('Error fetching task list:', error);
            }
        }


        fetchTaskList();

    }, [project_id, taskSavedStatus]);

    const handleDoubleClick = (taskId, field) => {
        setEditCell({ taskId, field });
    };

    const handleInputChange = (taskId, field, value) => {
        if ((field === 'total_estd' || field === 'total_actual') && (value === null || value === '')) {
            console.log("field->", field);
            distributeTotalValue(taskId, field, value);
        }

        if (!/^\d*\.?\d{0,2}$/.test(value)) {
            alert("Maximum 2 digits allowed after the decimal point.");
            return;
        }

        setEditedValues((prev) => ({
            ...prev,
            [taskId]: { ...prev[taskId], [field]: value, }
        }));

        // realtime render in the fields/colour
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.task_id === taskId ? { ...task, [field]: value } : task
            )
        );

        // Check the sum and set row color
        const updatedTask = {
            ...tasks.find(task => task.task_id === taskId),
            ...editedValues[taskId],
            [field]: value
        };
        checkRowSum(updatedTask);
    };

    const checkRowSum = (task) => {
        const parseValue = (value) => {
            return value ? parseFloat(value) || 0 : 0; // Convert string to float or consider null/empty as 0
        };

        // Function to round a number to two decimal places
        const roundToTwoDecimals = (value) => {
            return Math.round(value * 100) / 100;
        };

        // Calculate the sum of estimates and actuals, then round to two decimal places
        const estdSum = roundToTwoDecimals(parseValue(task.analysis_estd) + parseValue(task.design_estd) +
            parseValue(task.development_estd) + parseValue(task.unit_test_estd) +
            parseValue(task.system_testing_estd));

        const actualSum = roundToTwoDecimals(parseValue(task.analysis_actual) + parseValue(task.design_actual) +
            parseValue(task.development_actual) + parseValue(task.unit_test_actual) +
            parseValue(task.system_testing_actual));

        // Compare the rounded sums to the rounded total values
        const estdMatches = estdSum === roundToTwoDecimals(parseValue(task.total_estd));
        const actualMatches = actualSum === roundToTwoDecimals(parseValue(task.total_actual));

        console.log("estdSum:", estdSum, "actualSum:", actualSum);

        // Set the row color based on the match status
        setRowColors(prev => ({
            ...prev,
            [task.task_id]: estdMatches && actualMatches ? 'green' : 'red',
        }));
    };

    const distributeTotalValue = (taskId, field, value) => {
        const distribution = {
            analysis_estd: 0.25,
            analysis_actual: 0.25,
            design_estd: 0.1,
            design_actual: 0.1,
            development_estd: 0.45,
            development_actual: 0.45,
            unit_test_estd: 0.05,
            unit_test_actual: 0.05,
            system_testing_estd: 0.15,
            system_testing_actual: 0.15,
        };
        const updatedValues = {};

        const type = field.split('_')[1];
        Object.keys(distribution).forEach(key => {
            if (key.endsWith(type)) {
                updatedValues[key] = (value * distribution[key]).toFixed(2);
            }
        });

        setEditedValues(prev => ({
            ...prev,
            [taskId]: {
                ...prev[taskId],
                ...updatedValues,
                [`total_${type}`]: value
            }
        }));

        const updatedTask = {
            ...tasks.find(task => task.task_id === taskId),
            ...updatedValues,
            [`total_${type}`]: value
        };

        checkRowSum(updatedTask);
    };



    const handleBlur = async (taskId) => {
        const taskColor = rowColors[taskId];
        if (taskColor === 'red') {
            alert('Please ensure the totals match the sum of individual values before saving.');
            return;
        }

        const updatedTask = {
            ...tasks.find(task => task.task_id === taskId),
            ...editedValues[taskId]
        };
        setEditCell(null);
        const data = {
            taskId: taskId,
            updatedTask: updatedTask,
        }
        try {
            await updateTaskById(data);
            alert('Task updated');
        } catch (error) {
            alert('Failed to update task');
        }
    };

    const handleDelete = async (taskId) => {
        try {
            // Call API to delete the task by taskId
            alert('Task deleted');
        } catch (error) {
            alert('Failed to delete task');
        }
    };



    return (
        <div className="table-wrapper">
            {(
                <table className="table table-bordered table-striped taskTable">
                    <thead>
                        <tr>
                            <th rowSpan="2" style={{ width: '200px', textAlign: 'center' }}>Task Name</th>
                            <th colSpan="2" style={{ textAlign: 'center' }}>Analysis</th>
                            <th colSpan="2" style={{ textAlign: 'center' }}>Design</th>
                            <th colSpan="2" style={{ textAlign: 'center' }}>Development</th>
                            <th colSpan="2" style={{ textAlign: 'center' }}>Unit Test</th>
                            <th colSpan="2" style={{ textAlign: 'center' }}>System Testing</th>
                            <th colSpan="2" style={{ textAlign: 'center' }}>Total</th>
                            <th rowSpan="2" style={{ textAlign: 'center' }}>Action</th>
                        </tr>
                        <tr>
                            <th>Estd</th>
                            <th>Actual</th>
                            <th>Estd</th>
                            <th>Actual</th>
                            <th>Estd</th>
                            <th>Actual</th>
                            <th>Estd</th>
                            <th>Actual</th>
                            <th>Estd</th>
                            <th>Actual</th>
                            <th>Estd</th>
                            <th>Actual</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map(task => (
                            <tr key={task.task_id}>
                                <td style={{ width: '201px' }}>{task.taskname}</td>
                                <td onDoubleClick={() => handleDoubleClick(task.task_id, 'analysis_estd')}>
                                    {editCell?.taskId === task.task_id && editCell?.field === 'analysis_estd' ? (
                                        <input
                                            type="text"
                                            value={editedValues[task.task_id]?.analysis_estd || task.analysis_estd}
                                            onChange={(e) => handleInputChange(task.task_id, 'analysis_estd', e.target.value)}
                                            onBlur={() => handleBlur(task.task_id)}
                                        />
                                    ) : task.analysis_estd}
                                </td>
                                <td onDoubleClick={() => handleDoubleClick(task.task_id, 'analysis_actual')}>
                                    {editCell?.taskId === task.task_id && editCell?.field === 'analysis_actual' ? (
                                        <input
                                            type="text"
                                            value={editedValues[task.task_id]?.analysis_actual || task.analysis_actual}
                                            onChange={(e) => handleInputChange(task.task_id, 'analysis_actual', e.target.value)}
                                            onBlur={() => handleBlur(task.task_id)}
                                        />
                                    ) : task.analysis_actual}
                                </td>
                                <td onDoubleClick={() => handleDoubleClick(task.task_id, 'design_estd')}>
                                    {editCell?.taskId === task.task_id && editCell?.field === 'design_estd' ? (
                                        <input
                                            type="text"
                                            value={editedValues[task.task_id]?.design_estd || task.design_estd}
                                            onChange={(e) => handleInputChange(task.task_id, 'design_estd', e.target.value)}
                                            onBlur={() => handleBlur(task.task_id)}
                                        />
                                    ) : task.design_estd}
                                </td>
                                <td onDoubleClick={() => handleDoubleClick(task.task_id, 'design_actual')}>
                                    {editCell?.taskId === task.task_id && editCell?.field === 'design_actual' ? (
                                        <input
                                            type="text"
                                            value={editedValues[task.task_id]?.design_actual || task.design_actual}
                                            onChange={(e) => handleInputChange(task.task_id, 'design_actual', e.target.value)}
                                            onBlur={() => handleBlur(task.task_id)}
                                        />
                                    ) : task.design_actual}
                                </td>
                                <td onDoubleClick={() => handleDoubleClick(task.task_id, 'development_estd')}>
                                    {editCell?.taskId === task.task_id && editCell?.field === 'development_estd' ? (
                                        <input
                                            type="text"
                                            value={editedValues[task.task_id]?.development_estd || task.development_estd}
                                            onChange={(e) => handleInputChange(task.task_id, 'development_estd', e.target.value)}
                                            onBlur={() => handleBlur(task.task_id)}
                                        />
                                    ) : task.development_estd}
                                </td>
                                <td onDoubleClick={() => handleDoubleClick(task.task_id, 'development_actual')}>
                                    {editCell?.taskId === task.task_id && editCell?.field === 'development_actual' ? (
                                        <input
                                            type="text"
                                            value={editedValues[task.task_id]?.development_actual || task.development_actual}
                                            onChange={(e) => handleInputChange(task.task_id, 'development_actual', e.target.value)}
                                            onBlur={() => handleBlur(task.task_id)}
                                        />
                                    ) : task.development_actual}
                                </td>
                                <td onDoubleClick={() => handleDoubleClick(task.task_id, 'unit_test_estd')}>
                                    {editCell?.taskId === task.task_id && editCell?.field === 'unit_test_estd' ? (
                                        <input
                                            type="text"
                                            value={editedValues[task.task_id]?.unit_test_estd || task.unit_test_estd}
                                            onChange={(e) => handleInputChange(task.task_id, 'unit_test_estd', e.target.value)}
                                            onBlur={() => handleBlur(task.task_id)}
                                        />
                                    ) : task.unit_test_estd}
                                </td>
                                <td onDoubleClick={() => handleDoubleClick(task.task_id, 'unit_test_actual')}>
                                    {editCell?.taskId === task.task_id && editCell?.field === 'unit_test_actual' ? (
                                        <input
                                            type="text"
                                            value={editedValues[task.task_id]?.unit_test_actual || task.unit_test_actual}
                                            onChange={(e) => handleInputChange(task.task_id, 'unit_test_actual', e.target.value)}
                                            onBlur={() => handleBlur(task.task_id)}
                                        />
                                    ) : task.unit_test_actual}
                                </td>
                                <td onDoubleClick={() => handleDoubleClick(task.task_id, 'system_testing_estd')}>
                                    {editCell?.taskId === task.task_id && editCell?.field === 'system_testing_estd' ? (
                                        <input
                                            type="text"
                                            value={editedValues[task.task_id]?.system_testing_estd || task.system_testing_estd}
                                            onChange={(e) => handleInputChange(task.task_id, 'system_testing_estd', e.target.value)}
                                            onBlur={() => handleBlur(task.task_id)}
                                        />
                                    ) : task.system_testing_estd}
                                </td>
                                <td onDoubleClick={() => handleDoubleClick(task.task_id, 'system_testing_actual')}>
                                    {editCell?.taskId === task.task_id && editCell?.field === 'system_testing_actual' ? (
                                        <input
                                            type="text"
                                            value={editedValues[task.task_id]?.system_testing_actual || task.system_testing_actual}
                                            onChange={(e) => handleInputChange(task.task_id, 'system_testing_actual', e.target.value)}
                                            onBlur={() => handleBlur(task.task_id)}
                                        />
                                    ) : task.system_testing_actual}
                                </td>
                                <td onDoubleClick={() => handleDoubleClick(task.task_id, 'total_estd')} style={{ backgroundColor: rowColors[task.task_id], color: rowColors[task.task_id] ? 'white' : 'inherit' }}>
                                    {editCell?.taskId === task.task_id && editCell?.field === 'total_estd' ? (
                                        <input
                                            type="text"
                                            value={editedValues[task.task_id]?.total_estd || task.total_estd}
                                            onChange={(e) => handleInputChange(task.task_id, 'total_estd', e.target.value)}
                                            onBlur={() => handleBlur(task.task_id)}
                                        />
                                    ) : task.total_estd}
                                </td>
                                <td onDoubleClick={() => handleDoubleClick(task.task_id, 'total_actual')} style={{ backgroundColor: rowColors[task.task_id], color: rowColors[task.task_id] ? 'white' : 'inherit' }}>
                                    {editCell?.taskId === task.task_id && editCell?.field === 'total_actual' ? (
                                        <input
                                            type="text"
                                            value={editedValues[task.task_id]?.total_actual || task.total_actual}
                                            onChange={(e) => handleInputChange(task.task_id, 'total_actual', e.target.value)}
                                            onBlur={() => handleBlur(task.task_id)}
                                        />
                                    ) : task.total_actual}
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    <AiOutlineDelete onClick={() => handleDelete(task.task_id)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default TaskTable;
