import fs from 'fs'
import fsPromises from 'fs/promises'
import config from './config.js'
import { join, extname } from 'path'

const {
    dir: { __public },
} = config

export class Service {
    createFileStream(filename) {
        return fs.createReadStream(filename)
    }

    async getFileInfo(file) {
        const fullFilePath = join(__public, file)
        await fsPromises.access(fullFilePath)
        const fileType = extname(fullFilePath)
        return {
            type: fileType,
            name: fullFilePath,
        }
    }

    async getFileStream(file) {
        const { type, name } = await this.getFileInfo(file)
        return {
            stream: this.createFileStream(name),
            type,
        }
    }
}
