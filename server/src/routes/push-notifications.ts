import express from "express";
import prisma from "../lib/prisma-client";
import webpush from "web-push";

const router = express.Router();

// send public key of subcription
router.get("/vapidPublicKey", async (req, res) => {
  res
    .status(200)
    .json({ publicKey: process.env.PUSH_MSG_VAPID_PUBLIC_KEY || "" });
  // res.status(200).json({ publicKey: process.env.VAPID_PUBLIC_KEY });
});

router.post("/notify", async (req, res) => {
  const { endpoint, topic, content, urlPath = "/" } = req.body;

  const subscriptionRecs = endpoint
    ? await prisma.pushSubscription.findMany({
        where: {
          endpoint,
          topic: topic || "default",
        },
      })
    : await prisma.pushSubscription.findMany({
        where: {
          topic: topic || "default",
        },
      });

  if (!subscriptionRecs.length) {
    res.status(404).json({ message: "no Subscription(s) found." });
    return;
  }

  for (const subscriptionRec of subscriptionRecs) {
    // console.log("subscriptionRec", subscriptionRec);
    const subData = subscriptionRec.data as {
      keys: { p256dh: string; auth: string };
    };
    const subscription = {
      endpoint: subscriptionRec?.endpoint,
      topic: subscriptionRec?.topic,
      keys: {
        p256dh: subData?.keys?.p256dh,
        auth: subData?.keys?.auth,
      },
    };

    const payload = JSON.stringify({
      title: "MathHub",
      body: content || "New Notification",
      icon: "https://mathub.local.terabits.io/pwa-64x64.png",
      image: "https://mathub.local.terabits.io/pwa-192x192.png",
      data: {
        url: `https://mathub.local.terabits.io/${urlPath}`,
      },
    });

    webpush.setVapidDetails(
      "mailto:info@terabits.io",
      process.env.PUSH_MSG_VAPID_PUBLIC_KEY || "",
      process.env.PUSH_MSG_VAPID_PRIVATE_KEY || ""
    );

    try {
      const pushRes = await webpush.sendNotification(subscription, payload);
      // console.log("pushRes", pushRes);
    } catch (err) {
      console.error("Error sending notification, reason: ", err);
      // res.status(500).json({ message: "Error sending notification." });
    }
  }
  res.status(201).json({ message: "Notifications Initiated." });
});

// delete subscription
router.post("/unsubscribe", async (req, res) => {
  const { endpoint } = req.body;
  // console.log("endpoint", req.body);
  await prisma.pushSubscription.deleteMany({
    where: {
      endpoint,
    },
  });
  res.status(200).json({ message: "Subscription deleted." });
});

// Route to save subscription
router.post("/subscribe", async (req, res) => {
  // console.dir(req.body);
  const data = {
    endpoint: req.body?.endpoint,
    topic: req.body?.topic || "default",
    data: req.body,
  };
  // delete old subscription
  await prisma.pushSubscription.deleteMany({
    where: { endpoint: data?.endpoint || "" },
  });
  // save new subscription
  const subscription = await prisma.pushSubscription.create({ data });
  res.status(201).json({ message: "Subscription saved." });
});

// // Function to send notification
// const sendNotification = (subscription) => {
//   const payload = JSON.stringify({
//     title: "New MongoDB record created",
//     body: "A new record has been created in your MongoDB database.",
//   });

//   webpush.setVapidDetails(
//     "mailto:your-email@example.com",
//     "your-public-vapid-key",
//     "your-private-vapid-key"
//   );

//   webpush
//     .sendNotification(subscription, payload)
//     .then(() => console.log("Notification sent successfully."))
//     .catch((err) => console.error("Error sending notification, reason: ", err));
// };

// // Function to watch MongoDB for new records
// const watchMongoDB = () => {
//   const connection = mongoose.connection;
//   const collectionName = "your-collection-name"; // Replace with your collection name

//   const changeStream = connection.collection(collectionName).watch();
//   changeStream.on("change", (change) => {
//     Subscription.find({}, (err, subscriptions) => {
//       if (err) {
//         console.error("Error fetching subscriptions, reason: ", err);
//         return;
//       }

//       subscriptions.forEach(sendNotification);
//     });
//   });
// };

// watchMongoDB();

export default router;
