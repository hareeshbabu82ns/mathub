import { useState, useEffect } from 'react'

interface NotificationState {
  permission: NotificationPermission
  notification: Notification | null
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
            console.log('subscription', subscription)
            setPermission(Notification.permission)
            return
          }
        }
      }
      setPermission('default')
    })()
    setPermission(Notification.permission)
  }, [])

  const setupPushNotifications = async () => {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey:
        'BOuDjCBFEF3G02VOdmXxEW4T9OOEL6kUgGPNI9sH88Rh3_ycxd2JdY4ML2Z43USo67JYfN_-hon2U25yke1aI0M',
    })
    console.log('subscription', subscription)
    // // Send the subscription to your server
    // await fetch('/api/subscribe', {
    //   method: 'POST',
    //   body: JSON.stringify(subscription),
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // })
  }

  const unregister = async () => {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()
    if (subscription) {
      await subscription.unsubscribe()
      console.log('unsubscribed from push notifications')
      // await fetch('/api/unsubscribe', {
      //   method: 'POST',
      //   body: JSON.stringify(subscription),
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      // })
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

  return { permission, notification, register, unregister }
}

// import React, { createContext, useContext, useEffect, useState } from 'react'

// interface NotificationContextType {
//   register: () => void
//   permission: NotificationPermission
//   notification: Notification | null
// }

// const NotificationContext = createContext<NotificationContextType | undefined>(
//   undefined,
// )

// export const NotificationProvider = ({
//   children,
// }: React.PropsWithChildren<object>) => {
//   const [permission, setPermission] = useState(Notification.permission)
//   const [notification, setNotification] = useState<Notification | null>(null)

//   // useEffect(() => {
//   //   setPermission(Notification.permission);
//   // }, []);

//   const register = () => {
//     console.log(Notification.permission)
//     Notification.requestPermission().then((permission) => {
//       console.log(Notification.permission)
//       setPermission(permission)
//       if (permission === 'granted') {
//         // Do something when permission is granted, like subscribing to push notifications
//         setNotification(
//           new Notification('Welcome to the notification center!', {
//             body: 'You will now receive notifications from us.',
//           }),
//         )
//       }
//     })
//   }

//   const value = {
//     register,
//     permission,
//     notification,
//   }

//   return (
//     <NotificationContext.Provider value={value}>
//       {children}
//     </NotificationContext.Provider>
//   )
// }

// export const useNotifications = () => {
//   const context = useContext(NotificationContext)
//   if (context === undefined) {
//     throw new Error(
//       'useNotifications must be used within a NotificationProvider',
//     )
//   }
//   return context
// }
