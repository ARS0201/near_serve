let mockBookings = [
  {
    id: 'book_1',
    bookingCode: 'NS20260922001',
    userId: 'user_1',
    providerId: 'prov_1',
    providerName: 'Kumar Plumbing Services',
    providerImage: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&q=80',
    serviceName: 'Pipe Leak Inspection & Repair',
    date: '2026-09-22',
    time: '02:00 PM',
    location: {
      address: 'Plot 12, Green Park Avenue',
      area: 'Gandhipuram',
      city: 'Coimbatore',
      pincode: '641012',
    },
    notes: 'Kitchen sink pipe under the counter is leaking water.',
    status: 'Confirmed',
    timelineStage: 'confirmed',
    serviceCharge: 299,
    additionalCharges: 0,
    totalPrice: 299,
    createdAt: new Date().toISOString(),
  },
];

exports.createBooking = async (req, res) => {
  try {
    const bookingData = req.body;
    const dateDigits = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const bookingCode = `NS${dateDigits}${randomSuffix}`;

    const newBooking = {
      ...bookingData,
      id: 'book_' + Date.now(),
      bookingCode,
      status: 'Pending',
      timelineStage: 'placed',
      createdAt: new Date().toISOString(),
    };

    mockBookings.unshift(newBooking);
    return res.status(201).json(newBooking);
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Failed to create booking.' });
  }
};

exports.getBookings = async (req, res) => {
  return res.json(mockBookings);
};

exports.getBookingById = async (req, res) => {
  const booking = mockBookings.find((b) => b.id === req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found.' });
  return res.json(booking);
};

exports.updateBooking = async (req, res) => {
  const booking = mockBookings.find((b) => b.id === req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found.' });
  Object.assign(booking, req.body);
  return res.json(booking);
};

exports.cancelBooking = async (req, res) => {
  const booking = mockBookings.find((b) => b.id === req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found.' });
  booking.status = 'Cancelled';
  return res.json({ message: 'Booking cancelled successfully.', booking });
};
