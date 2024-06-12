import axios from 'axios';



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

export { signup, login };
