import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const __root = join(__dirname, '../')
const __audio = join(__root, 'audio')
const __public = join(__root, 'public')
const __songs = join(__audio, 'songs')
const __fx = join(__audio, 'fx')

export default {
    port: process.env.PORT || 3000,
    dir: {
        __root: __root,
        __audio: __audio,
        __public: __public,
        __songs: __songs,
        __fx: __fx,
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
        audioMediaType: 'mp3',
        songVolume: '0.99',
        fallbackBitRate: '128000',
        bitRateDivisor: 8,
        englishConversation: join(__songs, 'conversation.mp3'),
    },
}
