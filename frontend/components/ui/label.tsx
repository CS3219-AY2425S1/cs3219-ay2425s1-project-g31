interface CustomLabelProps {
    title: string
    textColor: string
    bgColor: string
    margin?: string
}

export default function CustomLabel({ title, textColor, bgColor, margin }: CustomLabelProps) {
    return (
        <span
            className={`${textColor} ${bgColor} m-${margin} px-3 py-1 rounded-xl text-center margin-auto capitalize w-fit`}
        >
            {title}
        </span>
    )
}
