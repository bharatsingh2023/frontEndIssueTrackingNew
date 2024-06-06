import axios from 'axios';

const Base_url = "http://localhost:8081";

const saveProject = async (ProjectData) => {
    try {
        const response = await axios.post(`${Base_url}/addNewProject/addProject`, ProjectData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error in saveProject:', error);
        return error.response;
    }
};



const fetchProjectList = async () => {
    try {
        const response = await axios.get(`${Base_url}/addNewProject/allProjects`);

        return response.data;
    } catch (error) {
        console.error('Error fetchProjectList:', error);
        throw new Error('Failed to fetchProjectList');
    }
};

const fetchProjectById = async (project_id) => {
    try {
        console.log("--> Fetching project with ID:", project_id);
        const response = await axios.get(`/api/addNewProject/${project_id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching project by ID:', error.response || error.message);
        throw new Error('Failed to fetch project by ID');
    }
};



const UpdateProject = async (ProjectData) => {
    try {
        const response = await axios.post(`/api/addNewProject/updateproject`, ProjectData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error in UpdateProject:', error);
        return error.response;
    }
};


const deleteProjectById = async (project_id) => {
    try {
        console.log("--> delete project with ID:", project_id);
        const response = await axios.delete(`/api/addNewProject/projectDelete/${project_id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting project by ID:', error.response || error.message);
        throw new Error('Failed to delete project by ID');
    }
};






export { saveProject, fetchProjectList, fetchProjectById, UpdateProject, deleteProjectById };
