// Custom hook for centralized settings management
"use client";

import { useState, useEffect } from 'react';

export interface AppSettings {
    // Account Settings
    slippage: string;
    deadline: string;

    // Display Settings
    currency: string;
    theme: string;
    compactMode: boolean;
    reducedMotion: boolean;

    // Notifications
    liquidationAlerts: boolean;
    txNotifications: boolean;
    apyChanges: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
    slippage: "0.5",
    deadline: "20",
    currency: "USD",
    theme: "dark",
    compactMode: false,
    reducedMotion: false,
    liquidationAlerts: true,
    txNotifications: true,
    apyChanges: false,
};

export function useSettings() {
    const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Load from localStorage
        const savedSettings = localStorage.getItem("nexux-settings");
        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings);
                setSettings({ ...DEFAULT_SETTINGS, ...parsed });
            } catch (error) {
                console.error("Failed to parse settings:", error);
            }
        }
        setIsLoaded(true);
    }, []);

    const updateSettings = (newSettings: Partial<AppSettings>) => {
        const updated = { ...settings, ...newSettings };
        setSettings(updated);
        localStorage.setItem("nexux-settings", JSON.stringify(updated));
    };

    return {
        settings,
        updateSettings,
        isLoaded,
    };
}
