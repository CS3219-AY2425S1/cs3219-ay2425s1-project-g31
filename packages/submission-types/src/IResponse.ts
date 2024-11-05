export interface IResponse {
    time: string | null
    status: { id: number; description: string }
    stdout: string | null
    stderr: string | null
    compile_output: string | null
}
