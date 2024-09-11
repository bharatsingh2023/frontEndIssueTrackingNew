import axios from 'axios';
import axiosInstance from '../Utility/axiosInstance';


const signup = async (signupData) => {
    try {
        const response = await axios.post(`/BaseUrl/userLogin/signup`, signupData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;
    } catch (error) {
        console.error('Error while signup:', error);
        return error.response;
    }
};

const login = async (loginData) => {
    const formData = new FormData();

    for (const key in loginData) {
        formData.append(key, loginData[key]);
    }

    try {
        const response = await axios.post(`/BaseUrl/userLogin/login`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    } catch (error) {
        console.error('Error while login:', error);
        return error.response;
    }

};

const FetchUsers = async () => {
    const userId = localStorage.getItem('userId');
    try {
        const response = await axios.post(`/BaseUrl/userLogin/userList`, userId, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log("response-->", response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error('Failed to fetch users');
    }
};


const Logout = async () => {
    try {
        const responseLogout = await axiosInstance.post(`/BaseUrl/userLogin/logout`);
        console.log("responseLogout--> ", responseLogout);
        return responseLogout;
    } catch (error) {
        console.error('Error responseLogout:', error);
        throw new Error('Failed to logout');
    }
};

const verifyUser = async (username) => {
    try {
        console.log("username-->inside verifyUserapi call ", username);

        const response = await axiosInstance.get(`/BaseUrl/userLogin/verify`, { params: { username } });
        return response;
    } catch (error) {
        return error.response;
    }
};


export { signup, login, FetchUsers, Logout, verifyUser };
