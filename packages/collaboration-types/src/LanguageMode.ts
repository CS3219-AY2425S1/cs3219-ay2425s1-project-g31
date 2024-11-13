export enum LanguageMode {
    Csharp = 'CSharp',
    Golang = 'Go',
    Javascript = 'Javascript',
    Java = 'Java',
    Python = 'Python',
    Ruby = 'Ruby',
    Typescript = 'Typescript',
}

const languageMapping = {
    [LanguageMode.Csharp]: 'cs',
    [LanguageMode.Golang]: 'go',
    [LanguageMode.Javascript]: 'javascript',
    [LanguageMode.Java]: 'java',
    [LanguageMode.Python]: 'python',
    [LanguageMode.Ruby]: 'ruby',
    [LanguageMode.Typescript]: 'typescript',
}

export function getCodeMirrorLanguage(mode: LanguageMode) {
    return languageMapping[mode]
}
