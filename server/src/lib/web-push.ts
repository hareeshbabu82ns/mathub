import webpush from "web-push";
import crypto from "crypto";

export const generateVAPIDKeys = () => {
  const vapidKeys = webpush.generateVAPIDKeys();

  console.log(vapidKeys.publicKey);
  console.log(vapidKeys.privateKey);
  return vapidKeys;
};
export const generateSampleNotification = () => {
  // raise a push notification with given subscription and payload
  const subscription = {
    endpoint:
      "https://fcm.googleapis.com/fcm/send/fa9D8yDtvAQ:APA91bEOWeh5wTLXaTASzXihbrvAn6YvwGi2l9aW4z9YAtEnq-9_NqwhxlE8wmWd4gNLnvT2zGt2zXpfoV6_nKxd_XT4vkYY1Lxmfa3eiEBkhbJ3bjW_8wRnJ9akwHrwrEB4wJb7805K",
    expirationTime: null,
    keys: {
      p256dh:
        "BMoD_UCWaqaiVNZy_90XVHL95nQFxEM2PP7tyAGOZ2J_1EfCiWugckYn24xhP7m6ywj-PnehMeRZ0fsQvreBHUM",
      auth: "nduLRGgzIPdWGhKTq7C_BA",
    },
  };

  // let pushData = JSON.stringify({
  //   title: "Push title",
  //   body: "Additional text with some description",
  //   icon: "https://andreinwald.github.io/webpush-ios-example/images/favicon.png",
  //   image:
  //     "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Orange_tabby_cat_sitting_on_fallen_leaves-Hisashi-01A.jpg/1920px-Orange_tabby_cat_sitting_on_fallen_leaves-Hisashi-01A.jpg",
  //   data: {
  //     url: "https://andreinwald.github.io/webpush-ios-example/?page=success",
  //     message_id: "your_internal_unique_message_id_for_tracking",
  //   },
  // });

  const payload = JSON.stringify({
    title: "MathHub: New Test Notification",
    body: "New Test is just finished",
    // icon: "http://localhost:9000/pwa-192x192.png",
    icon: "https://andreinwald.github.io/webpush-ios-example/images/favicon.png",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Orange_tabby_cat_sitting_on_fallen_leaves-Hisashi-01A.jpg/1920px-Orange_tabby_cat_sitting_on_fallen_leaves-Hisashi-01A.jpg",
    data: {
      url: "http://localhost:9000/abacus",
    },
  });

  webpush.setVapidDetails(
    "mailto:info@terabits.io",
    process.env.PUSH_MSG_VAPID_PUBLIC_KEY || "",
    process.env.PUSH_MSG_VAPID_PRIVATE_KEY || ""
  );

  webpush
    .sendNotification(subscription, payload)
    .then(() => {
      console.log("Push notification sent successfully");
    })
    .catch((error) => {
      console.error("Error sending push notification:", error);
    });
};
