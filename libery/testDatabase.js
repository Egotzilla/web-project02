use('web-project02');

// Show all users
const users = db.users.find().toArray();
console.log("Users:");
console.log(users);

// Show all bookings
const bookings = db.bookings.find().toArray();
console.log("Bookings:");
console.log(bookings);

// Show all reviews
const reviews = db.reviews.find().toArray();
console.log("Reviews:");
console.log(reviews);


// Show bookings with user names
db.bookings.find().forEach(booking => {
  const user = db.users.findOne({ _id: booking.userId });
  console.log({
    userName: user.name,
    cruiseDate: booking.cruiseDate,
    numberOfGuests: booking.numberOfGuests
  });
});

// Show reviews with user names
db.reviews.find().forEach(review => {
  const user = db.users.findOne({ _id: review.userId });
  console.log({
    userName: user.name,
    rating: review.rating,
    comment: review.comment
  });
});
