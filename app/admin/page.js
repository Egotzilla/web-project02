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
} from "@mui/material";
import {
  People as PeopleIcon,
  Event as EventIcon,
  Reviews as ReviewsIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import AppTheme from "../components/AppTheme";
import AppAppBar from "../components/AppAppBar";
import Footer from "../components/Footer";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalBookings: 0,
    totalReviews: 0,
    averageRating: 0,
    revenue: 0,
    todayBookings: 0,
  });

  useEffect(() => {
    // Fetch dashboard statistics
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch all data to calculate stats
      const [customersRes, bookingsRes, reviewsRes] = await Promise.all([
        fetch("/api/customer"),
        fetch("/api/booking"),
        fetch("/api/review"),
      ]);

      const customers = await customersRes.json();
      const bookings = await bookingsRes.json();
      const reviews = await reviewsRes.json();

      // Calculate statistics
      const totalCustomers = customers.length;
      const totalBookings = bookings.length;
      const totalReviews = reviews.length;
      const averageRating = totalReviews > 0 
        ? (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1)
        : 0;
      
      // Calculate revenue (assuming average price per booking)
      const averagePrice = 27.99;
      const revenue = totalBookings * averagePrice;

      // Count today's bookings
      const today = new Date().toDateString();
      const todayBookings = bookings.filter(booking => 
        new Date(booking.cruiseDate).toDateString() === today
      ).length;

      setStats({
        totalCustomers,
        totalBookings,
        totalReviews,
        averageRating,
        revenue,
        todayBookings,
      });
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    }
  };

  const statCards = [
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: <PeopleIcon />,
      color: "#1976d2",
      link: "/customers",
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: <EventIcon />,
      color: "#388e3c",
      link: "/booking",
    },
    {
      title: "Customer Reviews",
      value: stats.totalReviews,
      icon: <ReviewsIcon />,
      color: "#f57c00",
      link: "/reviews",
    },
    {
      title: "Average Rating",
      value: `${stats.averageRating}/5`,
      icon: <TrendingUpIcon />,
      color: "#7b1fa2",
    },
    {
      title: "Revenue",
      value: `$${stats.revenue.toFixed(2)}`,
      icon: <MoneyIcon />,
      color: "#d32f2f",
    },
    {
      title: "Today's Bookings",
      value: stats.todayBookings,
      icon: <ScheduleIcon />,
      color: "#0288d1",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "booking",
      message: "New booking created for tomorrow's sunset cruise",
      time: "2 hours ago",
      icon: <EventIcon />,
    },
    {
      id: 2,
      type: "review",
      message: "5-star review received from Sarah Johnson",
      time: "4 hours ago",
      icon: <ReviewsIcon />,
    },
    {
      id: 3,
      type: "customer",
      message: "New customer registration: Michael Chen",
      time: "6 hours ago",
      icon: <PeopleIcon />,
    },
    {
      id: 4,
      type: "booking",
      message: "Booking cancelled for dinner cruise",
      time: "8 hours ago",
      icon: <EventIcon />,
    },
  ];

  return (
    <AppTheme>
      <AppAppBar />
      <Container maxWidth="lg" sx={{ my: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Admin Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage your Bangkok River Cruise operations
          </Typography>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {statCards.map((stat, index) => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  cursor: stat.link ? 'pointer' : 'default',
                  transition: 'transform 0.2s',
                  '&:hover': stat.link ? {
                    transform: 'translateY(-4px)',
                    boxShadow: 3
                  } : {}
                }}
                component={stat.link ? Link : 'div'}
                href={stat.link}
              >
                <CardContent sx={{ textAlign: 'center', p: 2 }}>
                  <Avatar
                    sx={{
                      backgroundColor: stat.color,
                      width: 56,
                      height: 56,
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                  <Typography variant="h4" component="div" gutterBottom>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {/* Quick Actions */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<PeopleIcon />}
                      component={Link}
                      href="/customers"
                      sx={{ py: 1.5 }}
                    >
                      Manage Customers
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<EventIcon />}
                      component={Link}
                      href="/booking"
                      sx={{ py: 1.5 }}
                    >
                      Manage Bookings
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<ReviewsIcon />}
                      component={Link}
                      href="/reviews"
                      sx={{ py: 1.5 }}
                    >
                      View Reviews
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<TrendingUpIcon />}
                      sx={{ py: 1.5 }}
                    >
                      Generate Report
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Activity
                </Typography>
                <List>
                  {recentActivities.map((activity, index) => (
                    <div key={activity.id}>
                      <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ backgroundColor: 'primary.main' }}>
                            {activity.icon}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={activity.message}
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                              <Chip
                                label={activity.type}
                                size="small"
                                variant="outlined"
                                color={
                                  activity.type === 'booking' ? 'primary' :
                                  activity.type === 'review' ? 'success' :
                                  activity.type === 'customer' ? 'info' : 'default'
                                }
                              />
                              <Typography variant="caption" color="text.secondary">
                                {activity.time}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < recentActivities.length - 1 && <Divider />}
                    </div>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Cruise Information */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Cruise Information
                </Typography>
                <Paper sx={{ p: 3, backgroundColor: '#f5f5f5' }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Cruise Name
                        </Typography>
                        <Typography variant="h6">
                          Chao Phraya Princess Cruise
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Base Price
                        </Typography>
                        <Typography variant="h6">
                          $27.99 per person
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Available Times
                        </Typography>
                        <Typography variant="h6">
                          Sunset & Dinner Cruises
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Description
                        </Typography>
                        <Typography variant="body2">
                          Experience the magic of Bangkok from the water. Our luxury river cruise takes you through the heart of the city, past ancient temples, modern skyscrapers, and vibrant floating markets. Savor authentic Thai cuisine, enjoy cultural performances, and create unforgettable memories on the Chao Phraya River.
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </AppTheme>
  );
}
