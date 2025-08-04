import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.1.45:8000'; // Replace with your Supabase or production URL (e.g., https://your-supabase-url)

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const storeTokens = async (accessToken, refreshToken) => {
    try {
        await AsyncStorage.setItem('accessToken', accessToken);
        await AsyncStorage.setItem('refreshToken', refreshToken);
    } catch (error) {
        console.error('Error storing tokens:', error);
        throw new Error('Failed to store tokens');
    }
};

const clearTokens = async () => {
    try {
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');
    } catch (error) {
        console.error('Error clearing tokens:', error);
        throw new Error('Failed to clear tokens');
    }
};

const getAccessToken = async () => {
    try {
        return await AsyncStorage.getItem('accessToken');
    } catch (error) {
        console.error('Error retrieving access token:', error);
        return null;
    }
};

const getRefreshToken = async () => {
    try {
        return await AsyncStorage.getItem('refreshToken');
    } catch (error) {
        console.error('Error retrieving refresh token:', error);
        return null;
    }
};

export const register = async (
    username,
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
    currentAddress,
    province,
    city,
    avatarUrl,
    preferredTheme,
    role,
    birthDate
) => {
    try {
        const data = {
            username,
            email,
            password,
            first_name: firstName,
            last_name: lastName,
            role,
        };
        if (phoneNumber) data.phone_number = phoneNumber;
        if (currentAddress) data.current_address = currentAddress;
        if (province) data.province = province;
        if (city) data.city = city;
        if (avatarUrl) data.avatar_url = avatarUrl;
        if (preferredTheme) data.preferred_theme = preferredTheme;
        if (birthDate) data.birth_date = birthDate;

        const response = await api.post('/api/users/register', data);
        const { access, refresh } = response.data;
        await storeTokens(access, refresh);
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Registration failed' };
    }
};

export const login = async (username, password) => {
    try {
        const response = await api.post('/api/users/login', {
            username,
            password
        });
        const { access, refresh } = response.data;
        console.log('Login successful, access token:', access);
        await storeTokens(access, refresh);
        return response.data;
    } catch (error) {
        console.log('Login error:', error);
        throw error.response?.data || { error: 'Login failed' };
    }
};

export const logout = async () => {
    try {
        const accessToken = await getAccessToken();
        const refreshToken = await getRefreshToken();
        if (!accessToken || !refreshToken) {
            console.log('No tokens available for logout');
            await clearTokens(); // Clear any remaining tokens
            return { message: 'Successfully logged out' };
        }
        await api.post(
            '/api/users/logout',
            { refresh: refreshToken },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        await clearTokens();
        return { message: 'Successfully logged out' };
    } catch (error) {
        // Even if logout fails, clear tokens locally
        await clearTokens();
        throw error.response?.data || { error: 'Logout failed' };
    }
};

export const refreshToken = async () => {
    try {
        const refreshToken = await getRefreshToken();
        if (!refreshToken) {
            throw { error: 'No refresh token available' };
        }
        const response = await api.post('/api/token/refresh', {
            refresh: refreshToken,
        });
        const { access } = response.data;
        await AsyncStorage.setItem('accessToken', access);
        console.log('Token refreshed successfully');
        return access;
    } catch (error) {
        console.log('Token refresh failed, clearing tokens');
        await clearTokens();
        throw error.response?.data || { error: 'Token refresh failed' };
    }
};

export const updateProfile = async (profileData) => {
    try {
        const accessToken = await getAccessToken();
        if (!accessToken) {
            throw { error: 'No access token available' };
        }
        const response = await api.patch(
            '/api/users/profile/',
            profileData,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Profile update failed' };
    }
};

export const getProducts = async (page = 1, pageSize = 10) => {
    try {
        const response = await api.get('/api/products', {
            params: {
                page,
                page_size: pageSize,
            },

        });

        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error.response?.data || error.message);
        throw error;
    }
};

export const createOrder = async (orderData) => {
    try {
        const accessToken = await getAccessToken();

        if (!accessToken) {
            throw { error: 'No access token available' };
        }

        const response = await api.post('/api/users/orders/create', orderData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating order:', error.response?.data || error.message);
        throw error.response?.data || { error: 'Failed to create order' };
    }
};

export const getOrders = async (page = 1, pageSize = 3) => {
    try {
        const accessToken = await getAccessToken();

        if (!accessToken) {
            throw { error: 'No access token available' };
        }

        const response = await api.get('/api/users/order/details', {
            params: {
                page,
                page_size: pageSize,
            },

            headers: {
                Authorization: `Bearer ${accessToken}`,
            },

        });
        return response.data;
    } catch (error) {
        console.error('Error fetching orders:', error.response?.data || error.message);
        throw error.response?.data || { error: 'Failed to fetch orders' };
    }
};

// Request interceptor to add token to requests
api.interceptors.request.use(
    async (config) => {
        const accessToken = await getAccessToken();
        if (accessToken && !config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                console.log('Attempting to refresh token...');
                const newAccessToken = await refreshToken();
                if (newAccessToken) {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                console.log('Token refresh failed completely');
                await clearTokens();
                // You might want to trigger a logout event here
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;