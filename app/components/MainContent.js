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
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupIcon from '@mui/icons-material/Group';
import LanguageIcon from '@mui/icons-material/Language';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarIcon from '@mui/icons-material/Star';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';
import Link from 'next/link';

const cruiseData = {
  img: 'https://picsum.photos/800/450?random=1',
  tag: 'Bangkok',
  title: 'Chao Phraya Princess Cruise in Bangkok',
  rating: 4.5,
  reviews: 16500,
  booked: 400000,
  duration: '1hr 30min - 5hr 30min',
  price: 27.99,
  currency: 'US$',
  location: 'Bangkok',
  features: ['English', 'Join in group', 'Meet at location'],
  highlights: [
    'View historic Bangkok landmarks, such as Wat Kanlaya, Wat Arun and Grand Palace, on a grand cruise ride',
    'Feast on a 2-hour dinner buffet, a fusion of different cuisines from all over the world'
  ],
  gallery: [
    'https://picsum.photos/300/200?random=1',
    'https://picsum.photos/300/200?random=2',
    'https://picsum.photos/300/200?random=3',
    'https://picsum.photos/300/200?random=4',
    'https://picsum.photos/300/200?random=5',
  ]
};

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

const packageDetails = [
  'Book now for today',
  'Free cancellation (24 hours notice)',
  'Valid on the selected date',
  'Instant confirmation'
];

const sampleReviews = [
  {
    id: 1,
    name: 'Sarah Johnson',
    rating: 5,
    date: '2 days ago',
    comment: 'Amazing experience! The sunset views were breathtaking and the food was delicious. Highly recommend!',
    avatar: 'https://picsum.photos/40/40?random=10'
  },
  {
    id: 2,
    name: 'Michael Chen',
    rating: 4,
    date: '1 week ago',
    comment: 'Great cruise with beautiful views of Bangkok. The buffet had good variety. Staff was friendly and helpful.',
    avatar: 'https://picsum.photos/40/40?random=11'
  },
  {
    id: 3,
    name: 'Emma Rodriguez',
    rating: 5,
    date: '2 weeks ago',
    comment: 'Perfect romantic evening! The city lights were magical. Will definitely book again for special occasions.',
    avatar: 'https://picsum.photos/40/40?random=12'
  }
];

const SyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: 0,
  height: '100%',
  backgroundColor: (theme.vars || theme).palette.background.paper,
  '&:hover': {
    backgroundColor: 'transparent',
    cursor: 'pointer',
  },
  '&:focus-visible': {
    outline: '3px solid',
    outlineColor: 'hsla(210, 98%, 48%, 0.5)',
    outlineOffset: '2px',
  },
}));

const SyledCardContent = styled(CardContent)({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  padding: 16,
  flexGrow: 1,
  '&:last-child': {
    paddingBottom: 16,
  },
});

