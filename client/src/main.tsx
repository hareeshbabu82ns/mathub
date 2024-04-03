import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/theme-provider'
import { BrowserRouter, useNavigate } from 'react-router-dom'
import { RouterProvider } from 'react-aria-components'
import { onError } from '@apollo/client/link/error'
import {
  ApolloProvider,
  ApolloClient,
  HttpLink,
  ApolloLink,
  InMemoryCache,
  concat,
} from '@apollo/client'

import App from './App.tsx'
import './index.css'
import { TooltipProvider } from '@/components/ui/tooltip.tsx'
import { toast } from 'sonner'
import { SpeechSynthesisProvider } from './hooks/useSpeechSynthesis.tsx'

const httpLink = new HttpLink({ uri: '/graphql' })

const connectionHeaderMiddleware = new ApolloLink((operation, forward) => {
  // add connection name http header before each request
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      // authorization: localStorage.getItem('token') || null,
    },
  }))

  return forward(operation)
})

// // format date in the response
// const formatDateLink = new ApolloLink((operation, forward) => {
//   return forward(operation).map(response => {
//     if (response.data.date) {
//       response.data.date = new Date(response.data.date);
//     }
//     return response;
//   });
// });

const errorLink = onError(({ networkError }) => {
  if (networkError?.message) {
    toast.error(networkError.message)
  }
})

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: errorLink.concat(concat(connectionHeaderMiddleware, httpLink)),
})

export const BaseApp = () => {
  const navigate = useNavigate()
  return (
    <ApolloProvider client={client}>
      <SpeechSynthesisProvider>
        <RouterProvider navigate={navigate}>
          <TooltipProvider>
            <App />
          </TooltipProvider>
        </RouterProvider>
      </SpeechSynthesisProvider>
      <Toaster />
    </ApolloProvider>
  )
}

const rootElement = document.getElementById('root')
const root = ReactDOM.createRoot(rootElement!)

root.render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <BaseApp />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
)
