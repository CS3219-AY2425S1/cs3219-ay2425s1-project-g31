'use client'

export default function Loading() {
    return (
        <div className="flex items-center justify-center">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgb(147 51 234)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={'animate-spin'}
            >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
        </div>
    )
}
