/* eslint-disable no-console */
import React, { useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import { load } from 'protobufjs';

import { Container } from './styles';
import { base64ToArrayBuffer } from '../../utils';

const WSS_FEED_URL = 'wss://streamer.finance.yahoo.com/';

interface DashboardProps {
  isFeedKilled: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ isFeedKilled }) => {
  const { sendMessage, getWebSocket } = useWebSocket(WSS_FEED_URL, {
    onOpen: () => console.log('WebSocket connection opened.'),
    onClose: () => console.log('WebSocket connection closed.'),
    shouldReconnect: () => true,
    onMessage: (event: WebSocketEventMap['message']) => processMessages(event),
  });

  const processMessages = (event: { data: string }): void => {
    console.log('event.data', event.data);
    load('./PricingData.proto', (err, root) => {
      if (err) throw err;

      const pricingMessage = root?.lookupTypeOrEnum('PricingData');

      console.log('event.data', event.data);
      const decoded = pricingMessage?.decode(base64ToArrayBuffer(event.data));
      console.log('decoded', decoded);
    });
  };

  useEffect(() => {
    const connect = (): void => {
      const subscribeMessage = {
        subscribe: [
          'SPY',
          'TSLA',
          'APPL',
          'AMZN',
          'MSFT',
          'META',
          'GOOG',
          'AMD',
          'INTC',
          'NVDA',
        ],
      };
      sendMessage(JSON.stringify(subscribeMessage));
    };

    if (isFeedKilled) {
      getWebSocket()?.close();
    } else {
      connect();
    }
  }, [isFeedKilled, sendMessage, getWebSocket]);

  return <Container>TO-DO</Container>;
};
