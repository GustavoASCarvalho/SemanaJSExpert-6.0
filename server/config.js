import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const __root = join(__dirname, '../')
const __audio = join(__root, 'audio')
const __public = join(__root, 'public')

export default {
    port: process.env.PORT || 3000,
    dir: {
        __root: __root,
        __audio: __audio,
        __public: __public,
        __songs: join(__audio, 'songs'),
        __fx: join(__audio, 'fx'),
    },
    pages: {
        home: 'home/index.html',
        controller: 'controller/index.html',
    },
    locations: {
        home: '/home',
    },
    constants: {
        CONTENT_TYPE: {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css',
        },
    },
}
