import axios from 'axios';

const LOGS_SERVICE_URL = process.env.LOGS_SERVICE_URL || 'http://localhost:3004/logs';

export const logEvent = async (service: string, type: string, content: string) => {
    try {
        await axios.post(LOGS_SERVICE_URL, {
            service,
            type,
            content,
            date: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error sending log:', error);
    }
};
