const db = require('../config/db');

// Realistic mock services and categories for the backend API
const mockCategories = [
  { id: 1, name: 'Plumbing', description: 'Pipe repairs, leak fixes & installations' },
  { id: 2, name: 'Electrical', description: 'Wiring, fixtures & safety checks' },
  { id: 3, name: 'Cleaning', description: 'Deep house cleaning, kitchen & bathroom' },
  { id: 4, name: 'AC Repair', description: 'Cooling issues, gas refill & servicing' },
  { id: 5, name: 'Appliance Repair', description: 'Washing machines, fridges & ovens' },
  { id: 6, name: 'Beauty & Salon', description: 'Haircuts, facials, spa & grooming' },
  { id: 7, name: 'Painting', description: 'Interior, exterior & waterproofing' },
  { id: 8, name: 'Vehicle Service', description: 'Car wash, bike tuneup & repairs' },
  { id: 9, name: 'Gardening', description: 'Lawn mowing & plant care' },
  { id: 10, name: 'Computer Repair', description: 'OS setup, hardware & upgrades' },
];

const mockProviders = [
  {
    id: 'prov_1',
    categoryId: 1,
    categoryName: 'Plumbing',
    serviceName: 'Home Plumbing',
    name: 'Kumar Plumbing Services',
    phone: '+91 94432 10987',
    email: 'kumar.plumbing@nearserve.com',
    location: 'Coimbatore',
    rating: 4.8,
    reviewCount: 142,
    startingPrice: 299,
    distanceKm: 1.2,
    availabilityStatus: 'Available Today',
    durationText: '45 - 60 mins',
    serviceArea: 'Gandhipuram, RS Puram & Peelamedu',
    imageUrl: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&q=80',
    bio: 'Certified master plumbers with 10+ years of experience across Coimbatore.',
    servicesOffered: [
      { id: 'srv_1_1', name: 'Pipe Leak Inspection & Repair', price: 299, durationMins: 45, description: 'Pressure test and seal replacement' },
      { id: 'srv_1_2', name: 'Tap & Shower Fitting Replacement', price: 399, durationMins: 60, description: 'Modern fixtures installation' },
    ],
    availableTimeSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '04:00 PM', '06:00 PM'],
    reviews: [
      { id: 'rev_1', userName: 'Priya Sundaram', rating: 5, comment: 'Arrived in 25 mins and fixed our kitchen sink!', date: '2 days ago' },
    ],
  },
  {
    id: 'prov_2',
    categoryId: 4,
    categoryName: 'AC Repair',
    serviceName: 'AC Repair & Service',
    name: 'CoolCare Services',
    phone: '+91 98421 56789',
    email: 'support@coolcare.in',
    location: 'Coimbatore',
    rating: 4.6,
    reviewCount: 98,
    startingPrice: 499,
    distanceKm: 2.1,
    availabilityStatus: 'Available Now',
    durationText: '60 - 90 mins',
    serviceArea: 'Peelamedu, Singanallur & Hopes',
    imageUrl: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&q=80',
    bio: 'HVAC technicians specializing in deep jet power servicing and gas leaks.',
    servicesOffered: [
      { id: 'srv_2_1', name: 'Power Jet AC Servicing', price: 499, durationMins: 60, description: 'Deep chemical foam wash' },
    ],
    availableTimeSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '04:00 PM', '06:00 PM'],
    reviews: [
      { id: 'rev_2', userName: 'Venkatesh S', rating: 5, comment: 'AC is chilling like brand new!', date: '3 days ago' },
    ],
  },
  {
    id: 'prov_3',
    categoryId: 3,
    categoryName: 'Cleaning',
    serviceName: 'Home Cleaning',
    name: 'FreshHome Cleaning',
    phone: '+91 97500 12345',
    email: 'contact@freshhome.in',
    location: 'Coimbatore',
    rating: 4.7,
    reviewCount: 215,
    startingPrice: 399,
    distanceKm: 1.8,
    availabilityStatus: 'Available Today',
    durationText: '90 - 180 mins',
    serviceArea: 'RS Puram, Saibaba Colony & Race Course',
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
    bio: 'Sanitization and deep cleaning using hospital-grade disinfectants.',
    servicesOffered: [
      { id: 'srv_3_1', name: 'Deep Bathroom Sanitization', price: 399, durationMins: 60, description: 'Tile descaling and chrome polish' },
    ],
    availableTimeSlots: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'],
    reviews: [
      { id: 'rev_3', userName: 'Manoj Krishnan', rating: 5, comment: 'Sparkling clean bathroom and kitchen!', date: 'Yesterday' },
    ],
  },
];

exports.getCategories = async (req, res) => {
  return res.json(mockCategories);
};

exports.getServices = async (req, res) => {
  return res.json(mockProviders);
};

exports.getServiceById = async (req, res) => {
  const provider = mockProviders.find((p) => p.id === req.params.id);
  if (!provider) return res.status(404).json({ message: 'Service provider not found.' });
  return res.json(provider);
};

exports.searchServices = async (req, res) => {
  const query = (req.query.q || '').toLowerCase();
  const results = mockProviders.filter(
    (p) =>
      p.name.toLowerCase().includes(query) ||
      p.serviceName.toLowerCase().includes(query) ||
      p.categoryName.toLowerCase().includes(query)
  );
  return res.json(results);
};

exports.filterServices = async (req, res) => {
  const { category, maxDistance, minPrice, maxPrice, minRating, availability, sortBy, search } = req.query;
  let results = [...mockProviders];

  if (search) {
    const q = search.toLowerCase();
    results = results.filter((p) => p.name.toLowerCase().includes(q) || p.serviceName.toLowerCase().includes(q));
  }
  if (category && category !== 'All') {
    results = results.filter((p) => p.categoryName.toLowerCase() === category.toLowerCase());
  }
  if (maxDistance) {
    results = results.filter((p) => p.distanceKm <= Number(maxDistance));
  }
  if (minPrice) {
    results = results.filter((p) => p.startingPrice >= Number(minPrice));
  }
  if (maxPrice) {
    results = results.filter((p) => p.startingPrice <= Number(maxPrice));
  }
  if (minRating) {
    results = results.filter((p) => p.rating >= Number(minRating));
  }
  if (availability) {
    results = results.filter((p) => p.availabilityStatus === availability);
  }

  if (sortBy === 'distance') results.sort((a, b) => a.distanceKm - b.distanceKm);
  else if (sortBy === 'rating') results.sort((a, b) => b.rating - a.rating);
  else if (sortBy === 'price_low_high') results.sort((a, b) => a.startingPrice - b.startingPrice);
  else if (sortBy === 'price_high_low') results.sort((a, b) => b.startingPrice - a.startingPrice);

  return res.json(results);
};
