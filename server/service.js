import fs from 'fs'
import fsPromises from 'fs/promises'
import streamsPromises from 'stream/promises'
import config from './config.js'
import Throttle from 'throttle'
import childProcess from 'child_process'
import { join, extname } from 'path'
import { randomUUID } from 'crypto'
import { PassThrough, Writable } from 'stream'
import { logger } from './utils.js'
import { once } from 'events'

const {
    dir: { __public },
    constants: { fallbackBitRate, englishConversation, bitRateDivisor },
} = config

export class Service {
    constructor() {
        this.clientStreams = new Map()
        this.currentStream = englishConversation
        this.currentBitRate = 0
        this.throttleTransform = {}
        this.currentReadable = {}
        this.startStreamming()
    }

    createClientStream() {
        const id = randomUUID()
        const clientStream = new PassThrough()
        this.clientStreams.set(id, clientStream)

        return {
            id,
            clientStream,
        }
    }

    removeClienteStream(clientID) {
        this.clientStreams.delete(clientID)
    }

    _executeSoxCommand(args) {
        return childProcess.spawn('sox', args)
    }

    async getBitRage(song) {
        try {
            const args = ['--i', '-B', song]

            const {
                stderr, // error
                stdout, // output
                // stdin, // input
            } = this._executeSoxCommand(args)

            await Promise.all([
                once(stderr, 'readable'),
                once(stdout, 'readable'),
            ])
            const [success, error] = [stdout, stderr].map((stream) =>
                stream.read()
            )
            if (error) return await Promise.reject(error)
            return success.toString().trim().replace(/k/, '000')
        } catch (error) {
            logger.error(`deu ruim no bitrate: ${error}`)
            return fallbackBitRate
        }
    }

    broadCast() {
        return new Writable({
            write: (chunk, encoding, callback) => {
                for (const [id, stream] of this.clientStreams) {
                    if (stream.writableEnded) {
                        this.clientStreams.delete(id)
                        continue
                    }
                    stream.write(chunk)
                }
                callback()
            },
        })
    }

    async startStreamming() {
        logger.info(`starting with ${this.currentStream}`)
        const bitRate = (this.currentBitRate =
            (await this.getBitRage(this.currentStream)) / bitRateDivisor)
        const throttleTransform = (this.throttleTransform = new Throttle(
            bitRate
        ))
        const songReadable = (this.currentReadable = this.createFileStream(
            this.currentStream
        ))
        return streamsPromises.pipeline(
            songReadable,
            throttleTransform,
            this.broadCast()
        )
    }

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
