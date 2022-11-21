/* eslint-disable no-console */
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { load } from 'protobufjs';
import React, { useCallback, useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { STOCKS } from '../../constants';
import { IPricingData } from '../../interfaces';
import { base64ToArrayBuffer } from '../../utils';
import { Container } from './styles';
import { formatObjectSearch } from './utils';

export interface IDashboard {
  isFeedKilled: boolean;
}

const WSS_FEED_URL = 'wss://streamer.finance.yahoo.com/';

export const Dashboard: React.FC<IDashboard> = ({ isFeedKilled }) => {
  const [tableData, setTableData] = useState<IPricingData[]>([]);
  const { sendMessage, getWebSocket } = useWebSocket(WSS_FEED_URL, {
    onOpen: () => console.log('WebSocket connection opened.'),
    onClose: () => console.log('WebSocket connection closed.'),
    shouldReconnect: () => isFeedKilled,
    onMessage: (event: WebSocketEventMap['message']) => processMessages(event),
  });

  const processStock = useCallback(
    (stockData: IPricingData): void => {
      if (stockData) {
        console.log('stockData', stockData);

        if (tableData.find(stock => stock.id === stockData.id)) {
          const clonedTableData = [...tableData];
          const indexStock = clonedTableData.findIndex(
            stock => stock.id === stockData.id,
          );
          clonedTableData[indexStock] = stockData;
          setTableData(clonedTableData);
        } else {
          setTableData(prevState => [...prevState, { ...stockData }]);
        }
      }
    },
    [tableData],
  );

  const processMessages = useCallback(
    (event: { data: string }): void => {
      // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
      const protoBuf = require('./PricingData.proto');
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

  return (
    <Container>
      <DataTable value={formatObjectSearch(tableData)}>
        <Column field="id" header="Exchange" />
        <Column field="price" header="Price" />
        <Column field="change" header="Change" />
        <Column field="changePercent" header="% Change" />
        <Column field="dayVolume" header="Volume" />
        <Column field="time" header="Timestamp" />
      </DataTable>
    </Container>
  );
};
