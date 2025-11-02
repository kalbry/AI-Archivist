import React from 'react';

// Generic SVG Icon Props
type SVGProps = React.SVGProps<SVGSVGElement>;

export const CheckCircleIcon: React.FC<SVGProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

export const ExclamationTriangleIcon: React.FC<SVGProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
);

export const ClockIcon: React.FC<SVGProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

export const XCircleIcon: React.FC<SVGProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

export const SpinnerIcon: React.FC<SVGProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 3a9 9 0 1 0 9 9" />
    </svg>
);

export const JsonIcon: React.FC<SVGProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75 16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
    </svg>
);

export const DocumentIcon: React.FC<SVGProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
);

export const ZipIcon: React.FC<SVGProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 0 1-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 0 0 1.183 1.981l6.478 3.488m8.868-1.442a2.25 2.25 0 0 1 1.183 1.981V18a2.25 2.25 0 0 1-2.25 2.25h-1.5a2.25 2.25 0 0 1-2.25-2.25v-.867c0-.533.226-1.03.624-1.359l6.478-3.488M2.25 9.906l6.478 3.488m13.016 0l-6.478-3.488M2.25 9.906V18a2.25 2.25 0 0 0 2.25 2.25h1.5A2.25 2.25 0 0 0 8.25 18v-.867c0-.533-.226-1.03-.624-1.359L2.25 9.906M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm-3 3.75V12" />
    </svg>
);

export const ArrowRightIcon: React.FC<SVGProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
);

export const ShieldCheckIcon: React.FC<SVGProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" />
    </svg>
);

export const LockClosedIcon: React.FC<SVGProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>
);

export const BookOpenIcon: React.FC<SVGProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
    </svg>
);

export const Cog6ToothIcon: React.FC<SVGProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.003 1.11-1.226.554-.223 1.197-.223 1.75 0 .554.223 1.02.684 1.11 1.226l.094.559a11.352 11.352 0 0 1-4.138 0l.094-.56Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 13 16.118v2.882Zm0 0a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 11 16.118v2.882Zm-2.05-7.05a.75.75 0 0 0 .531-1.281 4.5 4.5 0 0 1 2.52-2.52 .75.75 0 0 0-1.28-.531 6 6 0 0 0-3.36 3.36c-.25.599.035 1.28.53 1.28Z" />
    </svg>
);

export const Squares2X2Icon: React.FC<SVGProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
    </svg>
);

export const CpuChipIcon: React.FC<SVGProps> = (props) => (
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 21v-1.5M15.75 3v1.5m0 16.5v-1.5m3.75-12h-1.5m-15 0h-1.5m15 0h-1.5M12 4.5V3m0 18v-1.5m3.75-15H12m-3.75 0H12m0 15h3.75m-3.75 0H8.25m9.75-12h-1.5m-3.75 0h-1.5m-3.75 0h-1.5m0 0h-1.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);


