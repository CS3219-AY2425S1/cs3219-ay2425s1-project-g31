import React from 'react'

function RightIcon({ color }: { color?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path
                stroke={color || '#000'}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9 5l5.15 5a2.739 2.739 0 010 4L9 19"
            ></path>
        </svg>
    )
}

export default RightIcon
