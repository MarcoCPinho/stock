/* eslint-disable no-console */
import React, { useCallback, useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { load } from 'protobufjs';
import { Container } from './styles';
import { base64ToArrayBuffer, formatNumber } from '../../utils';
import { STOCKS } from '../../constants';

const WSS_FEED_URL = 'wss://streamer.finance.yahoo.com/';

interface IDashboard {
  isFeedKilled: boolean;
}

interface IPricingData {
  [k: string]: any;
  change?: number;
  changePercent?: number;
  dayVolume?: number;
  currency?: string;
  id?: string;
  price?: number;
  time?: number;
}

export const Dashboard: React.FC<IDashboard> = ({ isFeedKilled }) => {
  const [tableData, setTableData] = useState<IPricingData[]>([]);
  const { sendMessage, getWebSocket } = useWebSocket(WSS_FEED_URL, {
    onOpen: () => console.log('WebSocket connection opened.'),
    onClose: () => console.log('WebSocket connection closed.'),
    shouldReconnect: () => isFeedKilled,
    onMessage: (event: WebSocketEventMap['message']) => processMessages(event),
  });

  const processStock = useCallback(
    (stockData: IPricingData | undefined): void => {
      if (stockData) {
        setTableData(prevState =>
          prevState.length
            ? // update data
              prevState.map(stock =>
                stock.id === stockData.id ? stockData : stock,
              )
            : // create data
              [...prevState, { ...stockData }],
        );
      }
    },
    [],
  );

  const processMessages = useCallback(
    (event: { data: string }): void => {
      // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
      const protoBuf = require('./pricingData.proto');
      load(protoBuf, (err, root) => {
        if (err) throw err;
        const pricingMessage = root?.lookupTypeOrEnum('PricingData');
        const stockData = pricingMessage?.decode(
          base64ToArrayBuffer(event.data),
        );
        if (stockData) {
          const parsedStock = stockData?.toJSON();
          processStock(parsedStock);
        }
      });
    },
    [processStock],
  );

  useEffect(() => {
    const connect = (): void => {
      const subscribeMessage = {
        subscribe: STOCKS,
      };
      sendMessage(JSON.stringify(subscribeMessage));
    };

    if (isFeedKilled) {
      getWebSocket()?.close();
    } else {
      connect();
    }
  }, [getWebSocket, isFeedKilled, processMessages, sendMessage]);

  console.log(tableData);

  return (
    <Container>
      <table cellSpacing={15}>
        <th>
          Live Table
          <tr>
            <td>Exchange</td>
            <td>Price</td>
            <td>Change</td>
            <td>% Change</td>
            <td>Volume</td>
            <td>Timestamp</td>
          </tr>
          {tableData.map(stock => {
            return (
              <tr style={{ border: '1px solid white' }}>
                <td>{stock.id}</td>
                <td>
                  {formatNumber(2, 'currency', stock?.price, stock?.currency)}
                </td>
                <td>{stock.change}</td>
                <td>{formatNumber(4, 'percent', stock.changePercent)}</td>
                <td>{stock.dayVolume}</td>
                <td>
                  {new Date(new Date().setTime(stock.time!)).toUTCString()}
                </td>
              </tr>
            );
          })}
        </th>
      </table>
    </Container>
  );
};