// Platform Logos
const ChatGPTLogo: React.FC<SVGProps> = (props) => (
    <svg viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M35.213 17.642c0-1.554-.39-3.04-1.115-4.382-1.02-1.89-2.73-3.41-4.757-4.38-2.028-.97-4.267-1.36-6.47-1.11-2.203.25-4.264 1.11-5.996 2.45-1.732 1.34-3.085 3.1-3.921 5.12-.835 2.02-1.12 4.2-.79 6.32.33 2.12.97 4.14 2.23 5.86.68.94 1.48 1.78 2.38 2.5.9.72 1.9 1.32 2.97 1.8.44.2.9.36 1.37.49.47.13.96.22 1.45.27.49.05.98.06 1.47.04.49-.02.98-.08 1.46-.17.48-.1.95-.23 1.42-.4.47-.17.92-.37 1.37-.6.45-.23.88-.5 1.3-.8.42-.3.82-.62 1.2-.98.38-.36.75-.75 1.09-1.16.34-.41.65-.84.94-1.29s.55-1.01.76-1.58c.21-.57.4-1.17.54-1.78.14-.61.23-1.23.27-1.85.04-.62.04-1.24.01-1.86Z" stroke="#fff" strokeWidth="1.5"></path>
        <path d="M21.144 33.914c-1.83 0-3.62-.48-5.188-1.39-1.282-.74-2.4-1.73-3.268-2.9-1.21-1.65-1.9-3.68-1.95-5.8-.05-2.12.56-4.18 1.73-5.92 1.17-1.74 2.85-3.09 4.82-3.88 1.97-.79 4.14-1 6.25-.63 2.11.37 4.02 1.32 5.51 2.73 1.49 1.41 2.5 3.23 2.91 5.2.41 1.97.21 4.04-.58 5.92-.79 1.88-2.15 3.49-3.92 4.6-1.77 1.11-3.87 1.68-6.02 1.63-.03 0-.06.01-.09.01Z" fill="#fff"></path>
    </svg>
);
const ClaudeLogo: React.FC<SVGProps> = (props) => (
    <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M512 0C229.2 0 0 229.2 0 512s229.2 512 512 512 512-229.2 512-512S794.8 0 512 0zm0 947.2C271.7 947.2 76.8 752.3 76.8 512S271.7 76.8 512 76.8s435.2 194.9 435.2 435.2-194.9 435.2-435.2 435.2z" fill="#D95C4D"></path>
        <path d="M682.7 512c0 94.3-76.4 170.7-170.7 170.7s-170.7-76.4-170.7-170.7 76.4-170.7 170.7-170.7c22.5 0 44.1 4.4 64.3 12.5-23-45.9-70.3-78.7-124.9-78.7-77.9 0-141.2 63.2-141.2 141.2s63.2 141.2 141.2 141.2c54.6 0 101.9-32.8 124.9-78.7-20.2 8.1-41.8 12.5-64.3 12.5z" fill="#D95C4D"></path>
    </svg>
);

const GeminiLogo: React.FC<SVGProps> = (props) => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <defs><linearGradient id="a" x1="16.42" x2="8.4" y1="21" y2="3.32" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#A463F2"/><stop offset="1" stopColor="#73A6FF"/></linearGradient><linearGradient id="b" x1="12.39" x2="3.67" y1="12.21" y2="12.32" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#73A6FF"/><stop offset="1" stopColor="#4375FF"/></linearGradient></defs>
        <path fill="url(#a)" d="M12.79 22.92a.8.8 0 0 1-.79-.82v-9.32a.8.8 0 0 1 .42-1.38L21.49 6a.8.8 0 0 1 1.13.7v3.66a3.2 3.2 0 0 1-1.74 2.87L13.16 18.4a3.2 3.2 0 0 0-1.74 2.87v.83a.8.8 0 0 1-.82.82Z"/>
        <path fill="url(#b)" d="M10.39 12.79a.8.8 0 0 1-.41-1.38L18.06.63a.8.8 0 0 1 1.13.7L19.2 5a3.2 3.2 0 0 1-1.74 2.87L9.74 13a3.2 3.2 0 0 0-1.73 2.87l-.01.83a.8.8 0 0 1-1.61 0v-.83a4.8 4.8 0 0 1 2.6-4.3Z"/>
        <path fill="#4375FF" d="M11.21 12.79a.8.8 0 0 1-.82.79H1.08a.8.8 0 0 1-.7-1.13L6 1.68a.8.8 0 0 1 1.38-.42L12 3.82a3.2 3.2 0 0 1 1.16 4.3L7.13 13.6a3.2 3.2 0 0 0-1.16 4.3l.02.03a.8.8 0 0 1-1.13 1.13l-.02-.03a4.8 4.8 0 0 1 1.74-6.45L12 8.32a4.8 4.8 0 0 0-1.74-6.45L8.7.63a.8.8 0 0 1 .7-1.13l10.72 1.54a.8.8 0 0 1 .42 1.38l-7.71 10.37Z"/>
    </svg>
);

export const PLATFORM_LOGOS: Record<string, React.ReactNode> = {
    'chatgpt': <ChatGPTLogo />,
    'claude': <ClaudeLogo />,
    'gemini': <GeminiLogo />,
    'perplexity': <div className="w-full h-full rounded-full bg-black border-2 border-gray-400" />,
    'poe': <div className="w-full h-full rounded-full bg-gray-700 flex items-center justify-center text-white font-bold text-lg">P</div>,
};
