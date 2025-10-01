"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Paper,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Alert,
} from "@mui/material";
import {
  Person as PersonIcon,
  Event as EventIcon,
  Star as StarIcon,
  Edit as EditIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import AppTheme from "../components/AppTheme";
import AppAppBar from "../components/AppAppBar";
import Footer from "../components/Footer";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "../../lib/path";

export default function ProfilePage() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (isAdmin()) {
      router.push("/admin");
      return;
    }

    fetchUserData();
  }, [user, router, isAdmin]);

  const fetchUserData = async () => {
    try {
      // Fetch user's bookings and reviews
      const [bookingsRes, reviewsRes] = await Promise.all([
        fetch(api("/api/booking")),
        fetch(api("/api/review")),
      ]);

      const allBookings = await bookingsRes.json();
      const allReviews = await reviewsRes.json();
      
      console.log("Current user ID:", user._id);
      console.log("All bookings:", allBookings);

      // Filter bookings and reviews for current user
      const userBookings = allBookings.filter((booking) => {
        // Handle both populated and non-populated customerId
        const bookingCustomerId = booking.customerId?._id || booking.customerId;
        // Convert to string for reliable comparison
        return bookingCustomerId && bookingCustomerId.toString() === user._id.toString();
      });
      const userReviews = allReviews.filter((review) => {
        // Handle both populated and non-populated customerId
        const reviewCustomerId = review.customerId?._id || review.customerId;
        // Convert to string for reliable comparison
        return reviewCustomerId && reviewCustomerId.toString() === user._id.toString();
      });

      setBookings(userBookings);
      setReviews(userReviews);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppTheme>
        <AppAppBar />
        <Container maxWidth="lg" sx={{ my: 16 }}>
          <Typography>Loading your profile...</Typography>
        </Container>
        <Footer />
      </AppTheme>
    );
  }

  return (
    <AppTheme>
      <AppAppBar />
      <Container maxWidth="lg" sx={{ my: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            My Profile
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage your cruise bookings and reviews
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* User Information */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Avatar sx={{ width: 64, height: 64, mr: 2, bgcolor: "primary.main" }}>
                    <PersonIcon fontSize="large" />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{user.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                    {user.phone && (
                      <Typography variant="body2" color="text.secondary">
                        {user.phone}
                      </Typography>
                    )}
                  </Box>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2">Total Bookings:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {bookings.length}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2">Reviews Written:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {reviews.length}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2">Member Since:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Bookings */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                  <Typography variant="h5">My Bookings</Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    component={Link}
                    href="/"
                  >
                    Book New Cruise
                  </Button>
                </Box>

                {bookings.length === 0 ? (
                  <Alert severity="info">
                    You haven&apos;t made any bookings yet. <Link href="/">Book your first cruise!</Link>
                  </Alert>
                ) : (
                  <List>
                    {bookings.map((booking, index) => (
                      <div key={booking._id}>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: "primary.main" }}>
                              <EventIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography variant="h6">
                                  Bangkok River Cruise
                                </Typography>
                                <Chip
                                  label={new Date(booking.cruiseDate) > new Date() ? "Upcoming" : "Past"}
                                  color={new Date(booking.cruiseDate) > new Date() ? "success" : "default"}
                                  size="small"
                                />
                              </Box>
                            }
                            secondary={
                              <Box>
                                <Typography variant="body2">
                                  <strong>Date:</strong> {new Date(booking.cruiseDate).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Guests:</strong> {booking.numberOfGuests} {booking.numberOfGuests === 1 ? 'person' : 'people'}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Booked:</strong> {new Date(booking.createdAt).toLocaleDateString()}
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < bookings.length - 1 && <Divider />}
                      </div>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Reviews */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                  <Typography variant="h5">My Reviews</Typography>
                  <Button
                    variant="outlined"
                    startIcon={<StarIcon />}
                    component={Link}
                    href="/reviews"
                  >
                    Write Review
                  </Button>
                </Box>

                {reviews.length === 0 ? (
                  <Alert severity="info">
                    You haven&apos;t written any reviews yet. Share your cruise experience with others!
                  </Alert>
                ) : (
                  <List>
                    {reviews.map((review, index) => (
                      <div key={review._id}>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: "warning.main" }}>
                              <StarIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography variant="h6">
                                  Bangkok River Cruise
                                </Typography>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                  {Array.from({ length: 5 }, (_, i) => (
                                    <StarIcon
                                      key={i}
                                      sx={{
                                        color: i < review.rating ? "gold" : "grey.300",
                                        fontSize: 20,
                                      }}
                                    />
                                  ))}
                                </Box>
                              </Box>
                            }
                            secondary={
                              <Box>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                  {review.comment}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Written on {new Date(review.createdAt).toLocaleDateString()}
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < reviews.length - 1 && <Divider />}
                      </div>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </AppTheme>
  );
}
