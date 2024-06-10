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
        console.error('Error while saving issue:', error);
        return error.response;
    }
};

export { signup };
