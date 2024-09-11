import axiosInstance from '../Utility/axiosInstance';

const saveTask = async (TaskData) => {
    try {

        const response = await axiosInstance.post(`/BaseUrl/TaskHandler/submitTask`, TaskData);
        return response;
    } catch (error) {
        console.error('Error while saving Task:', error);
        return error.response;
    }
};

const fetchTasksByProjectId = async (projectId) => {
    try {
        const response = await axiosInstance.get(`/BaseUrl/TaskHandler/getTasks/${projectId}`);

        return response.data;
    } catch (error) {
        console.error('Error fetching Tasks:', error);
        throw new Error('Failed to fetch Tasks');
    }
};

const updateTaskById = async (TaskData) => {
    try {
        console.log("TaskData ", TaskData);
        const response = await axiosInstance.post(`/BaseUrl/TaskHandler/updateTask`, TaskData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;
    } catch (error) {
        console.error('Error while saving Task:', error);
        return error.response;
    }
};

export { saveTask, fetchTasksByProjectId, updateTaskById };

