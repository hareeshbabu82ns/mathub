import {
  cleanupOutdatedCaches,
  precacheAndRoute,
  createHandlerBoundToURL,
} from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'
import { registerRoute, NavigationRoute } from 'workbox-routing'

declare let self: ServiceWorkerGlobalScope

precacheAndRoute(self.__WB_MANIFEST)
cleanupOutdatedCaches()

let allowlist: undefined | RegExp[]
if (import.meta.env.DEV) allowlist = [/^\/$/]

// to allow work offline
registerRoute(
  new NavigationRoute(createHandlerBoundToURL('index.html'), { allowlist }),
)

self.skipWaiting()
clientsClaim()

self.addEventListener('install', () => {
  console.log('Service Worker installed')
})

// custom code

self.onmessage = (e) => {
  const { msg, mode } = e.data
  console.log('Service Worker received message:', msg, mode)
}

interface NotificationData {
  title: string
  body: string
  icon?: string
  image?: string
  data?: Record<string, unknown>
}

const defaultNotificationData: NotificationData = {
  title: 'MathHub',
  body: 'Received a push message.',
  icon: '/favicon.ico',
}
self.addEventListener('push', function (event) {
  // console.log(event.data?.text())
  const data: NotificationData = {
    ...defaultNotificationData,
    ...event.data?.json(),
  }
  // Keep the service worker alive until the notification is created.
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      // image: data?.image,
      data: data?.data,
    }),
  )
})
