// src/services/notificationService.js
import * as signalR from '@microsoft/signalr';

let connection = null;
let subscribers = [];

const now = () => {
  const n = new Date();
  return {
    date: n.toLocaleDateString('en-GB'),
    time: n.toLocaleTimeString('en-US'),
  };
};

export const initNotificationHub = () => {
  if (connection) return;

  connection = new signalR.HubConnectionBuilder()
    .withUrl('https://bus-finder-sl-a7c6a549fbb1.herokuapp.com/notificationhub', {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets,
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

  const notifyAll = (data) => {
    subscribers.forEach((cb) => cb(data));
  };

  connection.on('BusSOS', (message) => {
    const { date, time } = now();
    notifyAll({
      id: Date.now(),
      type: 'emergency',
      route: 'SOS Alert',
      message,
      date,
      time,
    });
  });

  connection.on('FeedbackReceived', (message) => {
    const { date, time } = now();
    const feedbackText = typeof message === 'string'
      ? message.split(':')[1]?.trim() || message
      : 'Feedback received';
    notifyAll({
      id: Date.now(),
      type: 'feedback',
      subject: feedbackText,
      date,
      time,
    });
  });

  connection.on('ShiftStarted', (message) => {
    const { date, time } = now();
    notifyAll({
      id: Date.now(),
      type: 'starts',
      route: 'Shift Started',
      message,
      date,
      time,
    });
  });

  connection.on('ShiftInterval', (message) => {
    const { date, time } = now();
    notifyAll({
      id: Date.now(),
      type: 'starts',
      route: 'Shift Interval',
      message,
      date,
      time,
    });
  });

  connection.on('ShiftEnded', (message) => {
    const { date, time } = now();
    notifyAll({
      id: Date.now(),
      type: 'ends',
      route: 'Shift Ended',
      message,
      date,
      time,
    });
  });

  connection
    .start()
    .then(() => console.log('✅ Global SignalR connected'))
    .catch((err) => console.error('❌ SignalR failed to connect globally:', err));
};

export const subscribeToNotifications = (callback) => {
  subscribers.push(callback);
};

export const unsubscribeFromNotifications = (callback) => {
  subscribers = subscribers.filter((cb) => cb !== callback);
};
