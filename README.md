# hls

## HLS(Http Live Streaming)
> HLS(HTTP 라이브 스트리밍)은 가장 널리 사용되는 비디오 스트리밍 프로토콜입니다. HTTP "라이브" 스트리밍이라 불리지만 주문형 스트리밍이자 동시에 라이브 스트리밍입니다. HLS는 비디오 파일을 다운로드할 수 있는 HTTP 파일 조각으로 나누고 HTTP 프로토콜을 이용하여 전송합니다. 클라이언트 장치는 이러한 HTTP 파일을 로드한 후 비디오로 재생합니다.

### Hls.js
> Hls.js는 http live streaming을 구현하는 javascript 라이브러리입니다.  
ios/safari 같은 경우 빌트인이 되어있기때문에 지원하지는 않고, 다른 브라우저에서는 Hls.js를 통해서 스트리밍이 가능합니다.

### Hls Error Event
#### 플레이중 인터넷이 오프라인/느릴때 
> 아래와 같이 설정함으로써 retry 시도를 정할 수 있다.
```javascript

/* initHls */
const initHls = () => {
			hls = new Hls({
				autoStartLoad: false,
				backBufferLength: 0,
				//인터넷이 offline일때
				playlistLoadPolicy: {
					default: {
						maxTimeToFirstByteMs: 10000,
						maxLoadTimeMs: 20000,
						timeoutRetry: {
							maxNumRetry: 10,
							retryDelayMs: 1000,
							maxRetryDelayMs: 8000,
						},
						errorRetry: {
							maxNumRetry: 5, //retry 횟수
							retryDelayMs: 1000, // retry 시도 간격
							maxRetryDelayMs: 30000, //retry 시도 최대 시간
						},
					},
				},

			});
			/* Hls.Events.ERROR */
			hls.on(Hls.Events.ERROR, hlsEvent)

			hls.loadSource(videoSrc);
			hls.attachMedia(video);
			hls.startLoad(-1);
}
```

> 다음으로 hls 이벤트 함수와,에러 담당하는 함수를 만들어준다.

```javascript
//hls 이벤트 함수
const hlsEvent = (event, data) => {
			switch (event) {
				case 'hlsError':
					hlsErrorHandle(data)
					break;

				default:
					break;
			}
}

//hls 에러 이벤트 핸들러 함수
const hlsErrorHandle = (data) => {
	const { type, fatal } = data;
	console.log("error data : ", data);
	if (fatal) {
		switch (type) {
			case Hls.ErrorTypes.MEDIA_ERROR:
				//Media 에러 작성 필요
				break;
			case Hls.ErrorTypes.NETWORK_ERROR:
				console.error('fatal network error encountered', data);
				networkError(data)
				break;

			default:
				break;
		}
	}
}

//hls 에러중 네트워크 에러 관리
const networkError = (data) => {
		console.error("error : ", data);
		const { details } = data;
		//파싱 오류로 정상적인 음원이 아니라고 판단
		if (details === Hls.ErrorDetails.MANIFEST_PARSING_ERROR) {
			alert("정상적인 음원이 아닙니다.")
		}
}
```

## Media Session API
> Media Session을 통해 잠금화면시 현재 재생되고 있는 오디오/비디오의 정보 및 컨트롤이 가능하다.

