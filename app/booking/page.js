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
import { api } from "../../lib/path";

export default function BookingPage() {
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [formData, setFormData] = useState({
    customerId: "",
    cruiseDate: "",
    numberOfGuests: 1,
    packageType: "",
    cruisingTime: "",
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchBookings();
    fetchCustomers();
    fetchPackages();
  }, []);
  
  const fetchPackages = async () => {
    try {
      const res = await fetch(api("/api/package"));
      if (!res.ok) throw new Error("Failed to fetch packages");
      const data = await res.json();
      setPackages(data);
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to fetch packages", "error");
    }
  };

  const fetchBookings = async () => {
      try {
        const res = await fetch(api("/api/booking"));
        if (!res.ok) throw new Error("Failed to fetch bookings");
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error(err);
      showSnackbar("Failed to fetch bookings", "error");
      } finally {
        setLoading(false);
      }
  };

  const fetchCustomers = async () => {
    try {
      const res = await fetch(api("/api/customer"));
      if (!res.ok) throw new Error("Failed to fetch customers");
      const data = await res.json();
      setCustomers(data);
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
      customerId: booking?.customerId?._id || booking?.customerId || "",
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
    setFormData({ customerId: "", cruiseDate: "", numberOfGuests: 1 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingBooking 
        ? api(`/api/booking/${editingBooking._id}`)
        : api("/api/booking");
      
      const method = editingBooking ? "PUT" : "POST";
      
      // Include package information in the request
      const bookingData = {
        ...formData,
        packageType: formData.packageType,
        cruisingTime: formData.cruisingTime
      };
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save booking");
      }

      showSnackbar(
        editingBooking ? "Booking updated successfully" : "Booking created successfully"
      );
      handleClose();
      fetchBookings();
    } catch (err) {
      console.error(err);
      showSnackbar(err.message, "error");
    }
  };

  const handleDelete = async (bookingId) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;

    try {
      const res = await fetch(api(`/api/booking/${bookingId}`), {
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
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Box>
            <Typography variant="h4" component="h1">
              Bangkok River Cruise Bookings
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
              Book your unforgettable journey through Bangkok's iconic waterways
            </Typography>
          </Box>
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
                    <TableCell>Cruise Date</TableCell>
                    <TableCell>Package</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Guests</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
            {bookings.map((booking) => (
                    <TableRow key={booking._id}>
                      <TableCell>{booking.customerId?.name}</TableCell>
                      <TableCell>{booking.customerId?.email}</TableCell>
                      <TableCell>{booking.customerId?.phone || "-"}</TableCell>
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
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingBooking ? "Edit Booking" : "New Cruise Booking"}
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Customer</InputLabel>
                    <Select
                      name="customerId"
                      value={formData.customerId}
                      onChange={handleChange}
                      label="Customer"
                    >
                      {customers.map((customer) => (
                        <MenuItem key={customer._id} value={customer._id}>
                          {customer.name} ({customer.email})
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
                <Grid item xs={12}>
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
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Package Type</InputLabel>
                    <Select
                      name="packageType"
                      value={formData.packageType}
                      onChange={(e) => {
                        const selectedPackage = packages.find(p => p.name === e.target.value);
                        setFormData({
                          ...formData,
                          packageType: e.target.value,
                          cruisingTime: selectedPackage ? selectedPackage.cruisingTime : formData.cruisingTime
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
                    value={formData.cruisingTime}
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
