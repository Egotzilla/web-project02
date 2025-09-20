use('web-project02');

// Show all customers
const customers = db.customers.find().toArray();
console.log("Customers:");
console.log(customers);

// Show all bookings
const bookings = db.bookings.find().toArray();
console.log("Bookings:");
console.log(bookings);

// Show all reviews
const reviews = db.reviews.find().toArray();
console.log("Reviews:");
console.log(reviews);


// Show bookings with customer names
db.bookings.find().forEach(booking => {
  const customer = db.customers.findOne({ _id: booking.customerId });
  console.log({
    customerName: customer.name,
    cruiseDate: booking.cruiseDate,
    numberOfGuests: booking.numberOfGuests
  });
});

// Show reviews with customer names
db.reviews.find().forEach(review => {
  const customer = db.customers.findOne({ _id: review.customerId });
  console.log({
    customerName: customer.name,
    rating: review.rating,
    comment: review.comment
  });
});
