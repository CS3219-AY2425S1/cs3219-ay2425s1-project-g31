import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import config from '../common/config.util'
import { SubmissionRequestDto } from '../types/SubmissionRequestDto'
import logger from '../common/logger.util'

class JudgeZero {
    private axiosInstance: AxiosInstance

    constructor(baseURL: string) {
        this.axiosInstance = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json',
            },
        })

        // Request Interceptor
        this.axiosInstance.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                logger.info(`Requesting [${config.method?.toUpperCase()}] ${config.baseURL}${config.url}`)
                return config
            },
            (error) => {
                logger.error(`[Judge-Zero] Failed to send Judge Zero API request: ${error}`)
                return Promise.reject(error)
            }
        )

        // Response Interceptor
        this.axiosInstance.interceptors.response.use(
            (response: AxiosResponse) => response,
            (error) => {
                logger.error(`[Judge-Zero] Error receving Judge Zero API response: ${error}`)
                return Promise.reject(error)
            }
        )
    }

    public async post(url: string, data?: SubmissionRequestDto): Promise<AxiosResponse> {
        const response = await this.axiosInstance.post(url, data)
        return response
    }
}

const judgeZero = new JudgeZero(config.JUDGE_ZERO_URL)

export default judgeZero
