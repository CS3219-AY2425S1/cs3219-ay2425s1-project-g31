import { LanguageMode } from '@repo/collaboration-types'

export function mapLanguageToJudge0(language: LanguageMode): number {
    switch (language) {
        case LanguageMode.Csharp:
            return 51
        case LanguageMode.Golang:
            return 60
        case LanguageMode.Java:
            return 62
        case LanguageMode.Javascript:
            return 63
        case LanguageMode.Python:
            return 71
        case LanguageMode.Ruby:
            return 72
        case LanguageMode.Typescript:
            return 74
        default:
            return 63
    }
}
