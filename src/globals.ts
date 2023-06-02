type Globals = {
    [key: string]: {
        [key: string]: any
    }
}

import _globals from '@/assets/globals.json'
const globals= _globals as Globals

export default globals