self.addEventListener("message",(event)=>{
	const { interval } =event.data;
	setInterval(() => {
			self.postMessage({
				sendMessage:"hello broswer"
			})
	}, interval);
})