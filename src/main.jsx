import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import GlobalContextProvider from './contexts/GlobalContext.jsx';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN.js';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider locale={viVN}>
      <BrowserRouter>
        <GlobalContextProvider>
          <App />
        </GlobalContextProvider>
      </BrowserRouter>
    </ConfigProvider>
  </React.StrictMode>
);
