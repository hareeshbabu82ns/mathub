import express from "express";
import routerPushNotifications from "./push-notifications";

const routerApi = express.Router();

routerApi.use("/pushNotifications", routerPushNotifications);

export default routerApi;
