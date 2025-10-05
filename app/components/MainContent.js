'use client';

import * as React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import RssFeedRoundedIcon from '@mui/icons-material/RssFeedRounded';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarIcon from '@mui/icons-material/Star';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// Default package options as fallback
const defaultPackageOptions = [
  {
    id: 'default',
    name: 'SUNSET Cruise Ticket at Asiatique Pier',
    time: '17:00-18:30',
    description: 'Cruising Time: 17:00-18:30',
    location: 'Asiatique Pier',
    selected: true
  }
];

function Author({ authors }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 2,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px',
      }}
    >
      <Box
        sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}
      >
        <AvatarGroup max={3}>
          {authors.map((author, index) => (
            <Avatar
              key={index}
              alt={author.name}
              src={author.avatar}
              sx={{ width: 24, height: 24 }}
            />
          ))}
        </AvatarGroup>
        <Typography variant="caption">
          {authors.map((author) => author.name).join(', ')}
        </Typography>
      </Box>
      <Typography variant="caption">July 14, 2021</Typography>
    </Box>
  );
}

Author.propTypes = {
  authors: PropTypes.arrayOf(
    PropTypes.shape({
      avatar: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export function Search() {
  return (
    <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
      <OutlinedInput
        size="small"
        id="search-bar"
        placeholder="Search Bangkok cruise experiences…"
        sx={{ flexGrow: 1 }}
        startAdornment={
          <InputAdornment position="start" sx={{ color: 'text.primary' }}>
            <SearchRoundedIcon fontSize="small" />
          </InputAdornment>
        }
        inputProps={{
          'aria-label': 'search',
        }}
      />
    </FormControl>
  );
}

export default function MainContent() {
  const [selectedImage, setSelectedImage] = React.useState('/img/wp1.png');
  const [selectedPackage, setSelectedPackage] = React.useState(1);
  const [selectedDate, setSelectedDate] = React.useState('');
  const [numberOfGuests, setNumberOfGuests] = React.useState(1);
  const [bookingLoading, setBookingLoading] = React.useState(false);
  const [bookingSuccess, setBookingSuccess] = React.useState('');
  const [bookingError, setBookingError] = React.useState('');
  const [reviews, setReviews] = React.useState([]);
  const [reviewsLoading, setReviewsLoading] = React.useState(true);
  const [newReviewRating, setNewReviewRating] = React.useState(5);
  const [newReviewComment, setNewReviewComment] = React.useState('');
  const [reviewSubmitting, setReviewSubmitting] = React.useState(false);
  const [reviewError, setReviewError] = React.useState('');
  const [reviewSuccess, setReviewSuccess] = React.useState('');
  const [showAllReviews, setShowAllReviews] = React.useState(false);
  const [packageOptions, setPackageOptions] = React.useState(defaultPackageOptions);
  const [packagesLoading, setPackagesLoading] = React.useState(true);
  const [realStats, setRealStats] = React.useState({
    totalReviews: 0,
    averageRating: 0,
    totalBookings: '0'
  });
  const [statsLoading, setStatsLoading] = React.useState(true);
  const [showMoreHighlights, setShowMoreHighlights] = React.useState(false);
  const [cruiseData, setCruiseData] = React.useState(null);
  const [allCruises, setAllCruises] = React.useState([]);
  const [currentCruiseIndex, setCurrentCruiseIndex] = React.useState(0);
  const [cruiseLoading, setCruiseLoading] = React.useState(true);
  
  const { user } = useAuth();
  const router = useRouter();
  
  // Navigation functions
  const goToPreviousCruise = () => {
    if (allCruises.length > 0) {
      const newIndex = currentCruiseIndex === 0 ? allCruises.length - 1 : currentCruiseIndex - 1;
      setCurrentCruiseIndex(newIndex);
      const cruise = allCruises[newIndex];
      setCruiseData(cruise);
      setSelectedImage(cruise.images?.main || '/img/wp1.png');
      // Update stats for the new cruise
      fetchStats(cruise._id);
    }
  };

  const goToNextCruise = () => {
    if (allCruises.length > 0) {
      const newIndex = currentCruiseIndex === allCruises.length - 1 ? 0 : currentCruiseIndex + 1;
      setCurrentCruiseIndex(newIndex);
      const cruise = allCruises[newIndex];
      setCruiseData(cruise);
      setSelectedImage(cruise.images?.main || '/img/wp1.png');
      // Update stats for the new cruise
      fetchStats(cruise._id);
    }
  };

  // Fetch cruise data from API
  React.useEffect(() => {
    const fetchCruiseData = async () => {
      try {
        setCruiseLoading(true);
        const response = await fetch(`${API_BASE}/cruise`);
        const cruises = await response.json();
        
        // Store all cruises and use the first one
        if (cruises && cruises.length > 0) {
          setAllCruises(cruises);
          const cruise = cruises[0];
          setCruiseData(cruise);
          setCurrentCruiseIndex(0);
          setSelectedImage(cruise.images?.main || '/img/wp1.png');
        } else {
          // Fallback to static data
          setCruiseData(cruiseData);
          setAllCruises([]);
        }
      } catch (error) {
        console.error('Failed to fetch cruise data:', error);
        // Fallback to static data
        setCruiseData(cruiseData);
        setAllCruises([]);
      } finally {
        setCruiseLoading(false);
      }
    };
    
    fetchCruiseData();
  }, []);
  
  // Fetch real reviews from the API
  React.useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const response = await fetch(`${API_BASE}/review`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch reviews');
        }
        
        // Ensure data is an array before setting reviews
        if (Array.isArray(data)) {
          // Get all reviews (remove the slice limit)
          setReviews(data);
        } else {
          console.error('Reviews data is not an array:', data);
          setReviews([]);
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
        setReviews([]); // Set empty array on error
      } finally {
        setReviewsLoading(false);
      }
    };
    
    fetchReviews();
  }, []);
  
  // Fetch real statistics from database for specific cruise
  const fetchStats = async (cruiseId = null) => {
    try {
      setStatsLoading(true);
      
      console.log('Fetching stats for cruise ID:', cruiseId);
      
      // Fetch all reviews and filter by cruise if cruiseId provided
      const reviewsResponse = await fetch(`${API_BASE}/review`);
      const reviewsData = await reviewsResponse.json();
      
      // Fetch all bookings and filter by cruise if cruiseId provided
      const bookingsResponse = await fetch(`${API_BASE}/booking`);
      const bookingsData = await bookingsResponse.json();
      
      // Ensure we have valid arrays
      const allReviews = Array.isArray(reviewsData) ? reviewsData : [];
      const allBookings = Array.isArray(bookingsData) ? bookingsData : [];
      
      console.log('Total reviews from database:', allReviews.length);
      console.log('Total bookings from database:', allBookings.length);
      
      // Filter by cruise if cruiseId is provided
      const validReviews = cruiseId 
        ? allReviews.filter(review => {
            // Check multiple possible formats for cruiseId
            const reviewCruiseId = review.cruiseId;
            if (!reviewCruiseId) return false;
            
            // Handle both string and object formats
            const reviewCruiseIdStr = reviewCruiseId._id ? reviewCruiseId._id.toString() : reviewCruiseId.toString();
            const targetCruiseIdStr = cruiseId.toString();
            
            console.log('Comparing review cruiseId:', reviewCruiseIdStr, 'with target:', targetCruiseIdStr);
            return reviewCruiseIdStr === targetCruiseIdStr;
          })
        : allReviews;
      
      // For bookings, check if cruiseId field exists, otherwise use all bookings for fallback
      const validBookings = cruiseId 
        ? allBookings.filter(booking => {
            const bookingCruiseId = booking.cruiseId;
            if (!bookingCruiseId) return false;
            
            // Handle both string and object formats
            const bookingCruiseIdStr = bookingCruiseId._id ? bookingCruiseId._id.toString() : bookingCruiseId.toString();
            const targetCruiseIdStr = cruiseId.toString();
            
            console.log('Comparing booking cruiseId:', bookingCruiseIdStr, 'with target:', targetCruiseIdStr);
            return bookingCruiseIdStr === targetCruiseIdStr;
          })
        : allBookings;
      
      console.log('Filtered reviews for cruise:', validReviews.length);
      console.log('Filtered bookings for cruise:', validBookings.length);
      console.log('Booking details:', validBookings.map(b => ({ 
        id: b._id, 
        guests: b.numberOfGuests, 
        cruiseId: b.cruiseId,
        date: b.cruiseDate 
      })));
      
      // Calculate statistics
      const totalReviews = validReviews.length;
      const averageRating = totalReviews > 0 
        ? (validReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews)
        : 4.2; // Default to 4.2 as requested
      
      // Calculate total guests from filtered bookings - only show cruise-specific data
      let totalGuests = 0;
      let totalBookingsFormatted = '0';
      
      if (cruiseId) {
        // We're looking at a specific cruise - only show its bookings
        if (validBookings.length > 0) {
          // We have actual bookings for this specific cruise
          totalGuests = validBookings.reduce((sum, booking) => sum + (booking.numberOfGuests || 1), 0);
          totalBookingsFormatted = totalGuests > 1000 
            ? `${Math.floor(totalGuests / 1000)}k+`
            : `${totalGuests}+`;
          console.log(`Found ${validBookings.length} bookings with ${totalGuests} total guests for this cruise`);
        } else {
          // No bookings found for this specific cruise
          totalBookingsFormatted = '0';
          console.log('No bookings found for this specific cruise');
        }
      } else {
        // No specific cruise selected - show placeholder
        totalBookingsFormatted = '32+';
        console.log('No specific cruise selected, showing default');
      }
      
      console.log('Final stats:', { totalReviews, averageRating, totalBookingsFormatted, totalGuests });
      
      setRealStats({
        totalReviews,
        averageRating: parseFloat(averageRating.toFixed(1)),
        totalBookings: totalBookingsFormatted
      });
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
      // Set default values with 4.2 rating as requested
      setRealStats({
        totalReviews: 5,
        averageRating: 4.2,
        totalBookings: '32+'
      });
    } finally {
      setStatsLoading(false);
    }
  };

  // Fetch real statistics from database
  React.useEffect(() => {
    // Initial load with all cruises data
    fetchStats();
  }, []);

  // Update stats when cruise changes
  React.useEffect(() => {
    if (cruiseData && cruiseData._id) {
      fetchStats(cruiseData._id);
    }
  }, [cruiseData]);
  
  // Fetch package options from API
  React.useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch(`${API_BASE}/package`);
        if (response.ok) {
          const data = await response.json();
          // Transform API data to match the expected format
          const formattedPackages = data.filter(pkg => pkg.isActive).map((pkg, index) => ({
            id: pkg._id,
            name: pkg.name,
            time: pkg.cruisingTime,
            description: pkg.description,
            location: pkg.location,
            selected: index === 0 // Select the first package by default
          }));
          
          setPackageOptions(formattedPackages.length > 0 ? formattedPackages : defaultPackageOptions);
        }
      } catch (error) {
        console.error('Error fetching package options:', error);
        // Fallback to default options if API fails
        setPackageOptions(defaultPackageOptions);
      } finally {
        setPackagesLoading(false);
      }
    };
    
    fetchPackages();
  }, []);

  const handleSubmitReview = async () => {
    console.log('Starting review submission...');
    console.log('User:', user);
    console.log('Cruise data:', cruiseData);
    
    if (!user) {
      setReviewError('Please log in to submit a review');
      setTimeout(() => router.push('/login'), 1500);
      return;
    }
    if (!newReviewComment.trim()) {
      setReviewError('Please enter your review comment');
      return;
    }
    if (!cruiseData || !cruiseData._id) {
      setReviewError('No cruise selected for review');
      return;
    }
    
    const reviewPayload = {
      userId: user._id,
      cruiseId: cruiseData._id,
      rating: newReviewRating,
      comment: newReviewComment.trim(),
    };
    
    console.log('Review payload:', reviewPayload);
    
    setReviewSubmitting(true);
    setReviewError('');
    setReviewSuccess('');
    try {
      const response = await fetch(`${API_BASE}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewPayload)
      });
      
      console.log('Response status:', response.status);
      const created = await response.json();
      console.log('Response data:', created);
      
      if (!response.ok) {
        throw new Error(created.error || 'Failed to submit review');
      }
      // Prepend new review and update stats
      setReviews((prev) => [created, ...prev].slice(0, 3));
      setRealStats((prev) => {
        const newTotal = prev.totalReviews + 1;
        const newAverage = ((prev.averageRating * prev.totalReviews) + newReviewRating) / newTotal;
        return { ...prev, totalReviews: newTotal, averageRating: parseFloat(newAverage.toFixed(1)) };
      });
      setReviewSuccess('Thank you! Your review has been submitted.');
      setNewReviewComment('');
      setNewReviewRating(5);
    } catch (err) {
      setReviewError(err.message || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleBooking = async () => {
    console.log('Starting booking submission...');
    console.log('User:', user);
    
    if (!user) {
      setBookingError('Please log in to make a booking');
      setTimeout(() => router.push('/login'), 2000);
      return;
    }

    if (!selectedDate) {
      setBookingError('Please select a date for your cruise');
      return;
    }

    if (numberOfGuests < 1) {
      setBookingError('Please select at least 1 guest');
      return;
    }

    setBookingLoading(true);
    setBookingError('');
    setBookingSuccess('');

    // Find the selected package
    const selectedPackageData = packageOptions.find(pkg => pkg.id === selectedPackage) || packageOptions[0];
    
    const bookingPayload = {
      userId: user._id,
      cruiseId: cruiseData._id,
      cruiseDate: selectedDate,
      numberOfGuests: numberOfGuests,
      packageType: selectedPackageData.name,
      cruisingTime: selectedPackageData.time,
    };
    
    console.log('Booking payload:', bookingPayload);

    try {
      const response = await fetch(`${API_BASE}/booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingPayload),
      });

      console.log('Booking response status:', response.status);
      const data = await response.json();
      console.log('Booking response data:', data);

      if (response.ok) {
        setBookingSuccess('Booking confirmed! Your cruise is reserved.');
        // Reset form
        setSelectedDate('');
        setNumberOfGuests(1);
        setTimeout(() => {
          setBookingSuccess('');
          router.push('/profile');
        }, 3000);
      } else {
        setBookingError(data.error || 'Failed to create booking');
      }
    } catch (error) {
      setBookingError('Failed to create booking. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {cruiseLoading || !cruiseData ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <Typography>Loading cruise information...</Typography>
        </Box>
      ) : (
        <>
          {/* Header Section */}
          <Box>
            <Typography variant="h3" gutterBottom>
              {cruiseData?.title || 'Emerald River Cruise in Bangkok'}
            </Typography>
            
            {/* Description */}
            {cruiseData?.description && (
              <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
                {cruiseData.description}
              </Typography>
            )}
            
            {/* Feature tags */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <Chip label={cruiseData?.tag || 'Bangkok'} color="primary" size="small" />
              {(cruiseData?.features || ['English', 'Join in group', 'Meet at location']).map((feature, index) => (
                <Chip key={index} label={feature} variant="outlined" size="small" />
              ))}
            </Box>

            {/* Duration, Rating, Bookings, and Location */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
              {/* Duration */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {cruiseData?.duration || '1hr 30min - 5hr 30min'}
                </Typography>
              </Box>

              {/* Rating */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <StarIcon sx={{ fontSize: 16, color: 'gold' }} />
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {statsLoading ? (cruiseData?.rating || 4.5) : realStats.averageRating}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ({statsLoading ? (cruiseData?.totalReviews || 16500).toLocaleString() : realStats.totalReviews.toLocaleString()} reviews)
                </Typography>
              </Box>

              {/* Location */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="body2" color="text.secondary">
                  📍 {cruiseData?.location || 'Bangkok'}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Main Image with Navigation Arrows */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3, gap: 2 }}>
            {/* Previous Arrow */}
            <IconButton
              onClick={goToPreviousCruise}
              disabled={allCruises.length <= 1}
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                },
                '&:disabled': {
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                  color: 'rgba(255, 255, 255, 0.3)',
                }
              }}
            >
              <ArrowBackIosIcon />
            </IconButton>

            {/* Main Image */}
            <CardMedia
              component="img"
              alt={cruiseData?.title || 'Cruise Image'}
              image={selectedImage}
              sx={{
                width: '100%',
                maxWidth: '800px',
                height: 400,
                borderRadius: 2,
                objectFit: 'cover'
              }}
            />

            {/* Next Arrow */}
            <IconButton
              onClick={goToNextCruise}
              disabled={allCruises.length <= 1}
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                },
                '&:disabled': {
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                  color: 'rgba(255, 255, 255, 0.3)',
                }
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>

          {/* Cruise Navigation Indicator */}
          {allCruises.length > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {currentCruiseIndex + 1} of {allCruises.length} cruises
              </Typography>
            </Box>
          )}

          {/* Image Gallery - Centered */}
          <Box sx={{ display: 'flex', gap: 1, mb: 3, overflow: 'auto', justifyContent: 'center' }}>
            {(() => {
              // Combine main image and gallery images
              const allImages = [];
              if (cruiseData?.images?.main) {
                allImages.push(cruiseData.images.main);
              }
              if (cruiseData?.images?.gallery) {
                allImages.push(...cruiseData.images.gallery);
              }
              // Fallback images if no cruise data
              if (allImages.length === 0) {
                allImages.push('/img/wp1.png', '/img/wp2.png', '/img/wp3.png', '/img/wp4.png', '/img/wp5.png');
              }
              
              return allImages.map((img, index) => (
                <CardMedia
                  key={index}
                  component="img"
                  alt={`Gallery ${index + 1}`}
                  image={img}
                  onClick={() => setSelectedImage(img)}
                  sx={{
                    width: 120,
                    height: 80,
                    borderRadius: 1,
                    objectFit: 'cover',
                    cursor: 'pointer',
                    outline: selectedImage === img ? '2px solid orange' : 'none'
                  }}
                />
              ));
            })()}
          </Box>

          <Grid container spacing={4} sx={{ alignItems: 'center' }}>
            {/* Left Column - Highlights */}
            <Grid item xs={12} md={8}>
              {/* Highlights */}
              <Card sx={{ mb: 3, backgroundColor: '#f8f9fa' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Cruise Highlights
                  </Typography>
                  {(showMoreHighlights ? 
                    (cruiseData?.highlights || []) : 
                    (cruiseData?.highlights || []).slice(0, 2)
                  ).map((highlight, index) => (
                    <Typography key={index} variant="body2" sx={{ mb: 1, display: 'flex', alignItems: 'flex-start' }}>
                      <StarIcon sx={{ color: 'orange', mr: 1, mt: 0.2, fontSize: 16 }} />
                      {highlight}
                    </Typography>
                  ))}
                  {cruiseData?.highlights && cruiseData.highlights.length > 2 && (
                    <Button 
                      size="small" 
                      sx={{ mt: 1 }}
                      onClick={() => setShowMoreHighlights(!showMoreHighlights)}
                    >
                      {showMoreHighlights ? 'See less' : 'See more'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Right Column - Booking Section */}
            <Grid item xs={12} md={4} id="booking">
              <Card sx={{ position: 'sticky', top: 20 }}>
                <CardContent>
                  {/* Cruise Navigation for Booking */}
                  {allCruises.length > 1 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
                      <IconButton
                        onClick={goToPreviousCruise}
                        size="small"
                        sx={{
                          backgroundColor: 'primary.main',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'primary.dark',
                          }
                        }}
                      >
                        <ArrowBackIosIcon fontSize="small" />
                      </IconButton>
                      <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
                        Cruise {currentCruiseIndex + 1} of {allCruises.length}
                      </Typography>
                      <IconButton
                        onClick={goToNextCruise}
                        size="small"
                        sx={{
                          backgroundColor: 'primary.main',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'primary.dark',
                          }
                        }}
                      >
                        <ArrowForwardIosIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                  
                  {/* Price */}
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
                      {cruiseData?.title || ''}
                    </Typography>
                    <Typography variant="h4" color="primary">
                      {cruiseData?.currency || 'THB'}฿{cruiseData?.price || 899.99}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      per person
                    </Typography>
                  </Box>

              {/* Package Options */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: 4, height: 20, backgroundColor: 'orange', mr: 1 }} />
                  Package options
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Please select a participation date
                  </Typography>
                  <TextField
                    fullWidth
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ min: new Date().toISOString().split('T')[0] }}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Number of Guests
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    value={numberOfGuests}
                    onChange={(e) => setNumberOfGuests(parseInt(e.target.value) || 1)}
                    size="small"
                    inputProps={{ min: 1, max: 20 }}
                  />
                </Box>

                <Typography variant="body2" gutterBottom>
                  Package type
                </Typography>
                {packageOptions.map((option) => (
                  <Button
                    key={option.id}
                    fullWidth
                    variant={selectedPackage === option.id ? "contained" : "outlined"}
                    sx={{ 
                      mb: 1, 
                      textAlign: 'left',
                      justifyContent: 'flex-start',
                      backgroundColor: selectedPackage === option.id ? 'orange' : 'transparent',
                      '&:hover': {
                        backgroundColor: selectedPackage === option.id ? 'darkorange' : 'rgba(255,165,0,0.1)'
                      }
                    }}
                    onClick={() => setSelectedPackage(option.id)}
                  >
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {option.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.description}
                      </Typography>
                    </Box>
                  </Button>
                ))}

                {/* Booking Messages */}
                {bookingError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {bookingError}
                  </Alert>
                )}

                {bookingSuccess && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    {bookingSuccess}
                  </Alert>
                )}

                {/* Confirm Booking Button */}
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={bookingLoading || !selectedDate}
                  onClick={handleBooking}
                  sx={{ 
                    mt: 2, 
                    backgroundColor: 'green', 
                    '&:hover': { backgroundColor: 'darkgreen' },
                    '&:disabled': { backgroundColor: 'grey.300' }
                  }}
                >
                  {bookingLoading ? 'Confirming Booking...' : 'Confirm Booking'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Customer Reviews Section */}
      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5">
            Customer Reviews
          </Typography>
          {/* Cruise Navigation for Reviews */}
          {allCruises.length > 1 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
              <IconButton
                onClick={goToPreviousCruise}
                size="small"
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  }
                }}
              >
                <ArrowBackIosIcon fontSize="small" />
              </IconButton>
              <Typography variant="caption" color="text.secondary" sx={{ minWidth: '80px', textAlign: 'center' }}>
                Cruise {currentCruiseIndex + 1} of {allCruises.length}
              </Typography>
              <IconButton
                onClick={goToNextCruise}
                size="small"
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  }
                }}
              >
                <ArrowForwardIosIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>
        
        {/* Add Review Form */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            {user ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Write a Review for {cruiseData?.title}
                </Typography>
                {reviewError && (
                  <Alert severity="error">{reviewError}</Alert>
                )}
                {reviewSuccess && (
                  <Alert severity="success">{reviewSuccess}</Alert>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2">Your rating:</Typography>
                  <Rating
                    value={newReviewRating}
                    onChange={(_, value) => setNewReviewRating(value || 5)}
                  />
                </Box>
                <TextField
                  label="Share your experience"
                  placeholder="Write your review here..."
                  multiline
                  minRows={3}
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    onClick={handleSubmitReview}
                    disabled={reviewSubmitting}
                  >
                    {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                <Typography variant="body2">Please log in to write a review.</Typography>
                <Button variant="outlined" component={Link} href="/login">Log in</Button>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Reviews Display */}
        {reviewsLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <Typography>Loading reviews...</Typography>
          </Box>
        ) : reviews.length > 0 ? (
          <Box>
            {/* Filter Toggle Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
              <Button
                variant={!showAllReviews ? "contained" : "outlined"}
                onClick={() => setShowAllReviews(false)}
                size="small"
              >
                This Cruise ({(() => {
                  const currentCruiseReviews = reviews.filter(review => 
                    review.cruiseId && cruiseData && review.cruiseId._id === cruiseData._id
                  );
                  return currentCruiseReviews.length;
                })()})
              </Button>
              <Button
                variant={showAllReviews ? "contained" : "outlined"}
                onClick={() => setShowAllReviews(true)}
                size="small"
              >
                All Reviews ({reviews.length})
              </Button>
            </Box>

            <Grid container spacing={2}>
              {(() => {
                // Filter reviews based on showAllReviews state
                const filteredReviews = showAllReviews 
                  ? reviews 
                  : reviews.filter(review => 
                      review.cruiseId && cruiseData && review.cruiseId._id === cruiseData._id
                    );

                // Show message if no reviews for current cruise
                if (!showAllReviews && filteredReviews.length === 0) {
                  return (
                    <Grid item xs={12}>
                      <Box sx={{ textAlign: 'center', p: 3 }}>
                        <Typography variant="body1" color="text.secondary">
                          No reviews yet for this cruise. Be the first to share your experience!
                        </Typography>
                      </Box>
                    </Grid>
                  );
                }

                return filteredReviews.map((review) => (
                  <Grid item xs={12} md={4} key={review._id}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        {/* Cruise Information */}
                        {review.cruiseId && (
                          <Box sx={{ mb: 2, p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
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
                              <Typography variant="caption" color="primary" sx={{ fontWeight: 'bold' }}>
                                📍 {review.cruiseId.title}
                              </Typography>
                            </Box>
                          </Box>
                        )}
                        
                        {/* User Info and Rating */}
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                            {review.userId?.name ? review.userId.name.charAt(0).toUpperCase() : '?'}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2">{review.userId?.name || 'Anonymous'}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Rating value={review.rating} readOnly size="small" />
                              <Typography variant="caption" color="text.secondary">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                        
                        {/* Review Comment */}
                        <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                          {review.comment}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ));
              })()}
            </Grid>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', p: 3 }}>
            <Typography variant="body1" color="text.secondary">
              No reviews yet. Be the first to share your experience!
            </Typography>
          </Box>
        )}
      </Box>
        </>
      )}
    </Box>
  );
}
