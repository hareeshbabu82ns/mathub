import { useState, useEffect } from 'react'

interface NotificationState {
  permission: NotificationPermission
  notification: Notification | null
  notifyPush: (content: string, topic?: string, urlPath?: string) => void
  register: () => void
  unregister: () => void
}

export const useNotifications = (): NotificationState => {
  const [permission, setPermission] = useState(Notification.permission)
  const [notification, setNotification] = useState<Notification | null>(null)

  useEffect(() => {
    ;(async () => {
      if (
        Notification.permission === 'granted' &&
        'serviceWorker' in navigator
      ) {
        const registration = await navigator.serviceWorker.ready
        if (registration) {
          const subscription = await registration.pushManager.getSubscription()
          if (subscription) {
            // console.log('subscription', subscription)
            setPermission(Notification.permission)
            return
          }
        }
      }
      setPermission('default')
    })()
    setPermission(Notification.permission)
  }, [])

  const unregister = async () => {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()
    if (subscription) {
      await updateUnSubscriptionToServer(subscription)
      await subscription.unsubscribe()
    }
  }

  const register = () => {
    Notification.requestPermission().then((permission) => {
      setPermission(permission)
      if (permission === 'granted') {
        setNotification(
          new Notification('Welcome MathHub Student!', {
            body: 'You will now receive notifications from MathHub.',
          }),
        )
        setupPushNotifications()
      }
    })
  }

  const notifyPush = async (
    content: string,
    topic?: string,
    urlPath?: string,
  ) => {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()
    if (subscription) {
      await notifySubscribers(content, topic, urlPath)
    }
  }

  return { permission, notification, register, unregister, notifyPush }
}

const setupPushNotifications = async () => {
  const registration = await navigator.serviceWorker.ready

  const vapidKeyRes = await fetch('/api/pushNotifications/vapidPublicKey', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const vapidKey = await vapidKeyRes.json()

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: vapidKey.publicKey,
  })
  // console.log('subscription', subscription)
  await updateSubscriptionToServer(subscription)
}
const updateSubscriptionToServer = async (subscription: PushSubscription) => {
  const res = await fetch('/api/pushNotifications/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  // console.log('subscription sent to server', res)
  return res
}
const updateUnSubscriptionToServer = async (subscription: PushSubscription) => {
  const res = await fetch('/api/pushNotifications/unsubscribe', {
    method: 'POST',
    body: JSON.stringify({ endpoint: subscription.endpoint }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  // console.log('subscription deleted from server', res)
  return res
}

const notifySubscribers = async (
  content: string,
  topic: string = 'default',
  urlPath: string = '/',
) => {
  const res = await fetch('/api/pushNotifications/notify', {
    method: 'POST',
    body: JSON.stringify({ content, topic, urlPath }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  // console.log('notified server to update subscribers', res)
  return res
}
