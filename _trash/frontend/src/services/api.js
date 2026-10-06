// Centralized API Service

const BASE_URL = '/api/v1';

// Future: Add logic to retrieve and attach JWT tokens here
const getHeaders = () => {
    return {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${localStorage.getItem('token')}` 
    };
};

export const fetchModes = async () => {
    try {
        const response = await fetch(`${BASE_URL}/dashboard/modes`, { headers: getHeaders() });
        if (!response.ok) throw new Error('Failed to fetch modes');
        return await response.json();
    } catch (error) {
        console.error("Error fetching modes data:", error);
        return [];
    }
};

export const fetchHub = async () => {
    try {
        const response = await fetch(`${BASE_URL}/dashboard/hub`, { headers: getHeaders() });
        if (!response.ok) throw new Error('Failed to fetch hub data');
        return await response.json();
    } catch (error) {
        console.error("Error fetching hub data:", error);
        return null;
    }
};

export const fetchPlayers = async () => {
    try {
        const response = await fetch(`${BASE_URL}/players`, { headers: getHeaders() });
        if (!response.ok) throw new Error('Failed to fetch players');
        return await response.json();
    } catch (error) {
        console.error("Error fetching players data:", error);
        return [];
    }
};
