import axios from 'axios';

const client = axios.create({ baseURL: 'https://webhook.site' });

client.interceptors.request.use((config) => {
    console.log(config)
    if (config.method === 'options' || config.method === 'OPTIONS') {
        return new Promise((resolve) => resolve(null));
    }
    return config;
});

export default client;