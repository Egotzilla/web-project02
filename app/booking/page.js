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

export default function BookingPage() {
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [cruises, setCruises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [formData, setFormData] = useState({
    userId: "",
    cruiseId: "",
    cruiseDate: "",
    numberOfGuests: 1,
    packageType: "",
    cruisingTime: "",
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchBookings();
    fetchUsers();
    fetchPackages();
    fetchCruises();
  }, []);
  
  const fetchPackages = async () => {
    try {
      const res = await fetch(`${API_BASE}/package`);
      if (!res.ok) throw new Error("Failed to fetch packages");
      const data = await res.json();
      setPackages(data);
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to fetch packages", "error");
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
      showSnackbar("Failed to fetch cruises", "error");
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/booking`);
      if (!res.ok) throw new Error("Failed to fetch bookings");
      const data = await res.json();
      console.log('Fetched bookings data:', data);
      console.log('First booking cruise info:', data[0]?.cruiseId);
      setBookings(data);
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to fetch bookings", "error");
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

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpen = (booking = null) => {
    setEditingBooking(booking);
    setFormData({
      userId: booking?.userId?._id || booking?.userId || "",
      cruiseId: booking?.cruiseId?._id || booking?.cruiseId || "",
      cruiseDate: booking ? new Date(booking.cruiseDate).toISOString().split('T')[0] : "",
      numberOfGuests: booking?.numberOfGuests || 1,
      packageType: booking?.packageType || (packages.length > 0 ? packages[0].name : ""),
      cruisingTime: booking?.cruisingTime || (packages.length > 0 ? packages[0].cruisingTime : ""),
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingBooking(null);
    setFormData({
      userId: "",
      cruiseId: "",
      cruiseDate: "",
      numberOfGuests: 1,
      packageType: "",
      cruisingTime: ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingBooking
        ? `${API_BASE}/booking/${editingBooking._id}`
        : `${API_BASE}/booking`;

      const method = editingBooking ? "PUT" : "POST";
      
      // Validate required fields
      if (!formData.userId) {
        throw new Error("Please select a user");
      }
      if (!formData.cruiseDate) {
        throw new Error("Please select a cruise date");
      }
      if (!formData.numberOfGuests || formData.numberOfGuests < 1) {
        throw new Error("Please enter a valid number of guests");
      }
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Failed to save booking" }));
        throw new Error(errorData.error || "Failed to save booking");
      }

      showSnackbar(
        editingBooking ? "Booking updated successfully" : "Booking created successfully"
      );
      
      handleClose();
      await fetchBookings();
      
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      showSnackbar(err.message, "error");
    }
  };

  const handleDelete = async (bookingId) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;

    try {
      const res = await fetch(`${API_BASE}/booking/${bookingId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete booking");

      showSnackbar("Booking deleted successfully");
      fetchBookings();
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to delete booking", "error");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <AppTheme>
        <AppAppBar />
        <Container maxWidth="lg" sx={{ my: 16 }}>
          <Typography>Loading bookings...</Typography>
        </Container>
        <Footer />
      </AppTheme>
    );
  }

  return (
    <AppTheme>
      <AppAppBar />
      <Container maxWidth="lg" sx={{ my: 16 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
          >
            New Booking
          </Button>
        </Box>

        <Card>
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Customer</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Cruise</TableCell>
                    <TableCell>Cruise Date</TableCell>
                    <TableCell>Package</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Guests</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookings.map((booking, index) => (
                    <TableRow key={`${booking._id}-${index}`}>
                      <TableCell>{booking.userId?.name}</TableCell>
                      <TableCell>{booking.userId?.email}</TableCell>
                      <TableCell>{booking.userId?.phone || "-"}</TableCell>
                      <TableCell>
                        {booking.cruiseId?.title || "No cruise selected"}
                        {console.log('Booking cruise data:', { 
                          bookingId: booking._id, 
                          cruiseId: booking.cruiseId,
                          cruiseTitle: booking.cruiseId?.title,
                          rawCruiseId: typeof booking.cruiseId
                        })}
                      </TableCell>
                      <TableCell>
                        {new Date(booking.cruiseDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{booking.packageType || "SUNSET Cruise"}</TableCell>
                      <TableCell>{booking.cruisingTime || "17:00-18:30"}</TableCell>
                      <TableCell>{booking.numberOfGuests}</TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleOpen(booking)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(booking._id)}
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

            {bookings.length === 0 && (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  No bookings found. Create your first booking!
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Add/Edit Booking Dialog */}
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingBooking ? "Edit Booking" : "New Cruise Booking"}
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1}}>
                <Grid item xs={12} minWidth={100}>
                  <FormControl fullWidth required>
                    <InputLabel>User</InputLabel>
                    <Select
                      name="userId"
                      value={formData.userId || ""}
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
                <Grid item xs={12} minWidth={100}>
                  <FormControl fullWidth required>
                    <InputLabel>Cruise</InputLabel>
                    <Select
                      name="cruiseId"
                      value={formData.cruiseId || ""}
                      onChange={handleChange}
                      label="Cruise"
                    >
                      {cruises.map((cruise) => (
                        <MenuItem key={cruise._id} value={cruise._id}>
                          {cruise.title} - {cruise.location}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Cruise Date"
                    name="cruiseDate"
                    type="date"
                    value={formData.cruiseDate}
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                  />
                </Grid>
                <Grid item xs={12} minWidth={150}>
                  <TextField
                    fullWidth
                    label="Number of Guests"
                    name="numberOfGuests"
                    type="number"
                    value={formData.numberOfGuests}
                    onChange={handleChange}
                    inputProps={{ min: 1, max: 20 }}
                    required
                  />
                </Grid>
                <Grid item xs={12} minWidth={150}>
                  <FormControl fullWidth required>
                    <InputLabel>Package Type</InputLabel>
                    <Select
                      name="packageType"
                      value={formData.packageType || ""}
                      onChange={(e) => {
                        const selectedPackage = packages.find(p => p.name === e.target.value);
                        setFormData({
                          ...formData,
                          packageType: e.target.value,
                          cruisingTime: selectedPackage ? selectedPackage.cruisingTime : ""
                        });
                      }}
                      label="Package Type"
                    >
                      {packages.length > 0 ? (
                        packages.map((pkg) => (
                          <MenuItem key={pkg._id} value={pkg.name}>
                            {pkg.name}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value="SUNSET Cruise Ticket at Asiatique Pier">
                          SUNSET Cruise Ticket at Asiatique Pier
                        </MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Cruising Time"
                    name="cruisingTime"
                    value={formData.cruisingTime || ""}
                    onChange={handleChange}
                    required
                    disabled
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" variant="contained">
                {editingBooking ? "Update" : "Create"}
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
