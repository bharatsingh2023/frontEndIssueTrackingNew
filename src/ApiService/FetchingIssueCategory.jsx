// src/ApiService/FetchingIssueCategory.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8082';

const FetchingIssueCategory = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/issueDetails/getIssueCategory`);

        return response.data;
    } catch (error) {
        console.error('Error fetching issue categories:', error);
        throw new Error('Failed to fetch issue categories');
    }
};

export default FetchingIssueCategory;