const StyledTypography = styled(Typography)({
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

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
  const [selectedPackage, setSelectedPackage] = React.useState(1);
  const [selectedDate, setSelectedDate] = React.useState('');
  const [numberOfGuests, setNumberOfGuests] = React.useState(1);
  const [bookingLoading, setBookingLoading] = React.useState(false);
  const [bookingSuccess, setBookingSuccess] = React.useState('');
  const [bookingError, setBookingError] = React.useState('');
  const [reviews, setReviews] = React.useState([]);
  const [reviewsLoading, setReviewsLoading] = React.useState(true);
  const [packageOptions, setPackageOptions] = React.useState(defaultPackageOptions);
  const [packagesLoading, setPackagesLoading] = React.useState(true);
  
  const { user } = useAuth();
  const router = useRouter();
  
  // Fetch real reviews from the API
  React.useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const response = await fetch('/api/review');
        const data = await response.json();
        
        // Get the 3 most recent reviews
        const recentReviews = data.slice(0, 3);
        setReviews(recentReviews);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      } finally {
        setReviewsLoading(false);
      }
    };
    
    fetchReviews();
  }, []);
  
  // Fetch package options from API
  React.useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('/api/package');
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

  const handleBooking = async () => {
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

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: user._id,
          cruiseDate: selectedDate,
          numberOfGuests: numberOfGuests,
          packageType: selectedPackageData.name,
          cruisingTime: selectedPackageData.time,
        }),
      });

      const data = await response.json();

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
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom>
          {cruiseData.title}
        </Typography>
        
        {/* Feature Tags */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          {cruiseData.features.map((feature, index) => (
            <Chip 
              key={index} 
              label={feature} 
              size="small" 
              variant="outlined"
              icon={feature === 'English' ? <LanguageIcon /> : feature === 'Join in group' ? <GroupIcon /> : <LocationOnIcon />}
            />
          ))}
          <Chip 
            label={cruiseData.duration} 
            size="small" 
            variant="outlined"
            icon={<AccessTimeIcon />}
          />
        </Box>

        {/* Rating and Stats */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Rating value={cruiseData.rating} readOnly size="small" />
            <Typography variant="body2">
              {cruiseData.rating}/5 ({cruiseData.reviews.toLocaleString()} reviews)
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {cruiseData.booked.toLocaleString()}+ booked
          </Typography>
          <Chip label={cruiseData.location} size="small" />
          <IconButton size="small">
            <FavoriteBorderIcon />
          </IconButton>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Left Column - Images and Highlights */}
        <Grid item xs={12} md={8}>
          {/* Main Image */}
          <Box sx={{ position: 'relative', mb: 2 }}>
            <CardMedia
              component="img"
              alt="Bangkok River Cruise"
              image={cruiseData.img}
              sx={{
                width: '100%',
                height: 400,
                borderRadius: 2,
                objectFit: 'cover'
              }}
            />
            <IconButton
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'rgba(0,0,0,0.6)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.8)',
                }
              }}
            >
              <PlayArrowIcon fontSize="large" />
            </IconButton>
          </Box>

          {/* Image Gallery */}
          <Box sx={{ display: 'flex', gap: 1, mb: 3, overflow: 'auto' }}>
            {cruiseData.gallery.map((img, index) => (
              <CardMedia
                key={index}
                component="img"
                alt={`Gallery ${index + 1}`}
                image={img}
                sx={{
                  width: 120,
                  height: 80,
                  borderRadius: 1,
                  objectFit: 'cover',
                  cursor: 'pointer'
                }}
              />
            ))}
            <Button variant="outlined" size="small" sx={{ minWidth: 120 }}>
              Gallery
            </Button>
          </Box>

          {/* Highlights */}
          <Card sx={{ mb: 3, backgroundColor: '#f8f9fa' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Cruise Highlights
              </Typography>
              {cruiseData.highlights.map((highlight, index) => (
                <Typography key={index} variant="body2" sx={{ mb: 1, display: 'flex', alignItems: 'flex-start' }}>
                  <StarIcon sx={{ color: 'orange', mr: 1, mt: 0.2, fontSize: 16 }} />
                  {highlight}
                </Typography>
              ))}
              <Button size="small" sx={{ mt: 1 }}>
                See more
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Booking Section */}
        <Grid item xs={12} md={4} id="booking">
          <Card sx={{ position: 'sticky', top: 20 }}>
            <CardContent>
              {/* Price */}
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h4" color="primary">
                  {cruiseData.currency} {cruiseData.price}
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

              {/* Package Details */}
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="body2">Package details</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {packageDetails.map((detail, index) => (
                      <Chip 
                        key={index} 
                        label={detail} 
                        size="small" 
                        variant="outlined"
                        sx={{ alignSelf: 'flex-start' }}
                      />
                    ))}
                  </Box>
                </AccordionDetails>
              </Accordion>

              {/* Itinerary */}
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="body2">Itinerary</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTimeIcon fontSize="small" />
                    <Typography variant="body2">
                      From 16:00 • Departure
                    </Typography>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Customer Reviews */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Customer Reviews
        </Typography>
        {reviewsLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <Typography>Loading reviews...</Typography>
          </Box>
        ) : reviews.length > 0 ? (
          <Grid container spacing={2}>
            {reviews.map((review) => (
              <Grid item xs={12} md={4} key={review._id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                        {review.customerId?.name ? review.customerId.name.charAt(0).toUpperCase() : '?'}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2">{review.customerId?.name || 'Anonymous'}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Rating value={review.rating} readOnly size="small" />
                          <Typography variant="caption" color="text.secondary">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Typography variant="body2">
                      {review.comment}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', p: 3 }}>
            <Typography variant="body1">No reviews yet. Be the first to share your experience!</Typography>
          </Box>
        )}
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button 
            variant="outlined"
            component={Link}
            href="/reviews"
          >
            View All Reviews
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
