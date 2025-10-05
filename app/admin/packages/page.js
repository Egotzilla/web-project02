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

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function CruiseManagementPage() {
  const [cruises, setCruises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingCruise, setEditingCruise] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    duration: "",
    price: "",
    currency: "THB",
    tag: "",
    features: [],
    highlights: [],
    images: {
      main: "",
      gallery: []
    }
  });
  const [imageFiles, setImageFiles] = useState({
    main: null,
    gallery: []
  });
  const [imagePreviews, setImagePreviews] = useState({
    main: "",
    gallery: []
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchCruises();
  }, []);

  const fetchCruises = async () => {
    try {
      const res = await fetch(`${API_BASE}/cruise`);
      if (!res.ok) throw new Error("Failed to fetch cruises");
      const data = await res.json();
      setCruises(data);
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to fetch cruises", "error");
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpen = (cruiseData = null) => {
    setEditingCruise(cruiseData);
    setFormData({
      title: cruiseData?.title || "",
      description: cruiseData?.description || "",
      location: cruiseData?.location || "",
      duration: cruiseData?.duration || "",
      price: cruiseData?.price || "",
      currency: cruiseData?.currency || "THB",
      tag: cruiseData?.tag || "",
      features: cruiseData?.features || [],
      highlights: cruiseData?.highlights || [],
      images: {
        main: cruiseData?.images?.main || "",
        gallery: cruiseData?.images?.gallery || []
      }
    });
    // Reset image files and previews
    setImageFiles({ main: null, gallery: [] });
    setImagePreviews({
      main: cruiseData?.images?.main || "",
      gallery: cruiseData?.images?.gallery || []
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingCruise(null);
    setFormData({
      title: "",
      description: "",
      location: "",
      duration: "",
      price: "",
      currency: "THB",
      tag: "",
      features: [],
      highlights: [],
      images: {
        main: "",
        gallery: []
      }
    });
    // Reset image files and previews
    setImageFiles({ main: null, gallery: [] });
    setImagePreviews({ main: "", gallery: [] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Prepare data with current images if no new files selected
      const submitData = { ...formData };
      
      // For updates, keep existing images if no new ones selected
      if (editingCruise) {
        if (!imageFiles.main && editingCruise.images?.main) {
          submitData.images.main = editingCruise.images.main;
        } else if (imagePreviews.main && imagePreviews.main.startsWith('data:')) {
          submitData.images.main = imagePreviews.main;
        }
        
        if (imageFiles.gallery.length === 0 && editingCruise.images?.gallery) {
          submitData.images.gallery = editingCruise.images.gallery;
        } else if (imagePreviews.gallery.length > 0) {
          submitData.images.gallery = imagePreviews.gallery;
        }
      } else {
        // For new cruises, use preview data
        if (imagePreviews.main) {
          submitData.images.main = imagePreviews.main;
        }
        if (imagePreviews.gallery.length > 0) {
          submitData.images.gallery = imagePreviews.gallery;
        }
      }

      const url = editingCruise 
        ? `${API_BASE}/cruise/${editingCruise._id}`
        : `${API_BASE}/cruise`;

      const method = editingCruise ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save cruise");
      }

      showSnackbar(
        editingCruise ? "Cruise updated successfully" : "Cruise created successfully"
      );
      handleClose();
      fetchCruises();
    } catch (err) {
      console.error(err);
      showSnackbar(err.message, "error");
    }
  };

  const handleDelete = async (cruiseId) => {
    if (!confirm("Are you sure you want to delete this cruise?")) return;

    try {
      const res = await fetch(`${API_BASE}/cruise/${cruiseId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete cruise");

      showSnackbar("Cruise deleted successfully");
      fetchCruises();
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to delete cruise", "error");
    }
  };

  // Handle image file selection
  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showSnackbar('Please select a valid image file', 'error');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showSnackbar('Image size should be less than 5MB', 'error');
        return;
      }

      setImageFiles(prev => ({ ...prev, [type]: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => ({ ...prev, [type]: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle gallery image addition
  const handleGalleryImageAdd = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        showSnackbar('Please select valid image files', 'error');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        showSnackbar('Image size should be less than 5MB', 'error');
        return;
      }

      setImageFiles(prev => ({ 
        ...prev, 
        gallery: [...prev.gallery, file] 
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => ({ 
          ...prev, 
          gallery: [...prev.gallery, e.target.result] 
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove gallery image
  const removeGalleryImage = (index) => {
    setImageFiles(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
    setImagePreviews(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  if (loading) {
    return (
      <AppTheme>
        <AppAppBar />
        <Container maxWidth="lg" sx={{ my: 16 }}>
          <Typography>Loading cruises...</Typography>
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
              Cruise Management
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
              Manage cruise offerings, details, and availability
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
          >
            Add Cruise
          </Button>
        </Box>

        <Card>
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Cruise Title</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Tag</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cruises.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No cruises found. Add your first cruise!
                      </TableCell>
                    </TableRow>
                  ) : (
                    cruises.map((cruise) => (
                      <TableRow key={cruise._id}>
                        <TableCell>
                          {cruise.images?.main ? (
                            <img 
                              src={cruise.images.main} 
                              alt={cruise.title}
                              style={{ 
                                width: '50px', 
                                height: '40px', 
                                objectFit: 'cover', 
                                borderRadius: '4px',
                                border: '1px solid #ddd'
                              }} 
                            />
                          ) : (
                            <Box
                              sx={{
                                width: '50px',
                                height: '40px',
                                backgroundColor: '#f5f5f5',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '4px',
                                border: '1px solid #ddd'
                              }}
                            >
                              <Typography variant="caption" color="text.secondary">
                                No Image
                              </Typography>
                            </Box>
                          )}
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle2">{cruise.title}</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {cruise.description}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{cruise.location}</TableCell>
                        <TableCell>{cruise.duration}</TableCell>
                        <TableCell>{cruise.currency}฿{cruise.price}</TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "inline-block",
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              backgroundColor: "primary.light",
                              color: "white",
                            }}
                          >
                            {cruise.tag}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color="primary"
                            onClick={() => handleOpen(cruise)}
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(cruise._id)}
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

        {/* Cruise Form Dialog */}
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingCruise ? "Edit Cruise" : "Add New Cruise"}
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    name="title"
                    label="Cruise Title"
                    value={formData.title}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                    placeholder="e.g., Emerald River Cruise in Bangkok"
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
                    multiline
                    rows={3}
                    placeholder="Describe the cruise experience..."
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
                    placeholder="e.g., Bangkok"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="duration"
                    label="Duration"
                    value={formData.duration}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                    placeholder="e.g., 1hr 30min - 5hr 30min"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="price"
                    label="Price"
                    value={formData.price}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                    type="number"
                    placeholder="e.g., 899.99"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="currency"
                    label="Currency"
                    value={formData.currency}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                    placeholder="e.g., THB"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="tag"
                    label="Tag"
                    value={formData.tag}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                    placeholder="e.g., Bangkok"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Main Image
                    </Typography>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, 'main')}
                      style={{ marginBottom: '8px' }}
                    />
                    {imagePreviews.main && (
                      <Box sx={{ mt: 1 }}>
                        <img 
                          src={imagePreviews.main} 
                          alt="Main preview" 
                          style={{ 
                            width: '100px', 
                            height: '60px', 
                            objectFit: 'cover', 
                            borderRadius: '4px' 
                          }} 
                        />
                      </Box>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Gallery Images
                    </Typography>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryImageAdd}
                      style={{ marginBottom: '8px' }}
                    />
                    {imagePreviews.gallery.length > 0 && (
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                        {imagePreviews.gallery.map((preview, index) => (
                          <Box key={index} sx={{ position: 'relative' }}>
                            <img 
                              src={preview} 
                              alt={`Gallery preview ${index}`} 
                              style={{ 
                                width: '80px', 
                                height: '60px', 
                                objectFit: 'cover', 
                                borderRadius: '4px' 
                              }} 
                            />
                            <IconButton
                              size="small"
                              onClick={() => removeGalleryImage(index)}
                              sx={{
                                position: 'absolute',
                                top: -8,
                                right: -8,
                                backgroundColor: 'error.main',
                                color: 'white',
                                '&:hover': { backgroundColor: 'error.dark' }
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">
                {editingCruise ? "Update" : "Create"}
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