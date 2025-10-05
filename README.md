Emerald River Cruise – Booking System

WAD Project 2

Team Members

•	Puran Paodensakul – 6611140

•	Gulizara Benjapalaporn – 6612233

⸻

Project Description

A modern web-based booking system for a Bangkok river cruise experience.

The system allows:

	•	Customer Management: Add, edit, and manage customer information
	•	Booking System: Create and manage cruise bookings with date and guest count
	•	Review System: Customers can leave ratings and feedback (1–5 stars)
	•	Package Management: Admins can create and manage cruise packages

Built with Next.js + MongoDB, following REST API standards.

⸻

Data Models (3+ CRUD Entities)

	1.	Customer
	•	name, email, phone
	•	CRUD via /api/customer
	2.	Booking
	•	customerId, cruiseDate, numberOfGuests
	•	CRUD via /api/booking
	3.	Review
	•	customerId, rating (1–5), comment
	•	CRUD via /api/review
	4.	Package
	•	title, description, price
	•	CRUD via /api/package

⸻

Tech Stack

	•	Frontend: Next.js 15 (React 19)
	•	Backend: REST API (Next.js API routes)
	•	Database: MongoDB with Mongoose
	•	UI Library: Material-UI (MUI v7)

⸻

Deployment
	•	GitHub Repository: https://github.com/Egotzilla/web-project02
	•	Demo Video (YouTube, Unlisted): https://www.youtube.com/watch?v=k1UCI52LnNA
