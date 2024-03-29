import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { RecoilRoot } from 'recoil';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  ApolloLink,
  concat,
} from '@apollo/client';
// import CssBaseline from '@mui/material/CssBaseline';
// import { ThemeProvider } from '@mui/material/styles';
import ThemeConfig from './theme/theme';
import { SpeechSynthesisProvider } from 'hooks/useSpeechSynthesis';
// import { DB_CONNECTION_NAME_STORE } from './constants';

// console.log(window.location)
// const KUBE_API = 'http://mathub-api.kube.local.io'
// const API_URL = window.location.hostname.startsWith('localhost') ? '' : KUBE_API
// const httpLink = new HttpLink({ url: `${API_URL}/graphql` })
const httpLink = new HttpLink({ url: `/graphql` });

const connectionHeaderMiddleware = new ApolloLink((operation, forward) => {
  // add connection name http header before each request
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      // [DB_CONNECTION_NAME_STORE]: localStorage.getItem(DB_CONNECTION_NAME_STORE) || '',
    },
  }));

  return forward(operation);
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(connectionHeaderMiddleware, httpLink),
});

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <ThemeConfig>
        <ApolloProvider client={client}>
          <SpeechSynthesisProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </SpeechSynthesisProvider>
        </ApolloProvider>
      </ThemeConfig>
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
