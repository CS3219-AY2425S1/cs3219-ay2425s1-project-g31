export class ResultModel {
    time?: string
    status?: { id: number; description: string }
    stdout?: string
    stderr?: string
    compile_output?: string
    testIndex?: number
}
