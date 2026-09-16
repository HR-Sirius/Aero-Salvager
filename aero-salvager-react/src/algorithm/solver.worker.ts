import { solver } from './solver';

self.onmessage = (event) => {
    console.log('[Worker] 收到主线程消息:', event.data);
    const { balloonType, coordinate } = event.data;
    const result = solver(balloonType, coordinate);
    console.log('[Worker] 计算完成，结果:', result);
    self.postMessage(result);
};