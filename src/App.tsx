/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

import GlobalStyle from './styles/global';

export const App: React.FC = () => {
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [isFeedKilled, setIsFeedKilled] = useState(false);

  // Page Visibility detection
  useEffect(() => {
    // Set the name of the hidden property and the change event for visibility
    let hidden = '';
    let visibilityChange = '';

    if (typeof document.hidden !== 'undefined') {
      // Opera 12.10 and Firefox 18 and later support
      hidden = 'hidden';
      visibilityChange = 'visibilitychange';
      // @ts-ignore
    } else if (typeof document.msHidden !== 'undefined') {
      hidden = 'msHidden';
      visibilityChange = 'msvisibilitychange';
      // @ts-ignore
    } else if (typeof document.webkitHidden !== 'undefined') {
      hidden = 'webkitHidden';
      visibilityChange = 'webkitvisibilitychange';
    }

    const handleVisibilityChange = (): void => {
      const isHidden = document.hidden;
      if (isHidden) {
        document.title = 'StockApp Paused';
        setIsPageVisible(false);
      } else {
        document.title = 'StockApp';
        setIsPageVisible(true);
      }
    };

    // Warn if the browser doesn't support addEventListener or the Page Visibility API
    if (typeof document.addEventListener === 'undefined' || hidden === '') {
      console.log(
        'This demo requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.',
      );
    } else {
      // Handle page visibility change
      document.addEventListener(
        visibilityChange,
        handleVisibilityChange,
        false,
      );
    }
  }, []);

  return (
    <div>
      {isPageVisible && (
        <>
          <GlobalStyle />

          <Header />

          <Dashboard isFeedKilled={!isPageVisible || isFeedKilled} />

          <Footer
            isFeedKilled={isFeedKilled}
            setIsFeedKilled={setIsFeedKilled}
          />
        </>
      )}
    </div>
  );
};
