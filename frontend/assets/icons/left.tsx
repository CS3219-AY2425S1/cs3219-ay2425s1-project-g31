import React from 'react'

function LeftIcon({ color, className }: { color?: string; className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
            className={className}
        >
            <path
                stroke={color || '#000'}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M15 19l-5.16-5a2.75 2.75 0 010-4L15 5"
            ></path>
        </svg>
    )
}

export default LeftIcon
