-- Create database if not exists
CREATE DATABASE IF NOT EXISTS eventsphere_db;
USE eventsphere_db;

-- Create events table first (needed for foreign key)
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) DEFAULT 0.00,
    maxAttendees INT DEFAULT 100,
    imageUrl VARCHAR(500),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample events
INSERT INTO events (title, description, date, time, location, category, price, maxAttendees, imageUrl)
VALUES
    ('Summer Music Festival', 'A vibrant outdoor music festival featuring local and international artists across multiple genres.', '2025-07-15', '18:00:00', 'Central Park, New York', 'Music', 799.00, 500, '../assets/images/music festival.jpg'),
    ('Tech Innovation Conference', 'Join industry leaders and innovators for a day of tech talks, networking, and product showcases.', '2025-08-20', '09:00:00', 'Convention Center, San Francisco', 'Technology', 1200.00, 300, '../assets/images/techfest.jpg'),
    ('Cultural Arts Exhibition', 'Explore diverse cultural expressions through art, music, dance, and traditional crafts.', '2025-09-10', '10:00:00', 'Art Museum, Chicago', 'Cultural', 499.00, 200, '../assets/images/art.jpg'),
    ('Family Fun Fair', 'A delightful family event with games, rides, food stalls, and entertainment for all ages.', '2025-10-05', '12:00:00', 'City Fairgrounds, Los Angeles', 'Family', 299.00, 1000, '../assets/images/fun fair.jpg'),
    ('Corporate Leadership Summit', 'Professional development event focused on leadership skills and business strategy.', '2025-11-12', '08:30:00', 'Business Center, Houston', 'Corporate', 2500.00, 150, '../assets/images/corporate.jpg')
ON DUPLICATE KEY UPDATE id=id;

-- Create event_registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    eventId INT NOT NULL,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    message TEXT,
    registrationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (eventId) REFERENCES events(id) ON DELETE CASCADE
);

-- Create feedbacks table
CREATE TABLE IF NOT EXISTS feedbacks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(255),
    rating INT,
    message TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert dummy EVENT REGISTRATIONS (This is what customers submit from modals)
INSERT INTO event_registrations (eventId, firstName, lastName, email, phone, message, registrationDate) VALUES
    (1, 'Rahul', 'Sharma', 'rahul.sharma@gmail.com', '+91-9876543210', 'Looking forward to the music festival! Please reserve front row seats.', '2025-01-15 10:30:00'),
    (1, 'Priya', 'Patel', 'priya.patel@yahoo.com', '+91-9876543211', 'Excited for this event. Will there be parking available?', '2025-01-16 14:20:00'),
    (2, 'Amit', 'Kumar', 'amit.k@techcorp.com', '+91-9876543212', 'Attending with my team. Need 5 seats together.', '2025-01-17 09:15:00'),
    (2, 'Sneha', 'Reddy', 'sneha.reddy@gmail.com', '+91-9876543213', 'First time attending. Very excited!', '2025-01-18 11:45:00'),
    (3, 'Vikram', 'Singh', 'vikram.singh@outlook.com', '+91-9876543214', 'Interested in the art workshop. Is registration included?', '2025-01-19 16:30:00'),
    (3, 'Anjali', 'Mehta', 'anjali.mehta@gmail.com', '+91-9876543215', 'Can I bring my camera for photography?', '2025-01-20 13:00:00'),
    (4, 'Rohan', 'Gupta', 'rohan.g@gmail.com', '+91-9876543216', 'Coming with family of 4 (2 adults, 2 kids). Any discounts?', '2025-01-21 10:00:00'),
    (4, 'Neha', 'Joshi', 'neha.joshi@yahoo.com', '+91-9876543217', 'Looking for food stall information. Any vegan options?', '2025-01-22 15:45:00'),
    (5, 'Karan', 'Verma', 'karan.verma@business.com', '+91-9876543218', 'Registering on behalf of our company. Invoice needed.', '2025-01-23 09:30:00'),
    (5, 'Divya', 'Kapoor', 'divya.kapoor@corp.in', '+91-9876543219', 'Interested in networking session. What time does it start?', '2025-01-24 12:15:00'),
    (1, 'Arjun', 'Nair', 'arjun.nair@gmail.com', '+91-9876543220', 'Can I get VIP passes? Willing to pay extra.', '2025-01-25 17:00:00'),
    (2, 'Sakshi', 'Desai', 'sakshi.d@techstart.com', '+91-9876543221', 'Are there any workshops for beginners?', '2025-01-26 11:20:00'),
    (3, 'Aditya', 'Rao', 'aditya.rao@gmail.com', '+91-9876543222', 'Interested in buying artwork. Will artists be present?', '2025-01-27 14:30:00'),
    (4, 'Pooja', 'Iyer', 'pooja.iyer@yahoo.com', '+91-9876543223', 'Kids age 5 and 7. Are there age restrictions?', '2025-01-28 10:45:00'),
    (1, 'Manish', 'Pandey', 'manish.p@gmail.com', '+91-9876543224', 'Group booking for 10 people. Please confirm availability.', '2025-01-29 16:00:00');

