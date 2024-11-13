import { promises as fs } from 'fs'
import path from 'path'

export async function getHTMLTemplate(htmlFilePath: string): Promise<string> {
    const filePath = path.join(__dirname, htmlFilePath)
    return await fs.readFile(filePath, 'utf8')
}
