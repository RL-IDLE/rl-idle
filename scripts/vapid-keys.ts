import webPush from "web-push";

console.log("Generating VAPID keys...");
const vapidKeys = webPush.generateVAPIDKeys();
console.log("VAPID keys generated.");
console.log("Public key: " + vapidKeys.publicKey);
console.log("Private key: " + vapidKeys.privateKey);
