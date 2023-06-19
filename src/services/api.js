import axios from 'axios';

export default axios.create({
    baseURL: 'http://localhost:8080',  // replace with your base URL
    headers: {
        'Content-type': 'application/json',
    }
});
