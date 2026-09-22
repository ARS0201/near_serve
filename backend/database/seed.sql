-- NearServe Seed Data (MySQL)
USE nearserve;

-- 1. Insert Categories
INSERT INTO service_categories (id, name, description) VALUES
(1, 'Plumbing', 'Pipe repairs, leak fixes, tap installations & drainage'),
(2, 'Electrical', 'Wiring, fixtures, switchboards & safety checks'),
(3, 'Cleaning', 'Deep house cleaning, kitchen, sofa & bathroom'),
(4, 'AC Repair', 'Cooling issues, gas refill, installation & servicing'),
(5, 'Appliance Repair', 'Washing machines, refrigerators, microwaves & ovens'),
(6, 'Beauty & Salon', 'Haircuts, facials, spa, bridal makeup & grooming'),
(7, 'Painting', 'Interior, exterior, waterproofing & wall textures'),
(8, 'Vehicle Service', 'Car wash, bike tuneup, oil change & puncture repair'),
(9, 'Gardening', 'Lawn mowing, pruning, plant care & landscape design'),
(10, 'Computer Repair', 'Laptop repair, OS installation, virus removal & upgrades')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 2. Insert Service Providers
INSERT INTO service_providers (id, name, phone, email, category_id, location, rating, total_reviews, starting_price, description, availability, image_url) VALUES
(1, 'Kumar Plumbing Services', '+91 94432 10987', 'kumar.plumbing@nearserve.com', 1, 'Coimbatore', 4.8, 142, 299.00, 'Certified master plumbers with 10+ years experience in Gandhipuram, RS Puram, and Peelamedu.', 'Available Today', 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&q=80'),
(2, 'CoolCare Services', '+91 98421 56789', 'support@coolcare.in', 4, 'Coimbatore', 4.6, 98, 499.00, 'HVAC technicians specializing in deep jet power servicing and gas leaks in Peelamedu.', 'Available Now', 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&q=80'),
(3, 'FreshHome Cleaning', '+91 97500 12345', 'contact@freshhome.in', 3, 'Coimbatore', 4.7, 215, 399.00, 'Sanitization and deep cleaning using hospital-grade disinfectants in RS Puram.', 'Available Today', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80'),
(4, 'PowerFix Electricals', '+91 98940 76543', 'care@powerfix.in', 2, 'Coimbatore', 4.5, 84, 249.00, 'Licensed contractors for residential wiring, MCBs, inverter setup in Saibaba Colony.', 'Available Today', 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 3. Insert Sample User
INSERT INTO users (id, name, email, phone, password, location) VALUES
(1, 'Amirtha Varshini', 'demo@nearserve.com', '+91 98765 43210', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Coimbatore, Tamil Nadu')
ON DUPLICATE KEY UPDATE name=VALUES(name);
