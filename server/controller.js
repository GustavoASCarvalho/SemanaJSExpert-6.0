import { Service } from './service.js'

export class Controller {
    constructor() {
        this.service = new Service()
    }

    async getFileStream(fileName) {
        return this.service.getFileStream(fileName)
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
