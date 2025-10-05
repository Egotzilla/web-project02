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
  Avatar,
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

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

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
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [usersRes, bookingsRes, reviewsRes] = await Promise.all([
        fetch(`${API_BASE}/user`),
        fetch(`${API_BASE}/booking`),
        fetch(`${API_BASE}/review`),
      ]);

      const users = await usersRes.json();
      const bookings = await bookingsRes.json();
      const reviews = await reviewsRes.json();

      const totalUsers = users.length;
      const totalBookings = bookings.length;
      const totalReviews = reviews.length;
      const averageRating =
        totalReviews > 0
          ? (
              reviews.reduce((sum, review) => sum + review.rating, 0) /
              totalReviews
            ).toFixed(1)
          : 0;

      const averagePrice = 899.99;
      const revenue = totalBookings * averagePrice;

      const today = new Date().toDateString();
      const todayBookings = bookings.filter(
        (booking) => new Date(booking.cruiseDate).toDateString() === today
      ).length;

      setStats({
        totalCustomers: totalUsers,
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
      title: "Total Users",
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
      value: `฿${stats.revenue.toFixed(2)}`,
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

  return (
    <AppTheme>
      <AppAppBar />
      <Container maxWidth="lg" sx={{ my: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Header */}
        <Box sx={{ mb: 4, paddingTop: 10, textAlign: 'center' }}>
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
                  height: "100%",
                  cursor: stat.link ? "pointer" : "default",
                  transition: "transform 0.2s",
                  "&:hover": stat.link
                    ? {
                        transform: "translateY(-4px)",
                        boxShadow: 3,
                      }
                    : {},
                }}
                component={stat.link ? Link : "div"}
                href={stat.link}
              >
                <CardContent sx={{ textAlign: "center", p: 2 }}>
                  <Avatar
                    sx={{
                      backgroundColor: stat.color,
                      width: 56,
                      height: 56,
                      mx: "auto",
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

        <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
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
                      Manage Users
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
                      variant="contained"
                      fullWidth
                      startIcon={<TrendingUpIcon />}
                      component={Link}
                      href="/admin/packages"
                      sx={{ py: 1.5 }}
                    >
                      Manage Packages
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </AppTheme>
  );
}