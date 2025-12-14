// Network icon components with SVG logos
import React from 'react';

interface NetworkIconProps {
    network: string;
    className?: string;
}

export function NetworkIcon({ network, className = "w-6 h-6" }: NetworkIconProps) {
    switch (network) {
        case 'ethereum':
            return (
                <svg className={className} viewBox="0 0 256 417" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
                    <path fill="#343434" d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z" />
                    <path fill="#8C8C8C" d="M127.962 0L0 212.32l127.962 75.639V154.158z" />
                    <path fill="#3C3C3B" d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.6L256 236.587z" />
                    <path fill="#8C8C8C" d="M127.962 416.905v-104.72L0 236.585z" />
                    <path fill="#141414" d="M127.961 287.958l127.96-75.637-127.96-58.162z" />
                    <path fill="#393939" d="M0 212.32l127.96 75.638v-133.8z" />
                </svg>
            );
        case 'avalanche':
            return (
                <svg className={className} viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="128" cy="128" r="128" fill="#E84142" />
                    <path fill="white" d="M145.9 170.1h31.7c5.2 0 7.8 0 9.7-1.3 1.6-1.1 2.8-2.8 3.3-4.8.6-2.3-.2-5.1-1.8-10.7l-47.3-108.8c-1.6-5.6-2.4-8.4-3.9-10.4-1.3-1.7-3-3-5-3.7-2.4-.8-5.2-.8-10.8-.8s-8.4 0-10.8.8c-2 .7-3.7 2-5 3.7-1.5 2-2.3 4.8-3.9 10.4L54.8 153.3c-1.6 5.6-2.4 8.4-1.8 10.7.5 2 1.7 3.7 3.3 4.8 1.9 1.3 4.5 1.3 9.7 1.3h31.7c5.2 0 7.8 0 10.1-.9 2-.8 3.7-2.1 5-3.8 1.5-2 2.2-4.7 3.6-10l1.4-5.3c1.4-5.3 2.1-8 3.6-10 1.3-1.7 3-3 5-3.8 2.3-.9 4.9-.9 10.1-.9h9.8c5.2 0 7.8 0 10.1.9 2 .8 3.7 2.1 5 3.8 1.5 2 2.2 4.7 3.6 10l1.4 5.3c1.4 5.3 2.1 8 3.6 10 1.3 1.7 3 3 5 3.8 2.3.9 4.9.9 10.1.9z" />
                </svg>
            );
        case 'polygon':
            return (
                <svg className={className} viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="128" cy="128" r="128" fill="#8247E5" />
                    <path fill="white" d="M170.5 98.3c-3.5-2-7.8-2-11.3 0l-24.5 14.2-16.4 9.5-24.5 14.2c-3.5 2-7.8 2-11.3 0l-19.5-11.3c-3.5-2-5.7-5.7-5.7-9.7V85.9c0-4 2.2-7.7 5.7-9.7l19.3-11.1c3.5-2 7.8-2 11.3 0l19.3 11.1c3.5 2 5.7 5.7 5.7 9.7v14.2l16.4-9.5V76.4c0-4-2.2-7.7-5.7-9.7L94.1 47.4c-3.5-2-7.8-2-11.3 0L47.4 66.7c-3.5 2-5.7 5.7-5.7 9.7v38.5c0 4 2.2 7.7 5.7 9.7l35.4 20.5c3.5 2 7.8 2 11.3 0l24.5-14 16.4-9.5 24.5-14c3.5-2 7.8-2 11.3 0l19.3 11.1c3.5 2 5.7 5.7 5.7 9.7v29.3c0 4-2.2 7.7-5.7 9.7l-19.1 11.3c-3.5 2-7.8 2-11.3 0l-19.3-11.1c-3.5-2-5.7-5.7-5.7-9.7v-14.2l-16.4 9.5v14.2c0 4 2.2 7.7 5.7 9.7l35.4 20.5c3.5 2 7.8 2 11.3 0l35.4-20.5c3.5-2 5.7-5.7 5.7-9.7V108c0-4-2.2-7.7-5.7-9.7l-35.6-20z" />
                </svg>
            );
        case 'arc':
            return (
                <svg className={className} viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="128" cy="128" r="128" fill="#5D9CDB" />
                    <path fill="white" d="M128 40c-48.6 0-88 39.4-88 88s39.4 88 88 88 88-39.4 88-88-39.4-88-88-88zm0 144c-30.9 0-56-25.1-56-56s25.1-56 56-56 56 25.1 56 56-25.1 56-56 56z" />
                    <circle cx="128" cy="128" r="32" fill="white" />
                </svg>
            );
        case 'arbitrum':
            return (
                <svg className={className} viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="128" cy="128" r="128" fill="#28A0F0" />
                    <path fill="white" d="M180.5 145.3l-15.8-26.2-31.6-52.4c-1.1-1.8-3.1-2.9-5.3-2.9s-4.2 1.1-5.3 2.9l-31.6 52.4-15.8 26.2c-1.1 1.8-1.1 4 0 5.8l47.4 78.6c1.1 1.8 3.1 2.9 5.3 2.9s4.2-1.1 5.3-2.9l47.4-78.6c1.1-1.8 1.1-4 0-5.8zm-52.5 57.9l-31.6-52.4 15.8-26.2 15.8 26.2 15.8 26.2-15.8 26.2z" />
                </svg>
            );
        default:
            return (
                <div className={`${className} rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center`}>
                    <span className="text-xs font-bold">{network[0].toUpperCase()}</span>
                </div>
            );
    }
}
