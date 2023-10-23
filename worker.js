

onmessage = async event => {
	let t0 = Date.now()
	let MOD = await import(event.data[0])
	let result = await MOD[event.data[1]](...event.data.slice(2))
	event.ports[0].postMessage([event.data[0], result])
	console.log('[thread.js] post', '(' + event.data[1] + ')', Date.now() - t0, 'ms')
}













// let MOD


// export async function setup(url, base) {
// 	// console.log('setup', url, base,)
// 	let t0 = Date.now()
// 	url = new URL(url, base).toString()
// 	// console.log('import', url)
// 	MOD = await import(url)
// 	console.log('[thread.js] module:', url, 'methods:', Object.keys(MOD), '..', Date.now() - t0)
// }


// onmessage = async event => {
// 	// console.log('deno',Deno)
// 	// console.log('[thread.js] action:', event.data[0], 'ports:', event.ports.length)
// 	let result
// 	if (event.data[0] == 'thread.js-setup')
// 		result = await setup(...event.data.slice(1))
// 	else
// 		result = MOD[event.data[0]](...event.data.slice(1))

// 	if (event.ports.length)
// 		event.ports[0].postMessage([event.data[0], result])
// 	else
// 		postMessage([event.data[0], result])
// }
