// src/ApiService/FetchingIssueCategory.js
import axiosInstance from "../Utility/axiosInstance";


const FetchingIssueCategory = async () => {
    try {
        const response = await axiosInstance.get(`/BaseUrl/issueDetails/getIssueCategory`);

        return response.data;
    } catch (error) {
        console.error('Error fetching issue categories:', error);
        throw new Error('Failed to fetch issue categories');
    }
};

export default FetchingIssueCategory;