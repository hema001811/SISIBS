const admin = require('firebase-admin');

// Path to your service account key JSON file
const serviceAccount = require('./sisnotification-56d2b-firebase-adminsdk-p8lsw-183066eae8.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const sendNotification = (token, title, body) => {
  const message = {
    notification: {
      title: title,
      body: body,
    },
    token: token,
  };

  admin.messaging().send(message)
    .then((response) => {
      console.log('Notification sent successfully:', response);
    })
    .catch((error) => {
      console.error('Error sending notification:', error);
    });
};

// Example usage
const userToken = 'cndh3eSoTsih-QT_2bxgCi:APA91bH22_Lz5E_W3wPBvz85v6UMkVr_sV-CzfV9iFQesJpGjwUUzvAwEK8mPzBey8IL8Y0HBwAgfdNKMdRAvmlpiX9bKKxKxY_t2Ief1f8VEadGk26T5jgv3k2fL2dLp2fTxx7fHfmd'; // Replace with the recipient's FCM token
sendNotification(userToken, 'Hello!', 'This is a test notification.');
