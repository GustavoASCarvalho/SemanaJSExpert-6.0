import { Service } from './service.js'
import { logger } from './utils.js'

export class Controller {
    constructor() {
        this.service = new Service()
    }

    async getFileStream(fileName) {
        return this.service.getFileStream(fileName)
    }

    async handleCommand({ command }) {
        logger.info(`command recieved: ${command}`)
        const result = {
            result: 'ok',
        }
        const cmd = command.toLowerCase()

        if (cmd.includes('start')) {
            this.service.startStreamming()
            return result
        }

        if (cmd.includes('stop')) {
            this.service.stopStreamming()
            return result
        }
    }

    createClientStream() {
        const { id, clientStream } = this.service.createClientStream()

        const onClose = () => {
            logger.info(`Client stream ${id} closed`)
            this.service.removeClienteStream(id)
        }

        return {
            stream: clientStream,
            onClose,
        }
    }
}
