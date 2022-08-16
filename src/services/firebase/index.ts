import firebase from 'firebase-admin';
import Config from '../../config';

const { env, firebaseSdk } = Config;

firebase.initializeApp({
    credential: firebase.credential.cert(
      JSON.parse(firebaseSdk),
    ),
});

export class FirebaseNotifications {
  static sendMessage(firebaseToken: any, payload: { notification: { title: string; body: any; badge: any; sound: string; }; data: { notificationType: string; }; }, options: any) {
    firebase.messaging().sendToDevice(firebaseToken, payload, options);
  }

  static sendNotifications(
    messageTitle: string,
    JSONbody: any,
    token: any,
    badge: any,
    options: any,
    data: {[key: string]: any},
  ) {
    if (env !== 'production') {
      messageTitle = `${env} | ${messageTitle}`;
    }
    const payload = {
      notification: {
        title: messageTitle,
        body: JSONbody,
        badge,
        sound: 'default',
      },
      data: {
        notificationType: 'event',
        ...data
      },
    };
    this.sendMessage(token, payload, options);
  }
}
