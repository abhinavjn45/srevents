import { useState, useEffect } from 'react';

type VotingPhase = 'BEFORE_START' | 'ACTIVE' | 'ENDED';

export const useCountdown = (startDate: string | Date | null, endDate: string | Date | null) => {
    const [countdown, setCountdown] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        phase: 'ENDED' as VotingPhase
    });

    useEffect(() => {
        if (!endDate) return;

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const start = startDate ? (typeof startDate === 'string' ? new Date(startDate) : startDate).getTime() : 0;
            const end = (typeof endDate === 'string' ? new Date(endDate) : endDate).getTime();

            let targetTime = 0;
            let currentPhase: VotingPhase = 'ENDED';

            if (start > now) {
                targetTime = start;
                currentPhase = 'BEFORE_START';
            } else if (end > now) {
                targetTime = end;
                currentPhase = 'ACTIVE';
            } else {
                currentPhase = 'ENDED';
            }

            if (currentPhase === 'ENDED') {
                setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, phase: 'ENDED' });
                clearInterval(interval);
            } else {
                const diff = targetTime - now;
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                setCountdown({ days, hours, minutes, seconds, phase: currentPhase });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [startDate, endDate]);

    return countdown;
};
