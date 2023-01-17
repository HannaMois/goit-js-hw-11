import axios from 'axios';

export default async function fetchImage(value, page) {
    const BASE_URL = 'https://pixabay.com/api/';
    const API_KEY = '32841517-26afb12f8bbb7df3fa6709fac';
    const searchParams = {
        params: {
        image_type:"photo",
        orientation:"horizontal",
        safesearch:"true",
        per_page: 40,
        },
    };
    
    const filter = `?key=${API_KEY}&q=${value}&${searchParams}&page=${page}`;
    return await axios.get(`${BASE_URL}${filter}`).then(response => response.data);
}