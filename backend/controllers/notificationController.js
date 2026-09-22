let mockNotifications = [
  {
    id: 'notif_1',
    userId: 'user_1',
    title: 'Booking Confirmed! 🎉',
    message: 'Your Home Plumbing booking with Kumar Plumbing Services has been confirmed for today at 02:00 PM.',
    timeAgo: '10 mins ago',
    isRead: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'notif_2',
    userId: 'user_1',
    title: 'Provider Assigned 👨‍🔧',
    message: 'Technician Kumar has been assigned to your service request #NS20260922001.',
    timeAgo: '1 hour ago',
    isRead: false,
    createdAt: new Date().toISOString(),
  },
];

exports.getNotifications = (req, res) => {
  return res.json(mockNotifications);
};

exports.markAsRead = (req, res) => {
  const notif = mockNotifications.find((n) => n.id === req.params.id);
  if (notif) notif.isRead = true;
  return res.json({ message: 'Marked as read.' });
};
