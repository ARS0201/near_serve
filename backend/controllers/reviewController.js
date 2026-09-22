let mockReviews = [];

exports.addReview = (req, res) => {
  const { serviceId, rating, comment } = req.body;
  const newRev = {
    id: Date.now(),
    serviceId,
    rating: Number(rating),
    comment,
    createdAt: new Date(),
  };
  mockReviews.push(newRev);
  return res.status(201).json({ message: 'Review added successfully.', review: newRev });
};

exports.getServiceReviews = (req, res) => {
  const reviews = mockReviews.filter((r) => String(r.serviceId) === String(req.params.id));
  return res.json(reviews);
};
