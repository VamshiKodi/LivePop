import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

// Define the shape of the data we expect from the backend
export interface PopulationSnapshot {
    [regionCode: string]: {
        population: number;
        timestamp: number;
    };
}

// Backend URL - explicitly use localhost:4000 for socket connection
const SOCKET_URL = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000/api').replace('/api', '');
console.log('Socket connecting to:', SOCKET_URL);

export const usePopulation = (regionCodes: string[] = ['WORLD']) => {
    const [snapshot, setSnapshot] = useState<PopulationSnapshot>({});
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        // Initialize socket connection with explicit config
        socketRef.current = io(SOCKET_URL, {
            path: '/socket.io/',
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 1000,
            forceNew: true
        });

        const socket = socketRef.current;

        socket.on('connect', () => {
            console.log('Connected to population socket', socket.id);
            setIsConnected(true);

            // Subscribe to requested regions
            socket.emit('subscribe', { regions: regionCodes });
        });

        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            setIsConnected(false);
        });

        socket.on('disconnect', (reason) => {
            console.log('Disconnected from population socket:', reason);
            setIsConnected(false);
        });

        // Handle initial snapshot
        socket.on('snapshot', (data: PopulationSnapshot) => {
            console.log('Received snapshot:', data);
            if (data && Object.keys(data).length > 0) {
                setSnapshot(data);
            }
        });

        // Handle updates
        socket.on('update', (data: PopulationSnapshot) => {
            console.log('Received update:', data);
            if (data && Object.keys(data).length > 0) {
                setSnapshot(prev => ({
                    ...prev,
                    ...data
                }));
            }
        });

        // Cleanup
        return () => {
            if (socket) {
                socket.emit('unsubscribe', { regions: regionCodes });
                socket.disconnect();
            }
        };
    }, [JSON.stringify(regionCodes)]); // Re-run if requested regions change

    return { snapshot, isConnected };
};
