import { useState, useEffect } from 'react';

export const useCountdown = (endDate: string | Date | null) => {
    const [countdown, setCountdown] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isEnded: true
    });

    useEffect(() => {
        if (!endDate) return;

        const interval = setInterval(() => {
            const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
            const now = new Date();
            const diff = end.getTime() - now.getTime();

            if (diff <= 0) {
                setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, isEnded: true });
                clearInterval(interval);
            } else {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                setCountdown({ days, hours, minutes, seconds, isEnded: false });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [endDate]);

    return countdown;
};
