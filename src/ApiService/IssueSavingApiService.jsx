import axiosInstance from '../Utility/axiosInstance';

const saveIssue = async (issueData) => {
    try {

        const response = await axiosInstance.post(`/BaseUrl/issueDetails/submitIssue`, issueData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error while saving issue:', error);
        return error.response;
    }
};

export { saveIssue };

