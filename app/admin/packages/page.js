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
  Switch,
  FormControlLabel,
} from "@mui/material";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import AppTheme from "../../components/AppTheme";
import AppAppBar from "../../components/AppAppBar";
import Footer from "../../components/Footer";
import { api } from "../../../lib/path";

export default function PackageManagementPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    cruisingTime: "",
    location: "",
    isActive: true,
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
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
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpen = (packageData = null) => {
    setEditingPackage(packageData);
    setFormData({
      name: packageData?.name || "",
      description: packageData?.description || "",
      cruisingTime: packageData?.cruisingTime || "",
      location: packageData?.location || "",
      isActive: packageData?.isActive !== undefined ? packageData.isActive : true,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingPackage(null);
    setFormData({
      name: "",
      description: "",
      cruisingTime: "",
      location: "",
      isActive: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingPackage 
        ? api(`/api/package/${editingPackage._id}`)
        : api("/api/package");
      
      const method = editingPackage ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save package");
      }

      showSnackbar(
        editingPackage ? "Package updated successfully" : "Package created successfully"
      );
      handleClose();
      fetchPackages();
    } catch (err) {
      console.error(err);
      showSnackbar(err.message, "error");
    }
  };

  const handleDelete = async (packageId) => {
    if (!confirm("Are you sure you want to delete this package?")) return;

    try {
      const res = await fetch(api(`/api/package/${packageId}`), {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete package");

      showSnackbar("Package deleted successfully");
      fetchPackages();
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to delete package", "error");
    }
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === "isActive" ? checked : value,
    });
  };

  if (loading) {
    return (
      <AppTheme>
        <AppAppBar />
        <Container maxWidth="lg" sx={{ my: 16 }}>
          <Typography>Loading packages...</Typography>
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
              Package Management
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
              Manage cruise package options, times, and locations
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
          >
            Add Package
          </Button>
        </Box>

        <Card>
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Package Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Cruising Time</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {packages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No packages found. Add your first package!
                      </TableCell>
                    </TableRow>
                  ) : (
                    packages.map((pkg) => (
                      <TableRow key={pkg._id}>
                        <TableCell>{pkg.name}</TableCell>
                        <TableCell>{pkg.description}</TableCell>
                        <TableCell>{pkg.cruisingTime}</TableCell>
                        <TableCell>{pkg.location}</TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "inline-block",
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              backgroundColor: pkg.isActive ? "success.light" : "error.light",
                              color: "white",
                            }}
                          >
                            {pkg.isActive ? "Active" : "Inactive"}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color="primary"
                            onClick={() => handleOpen(pkg)}
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(pkg._id)}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Package Form Dialog */}
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingPackage ? "Edit Package" : "Add New Package"}
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    name="name"
                    label="Package Name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                    placeholder="e.g., SUNSET Cruise Ticket at Asiatique Pier"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="description"
                    label="Description"
                    value={formData.description}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                    placeholder="e.g., Cruising Time: 17:00-18:30"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="cruisingTime"
                    label="Cruising Time"
                    value={formData.cruisingTime}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                    placeholder="e.g., 17:00-18:30"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="location"
                    label="Location"
                    value={formData.location}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                    placeholder="e.g., Asiatique Pier"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleChange}
                        color="primary"
                      />
                    }
                    label="Active"
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">
                {editingPackage ? "Update" : "Create"}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
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