// src/ApiService/FetchingIssueCategory.js
import axiosInstance from "../Utility/axiosInstance";





const IssueListFetch = async (projectId) => {
    try {
        const response = await axiosInstance.get(`/BaseUrl/issueList/${projectId}`);

        return response.data;
    } catch (error) {
        console.error('Error fetching fetchIssueList:', error);
        throw new Error('Failed to fetch IssueList');
    }
};


const updateIssueAPI = async (issueToUpdate) => {
    try {
        const response = await axiosInstance.post(`/BaseUrl/issueList/updateIssueList`, issueToUpdate, {
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
        const response = await axiosInstance.delete(`/BaseUrl/issueList/delete/${issueId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting issue by ID:', error.response || error.message);
        throw new Error('Failed to delete issue by ID');
    }
};

const updateIssueCommnetsAndImage = async (formData) => {
    try {
        const response = await axiosInstance.post(`/BaseUrl/issueList/updateIssueListCommentsAndImages`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log("response updateIssueCommnetsAndImage --> ", response);
        return response;
    } catch (error) {
        console.error('Error in updateIssueCommnetsAndImage:', error);
        return error.response;
    }
};


const updateEdittedCommnetsAndImage = async (formData) => {
    try {
        const response = await axiosInstance.post(`/BaseUrl/issueList/updateEdittedCommnetsAndImage`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log("response updateEdittedCommnetsAndImage --> ", response);
        return response;
    } catch (error) {
        console.error('Error in updateEdittedCommnetsAndImage:', error);
        return error.response;
    }
};




const deleteComment = async (commentId) => {


    try {
        console.log("--> delete issue with ID:", commentId);
        const response = await axiosInstance.delete(`/BaseUrl/issueList/deleteComment/${commentId}`);
        return response;
    } catch (error) {
        console.error('Error deleting Comment ID:', error.response || error.message);
        throw new Error('Failed to delete Commen by ID');
    }


};



export {
    IssueListFetch, updateIssueAPI, deleteIssueById, updateIssueCommnetsAndImage,
    deleteComment, updateEdittedCommnetsAndImage
};