-- Insert dummy FEEDBACKS (This is what customers submit from review form)
INSERT INTO feedbacks (name, email, rating, message, createdAt) VALUES
    ('Rajesh Kumar', 'rajesh.k@gmail.com', 5, 'Excellent event management! Everything was so well organized. Will definitely recommend EventSphere to others.', '2025-01-10 18:30:00'),
    ('Meera Shah', 'meera.shah@yahoo.com', 5, 'Amazing experience! The booking process was smooth and the event was fantastic. Thank you EventSphere!', '2025-01-11 20:15:00'),
    ('Suresh Nair', 'suresh.nair@outlook.com', 4, 'Great platform for event booking. Only suggestion is to add more payment options.', '2025-01-12 19:45:00'),
    ('Kavita Deshmukh', 'kavita.d@gmail.com', 5, 'Best event booking platform I have used! Customer support was very helpful.', '2025-01-13 21:00:00'),
    ('Deepak Jain', 'deepak.jain@gmail.com', 4, 'Good service overall. The dashboard is very user-friendly. Keep up the good work!', '2025-01-14 17:30:00'),
    ('Ritu Sharma', 'ritu.sharma@yahoo.com', 5, 'Absolutely loved the experience! Booked for a corporate event and it was seamless.', '2025-01-15 22:00:00'),
    ('Nikhil Agarwal', 'nikhil.a@gmail.com', 3, 'Decent service. Event was good but confirmation email came a bit late.', '2025-01-16 19:00:00'),
    ('Shruti Bansal', 'shruti.bansal@outlook.com', 5, 'EventSphere made our family gathering so special! Highly recommended for all events.', '2025-01-17 20:30:00'),
    ('Ankit Malhotra', 'ankit.m@techcorp.com', 4, 'Professional service for our company event. Will use again for future events.', '2025-01-18 18:45:00'),
    ('Swati Chawla', 'swati.chawla@gmail.com', 5, 'Perfect in every way! From booking to event day, everything was handled brilliantly.', '2025-01-19 21:15:00'),
    ('Varun Kapoor', 'varun.k@yahoo.com', 4, 'Great experience booking through EventSphere. Event was well-managed.', '2025-01-20 19:30:00'),
    ('Preeti Saxena', 'preeti.saxena@gmail.com', 5, 'Outstanding service! The team went above and beyond. Thank you so much!', '2025-01-21 20:00:00');

-- Display success message
SELECT 'Dummy data inserted successfully!' AS Status;
SELECT COUNT(*) AS 'Total Event Registrations' FROM event_registrations;
SELECT COUNT(*) AS 'Total Feedbacks' FROM feedbacks;
