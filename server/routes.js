import config from './config.js'
import { logger } from './utils.js'
import { Controller } from './controller.js'
const {
    locations,
    pages: { home, controller },
    constants: { CONTENT_TYPE },
} = config
const controllerInstance = new Controller()

async function routes(request, response) {
    const { method, url } = request

    if (method === 'GET' && url === '/') {
        response.writeHead(302, {
            Location: locations.home,
        })

        return response.end()
    }

    if (method === 'GET' && url === '/home') {
        const { stream } = await controllerInstance.getFileStream(home)

        return stream.pipe(response)
    }

    if (method === 'GET' && url === '/controller') {
        const { stream } = await controllerInstance.getFileStream(controller)

        return stream.pipe(response)
    }

    if (method === 'GET') {
        const { stream, type } = await controllerInstance.getFileStream(url)
        const contentType = CONTENT_TYPE[type]

        if (contentType) {
            response.writeHead(200, {
                'Content-Type': contentType,
            })
        }
        return stream.pipe(response)
    }

    response.writeHead(404) // Not Found
    return response.end()
}

export function handlerError(error, response) {
    if (error.message.includes('ENOENT')) {
        logger.warn(`asset not found ${error.stack}`)
        response.writeHead(404) // Not Found
        return response.end()
    }
    logger.error(`caught error on API ${error.stack}`)
    response.writeHead(500) // Internal Server Error
    return response.end()
}

export function handler(request, response) {
    return routes(request, response).catch((error) =>
        handlerError(error, response)
    )
}
