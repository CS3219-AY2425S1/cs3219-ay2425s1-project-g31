import * as React from 'react'

function PythonIcon(props) {
    return (
        <svg width="20px" height="20px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M296.744 7457.458a.874.874 0 01-.872-.877.873.873 0 111.744 0c0 .485-.39.877-.872.877m-2.672 1.542c5.078 0 4.761-2.214 4.761-2.214l-.006-2.292h-4.845v-.689h6.769s3.249.37 3.249-4.779c0-5.15-2.835-4.968-2.835-4.968h-1.693v2.39s.091 2.85-2.79 2.85h-4.806s-2.7-.043-2.7 2.624v4.41s-.41 2.668 4.896 2.668m-2.815-18.458c.482 0 .871.392.871.877a.872.872 0 11-1.743 0c0-.485.39-.877.872-.877m2.671-1.542c-5.077 0-4.76 2.214-4.76 2.214l.006 2.292h4.845v.689h-6.77s-3.249-.37-3.249 4.779c0 5.15 2.836 4.968 2.836 4.968h1.692v-2.39s-.091-2.85 2.791-2.85h4.805s2.7.043 2.7-2.624v-4.41s.41-2.668-4.896-2.668"
                transform="translate(-340 -7599) translate(56 160)"
                fill={props.fill || '#000'}
                stroke="none"
                strokeWidth={1}
                fillRule="evenodd"
            />
        </svg>
    )
}

export default PythonIcon