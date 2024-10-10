import * as React from 'react'

function GolangIcon(props) {
    return (
        <svg width="20px" height="20px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M4.129 5.548a2.58 2.58 0 102.463 3.355H4.645a.774.774 0 010-1.548h3.17A4.13 4.13 0 0116 8.129a4.13 4.13 0 01-8 1.44 4.13 4.13 0 01-8-1.44 4.129 4.129 0 016.353-3.48.774.774 0 11-.835 1.305 2.565 2.565 0 00-1.389-.406zm7.742 0a2.58 2.58 0 100 5.162 2.58 2.58 0 000-5.162z"
                fill={props.fill || '#000'}
            />
        </svg>
    )
}

export default GolangIcon
