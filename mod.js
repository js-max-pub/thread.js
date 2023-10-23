

export class Thread {

	constructor(url, base) {
		// this.worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' })
		this.worker = createInlineWorker()
		this.url = new URL(url, base).toString()
	}
	async init() {
		let mod = await import(this.url)
		for (let method in mod)
			this[method] = async (...p) => await this.post(method, ...p)
		return this
	}

	post(...p) {
		const channel = new MessageChannel();
		// we transfer one of its ports to the Worker thread
		this.worker.postMessage([this.url, ...p], [channel.port1]);

		return new Promise((res, rej) => {
			// we listen for a message from the remaining port of our MessageChannel
			channel.port2.onmessage = event => res(event.data[1]);
		});
	}

	terminate() {
		this.worker.terminate()
	}
}




// INLINE WORKER

export function createInlineWorker() { return new Worker(blobURL, { type: 'module' }); }

const blob = new Blob(['self.onmessage = ', onMessage.toString()], { type: 'text/javascript' });
const blobURL = URL.createObjectURL(blob);

async function onMessage(event) {
	let t0 = Date.now()
	let MOD = await import(event.data[0])
	let result = await MOD[event.data[1]](...event.data.slice(2))
	event.ports[0].postMessage([event.data[0], result])
	console.log('[thread.js] post', '(' + event.data[1] + ')', Date.now() - t0, 'ms')
}







// function createInlineWorker() {
// 	// var blob = new Blob(['self.onmessage = ', onMessage.toString()], { type: 'text/javascript' });
// 	// console.log('blob', blob)
// 	// var url = URL.createObjectURL(Thread.blob);
// 	// console.log('url', url)
// 	return new Worker(Thread.blobURL, { type: 'module' });
// }

// class GenericInlineWorker {
// 	static blob = new Blob(['self.onmessage = ', onMessage.toString()], { type: 'text/javascript' });
// 	static blobURL = URL.createObjectURL(GenericInlineWorker.blob);

// 	static create() {
// 		// console.log(GenericInlineWorker.onMessage.toString())
// 		return new Worker(GenericInlineWorker.blobURL, { type: 'module' });
// 	}

// 	static async onMessage(event) {
// 		let t0 = Date.now()
// 		let MOD = await import(event.data[0])
// 		let result = await MOD[event.data[1]](...event.data.slice(2))
// 		event.ports[0].postMessage([event.data[0], result])
// 		console.log('[thread.js] post', '(' + event.data[1] + ')', Date.now() - t0, 'ms')
// 	}
// }





// export function setup(url, base) {
// 	work('thread.js-setup', url, base)
// }

// export function terminate() {
// 	worker.terminate()
// }

// export function work(...p) {
// 	const channel = new MessageChannel();
// 	// we transfer one of its ports to the Worker thread
// 	worker.postMessage(p, [channel.port1]);

// 	return new Promise((res, rej) => {
// 		// we listen for a message from the remaining port of our MessageChannel
// 		channel.port2.onmessage = event => res(event.data[1]);
// 	});
// }

// export default async function (url, base) {
// 	let thread = new Thread(url, base)
// 	return thread
// 	// let 
// }

