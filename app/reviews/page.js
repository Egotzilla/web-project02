"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Alert,
  Snackbar,
  Rating,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import AppTheme from "../components/AppTheme";
import AppAppBar from "../components/AppAppBar";
import Footer from "../components/Footer";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [cruises, setCruises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [formData, setFormData] = useState({
    userId: "",
    cruiseId: "",
    rating: 5,
    comment: "",
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchReviews();
    fetchUsers();
    fetchCruises();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_BASE}/review`);
      if (!res.ok) throw new Error("Failed to fetch reviews");
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to fetch reviews", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/user`);
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCruises = async () => {
    try {
      const res = await fetch(`${API_BASE}/cruise`);
      if (!res.ok) throw new Error("Failed to fetch cruises");
      const data = await res.json();
      setCruises(data);
    } catch (err) {
      console.error(err);
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpen = (review = null) => {
    setEditingReview(review);
    setFormData({
      userId: review?.userId?._id || review?.userId || "",
      cruiseId: review?.cruiseId?._id || review?.cruiseId || "",
      rating: review?.rating || 5,
      comment: review?.comment || "",
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingReview(null);
    setFormData({ userId: "", cruiseId: "", rating: 5, comment: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingReview
        ? `${API_BASE}/review/${editingReview._id}`
        : `${API_BASE}/review`;

      const method = editingReview ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save review");
      }

      showSnackbar(
        editingReview ? "Review updated successfully" : "Review created successfully"
      );
      handleClose();
      fetchReviews();
    } catch (err) {
      console.error(err);
      showSnackbar(err.message, "error");
    }
  };

  const handleDelete = async (reviewId) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const res = await fetch(`${API_BASE}/review/${reviewId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete review");

      showSnackbar("Review deleted successfully");
      fetchReviews();
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to delete review", "error");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRatingChange = (event, newValue) => {
    setFormData({
      ...formData,
      rating: newValue,
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Typography
        key={i}
        component="span"
        sx={{ color: i < rating ? "gold" : "gray", fontSize: "1.2rem" }}
      >
        ★
      </Typography>
    ));
  };

  if (loading) {
    return (
      <AppTheme>
        <AppAppBar />
        <Container maxWidth="lg" sx={{ my: 16 }}>
          <Typography>Loading reviews...</Typography>
        </Container>
        <Footer />
      </AppTheme>
    );
  }

  return (
    <AppTheme>
      <AppAppBar />
      <Container maxWidth="lg" sx={{ my: 16 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Typography variant="h4" component="h1">
            Cruise Reviews
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
          >
            Add Review
          </Button>
        </Box>

        <Card>
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Cruise/Location</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Comment</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reviews.map((review) => (
                    <TableRow key={review._id}>
                      <TableCell>{review.userId?.name}</TableCell>
                      <TableCell>{review.userId?.email}</TableCell>
                      <TableCell>
                        {review.cruiseId ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {review.cruiseId.images?.main && (
                              <img 
                                src={review.cruiseId.images.main} 
                                alt={review.cruiseId.title}
                                style={{ 
                                  width: 32, 
                                  height: 32, 
                                  borderRadius: 4, 
                                  objectFit: 'cover' 
                                }}
                              />
                            )}
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                {review.cruiseId.title}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                📍 {review.cruiseId.location}
                              </Typography>
                            </Box>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No cruise specified
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          {renderStars(review.rating)}
                          <Typography variant="body2" color="text.secondary">
                            ({review.rating}/5)
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 300 }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            overflow: "hidden", 
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                          }}
                        >
                          {review.comment}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleOpen(review)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(review._id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {reviews.length === 0 && (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  No reviews found. Be the first to review our cruise!
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Add/Edit Review Dialog */}
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingReview ? "Edit Review" : "Add New Review"}
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} minWidth={120}>
                  <FormControl fullWidth required >
                    <InputLabel>User</InputLabel>
                    <Select
                      name="userId"
                      value={formData.userId}
                      onChange={handleChange}
                      label="User"
                    >
                      {users.map((user) => (
                        <MenuItem key={user._id} value={user._id}>
                          {user.name} ({user.email})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} minWidth={120}>
                  <FormControl fullWidth>
                    <InputLabel>Cruise</InputLabel>
                    <Select
                      name="cruiseId"
                      value={formData.cruiseId}
                      onChange={handleChange}
                      label="Cruise"
                    >
                      <MenuItem value="">
                        <em>No cruise specified</em>
                      </MenuItem>
                      {cruises.map((cruise) => (
                        <MenuItem key={cruise._id} value={cruise._id}>
                          {cruise.title} - {cruise.location}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Typography component="legend" sx={{ mb: 1 }}>
                    Rating
                  </Typography>
                  <Rating
                    name="rating"
                    value={formData.rating}
                    onChange={handleRatingChange}
                    size="large"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Comment"
                    name="comment"
                    value={formData.comment}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    required
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" variant="contained">
                {editingReview ? "Update" : "Create"}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
      <Footer />
    </AppTheme>
  );
}
