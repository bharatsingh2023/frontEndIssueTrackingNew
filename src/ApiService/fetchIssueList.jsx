// src/ApiService/FetchingIssueCategory.js
import axios from 'axios';


const IssueListFetch = async (projectId) => {
    try {
        const response = await axios.get(`/BaseUrl/issueList/${projectId}`);

        return response.data;
    } catch (error) {
        console.error('Error fetching fetchIssueList:', error);
        throw new Error('Failed to fetch IssueList');
    }
};


const updateIssueAPI = async (issueToUpdate) => {
    try {
        const response = await axios.post(`/BaseUrl/issueList/updateIssueList`, issueToUpdate, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error in update Project:', error);
        return error.response;
    }
};


const deleteIssueById = async (issueId) => {
    try {
        console.log("--> delete issue with ID:", issueId);
        const response = await axios.delete(`/BaseUrl/issueList/delete/${issueId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting issue by ID:', error.response || error.message);
        throw new Error('Failed to delete issue by ID');
    }
};


export { IssueListFetch, updateIssueAPI, deleteIssueById };