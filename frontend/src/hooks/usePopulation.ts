import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

// Define the shape of the data we expect from the backend
export interface PopulationSnapshot {
    [regionCode: string]: {
        population: number;
        timestamp: number;
    };
}

// Backend URL
const SOCKET_URL = import.meta.env.VITE_BACKEND_URL ?
    import.meta.env.VITE_BACKEND_URL.replace('/api', '') :
    'http://localhost:4000';

export const usePopulation = (regionCodes: string[] = ['WORLD']) => {
    const [snapshot, setSnapshot] = useState<PopulationSnapshot>({});
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        // Initialize socket connection
        socketRef.current = io(SOCKET_URL);

        const socket = socketRef.current;

        socket.on('connect', () => {
            console.log('Connected to population socket');
            setIsConnected(true);

            // Subscribe to requested regions
            socket.emit('subscribe', { regions: regionCodes });
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from population socket');
            setIsConnected(false);
        });

        // Handle initial snapshot
        socket.on('snapshot', (data: PopulationSnapshot) => {
            setSnapshot(data);
        });

        // Handle updates
        socket.on('update', (data: PopulationSnapshot) => {
            setSnapshot(prev => ({
                ...prev,
                ...data
            }));
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
