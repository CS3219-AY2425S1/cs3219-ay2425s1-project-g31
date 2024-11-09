import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '../ui/input-otp'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ErrorIconToast } from '@/assets/icons/error-icon'

interface InputFieldProps {
    id: string
    label?: string
    type: string
    placeholder?: string
    icon?: React.ReactNode
    value: string
    error?: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    className?: string
    page?: string
    handleKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

interface OptionsFieldProps {
    id: string
    label?: string
    value: string
    error?: string
    onChange?: (e: string) => void
}

export const InputField = (props: InputFieldProps): JSX.Element => {
    return (
        <div className="w-full">
            {props.label && (
                <label htmlFor={props.id} className="block text-sm font-medium text-gray-700">
                    {props.label}
                </label>
            )}
            <div className="relative">
                <input
                    type={props.type}
                    id={props.id}
                    placeholder={props.placeholder}
                    value={props.value}
                    onChange={props.onChange}
                    className={
                        props.className
                            ? props.className
                            : 'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm'
                    }
                    onKeyDown={props.handleKeyDown}
                />
                {props.icon && (
                    <span
                        className={`absolute right-3 ${props.page?.includes('auth') ? 'top-6' : 'top-5'} transform -translate-y-1/2`}
                    >
                        {props.icon}
                    </span>
                )}
                {props.error ? (
                    <div className="flex flex-row gap-1 h-min mt-1">
                        <div className="flex self-center">
                            <ErrorIconToast />
                        </div>
                        <p className="text-xs text-red-delete">{props.error}</p>
                    </div>
                ) : (
                    <div className="flex flex-row gap-1 h-min mt-1">
                        <p className="text-xs text-red-delete">&nbsp;</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export const OTPField = ({ id, value, error, onChange }: OptionsFieldProps): JSX.Element => {
    return (
        <div>
            <InputOTP id={id} maxLength={6} value={value} onChange={onChange}>
                <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                </InputOTPGroup>
            </InputOTP>
            {error ? (
                <div className="flex flex-row gap-1 h-min mt-1">
                    <ErrorIconToast />
                    <p className="text-xs text-red-delete">{error}</p>
                </div>
            ) : (
                <div className="flex flex-row gap-1 h-min mt-1">
                    <p className="text-xs text-red-delete">&nbsp;</p>
                </div>
            )}
        </div>
    )
}

export const OptionsField = ({ id, label, value, error, onChange }: OptionsFieldProps): JSX.Element => {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
                    <SelectValue placeholder="Select one..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
            {error ? (
                <div className="flex flex-row gap-1 h-min mt-1">
                    <ErrorIconToast />
                    <p className="text-xs text-red-delete">{error}</p>
                </div>
            ) : (
                <div className="flex flex-row gap-1 h-min mt-1">
                    <p className="text-xs text-red-delete">&nbsp;</p>
                </div>
            )}
        </div>
    )
}
