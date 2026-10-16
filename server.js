const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const cors = require('cors');

// Path to your service account key JSON file
const serviceAccount = require('./sisnotification-56d2b-firebase-adminsdk-p8lsw-183066eae8.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Endpoint to send notifications
app.post('/send-notification', async (req, res) => {
  const { title, body } = req.body;

  if (!title || !body) {
    return res.status(400).json({ error: 'Title and body are required.' });
  }

  const message = {
    notification: {
      title: title,
      body: body,
    },
    topic: 'all',  // Sending notification to all users subscribed to 'all' topic
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Notification sent successfully:', response);
    return res.status(200).json({ message: 'Notification sent successfully!' });
  } catch (error) {
    console.error('Error sending notification:', error);
    return res.status(500).json({ error: 'Error sending notification.' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
