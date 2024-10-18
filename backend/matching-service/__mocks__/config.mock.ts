import { generateKeyPairSync } from 'crypto'

// Generate RSA key pair for testing
const { publicKey, privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
})

export default {
    NODE_ENV: 'test',
    PORT: '8000',
    ACCESS_TOKEN_PUBLIC_KEY: Buffer.from(publicKey).toString('base64'),
    ACCESS_TOKEN_PRIVATE_KEY: Buffer.from(privateKey).toString('base64'),
    RMQ_USER: 'test',
    RMQ_PASSWORD: 'test',
    RMQ_HOST: 'test',
    DB_URL: 'test',
}
