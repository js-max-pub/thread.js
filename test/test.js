
import { Thread } from '../mod.js'

let thread3 = await new Thread('./test.mod.js', import.meta.url).init()
let result3 = await thread3.abc()
console.log(result3)
thread3.terminate()


