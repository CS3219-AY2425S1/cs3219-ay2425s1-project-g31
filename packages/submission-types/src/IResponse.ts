export interface IResponse {
    time: string | null
    status: { id: number; description: string }
    stdout: string | null
}
