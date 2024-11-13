import { HTMLInputTypeAttribute, useState } from 'react'
import { EyeOpenIcon, EyeNoneIcon } from '@radix-ui/react-icons'

const usePasswordToggle = (): [HTMLInputTypeAttribute, JSX.Element] => {
    const [visible, setVisibility] = useState(false)

    const Icon = visible ? (
        <EyeNoneIcon onClick={() => setVisibility(!visible)} />
    ) : (
        <EyeOpenIcon onClick={() => setVisibility(!visible)} />
    )

    const InputType = visible ? 'text' : 'password'

    return [InputType, Icon]
}

export default usePasswordToggle
