import axios from 'axios';

const Base_url = "http://localhost:8082";

const saveIssue = async (issueData) => {
    try {
        const response = await axios.post(`${Base_url}/issueDetails/submitIssue`, issueData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error while saving issue:', error);
        return error.response;
    }
};

export { saveIssue };
