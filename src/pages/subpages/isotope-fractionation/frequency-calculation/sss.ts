// importScripts('decimal.js');
import decimal from 'decimal.js';


    
// 监听连接事件。每当一个新的客户端连接到这个 SharedWorker 时，都会触发这个事件。
self.onconnect = function(event: { ports: any[]; }) {
    // event.ports[0] 表示连接过来的端口，我们通过这个端口与连接的客户端通信。
    let port = event.ports[0];
  
    port.onmessage = function(e: { data: string; }) {
      // 当从某个客户端接收到消息时，触发这个事件。
      console.log('SharedWorker 收到消息: ', e.data);
  
      // 处理消息...
      let i = 0;
      let res = 0;
      while(i < 15) {
        const n = decimal.mul(23, 3).div(33).add(1093).pow(i-6);
        console.log(i);
        i++;
        res = n;
      }
      // 这里，我们简单地将接收到的消息发送回去。
      let responseMessage = 'SharedWorker 回应: ' + e.data + res;
      port.postMessage(responseMessage);
    };
  
    // 向连接的客户端发送一条消息，表示连接已经建立。
    port.postMessage('客户端已连接到 SharedWorker');
  };