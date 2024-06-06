// src/components/IssueTable.jsx
import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import 'bootstrap/dist/css/bootstrap.min.css';

function IssueTable({ projectId }) {

    const [issues, setIssueList] = useState([]);

    useEffect(() => {
        async function fetchIssueList() {
            try {
                const issuesList = await fetchIssueList();
                setIssueList(issuesList);
            } catch (error) {
                console.error('Error fetching issue issuesList:', error);
            }
        }

        fetchIssueList();
    }, []);


    const columns = [
        {
            name: 'Issue Category',
            selector: 'issue_category',
            sortable: true,
        },
        {
            name: 'Issue Status',
            selector: 'issue_status',
            sortable: true,
        },
        {
            name: 'Description',
            selector: 'description',
            sortable: true,
        },
        {
            name: 'Comments',
            selector: 'comments',
            sortable: true,
        },
        {
            name: 'Fixed By',
            selector: 'fixed_by',
            sortable: true,
        },
        {
            name: 'Logged By',
            selector: 'loggedBy',
            sortable: true,
        },
        {
            name: 'Logged On',
            selector: 'loggedOn',
            sortable: true,
        },
        // Hidden columns
        {
            name: 'Project ID',
            selector: 'projectId',
            omit: true,
        },
        {
            name: 'Issue ID',
            selector: 'issue_id',
            omit: true,
        },
    ];

    return (
        <DataTable
            title="Issue Tracker"
            columns={columns}
            data={issues}
            pagination
            highlightOnHover
            striped
        />
    );
}

export default IssueTable;
