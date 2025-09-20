'use client';

import * as React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';

const articleInfo = [
  {
    tag: 'Special Offers',
    title: 'Last-Minute Caribbean Cruise Deals - Save up to 60%',
    description:
      'Book now and save big on our remaining Caribbean cruise inventory. Limited-time offers on luxury suites and ocean-view cabins departing this month.',
    authors: [
      { name: 'Captain Rodriguez', avatar: '/static/images/avatar/1.jpg' },
      { name: 'Sarah Deals', avatar: '/static/images/avatar/2.jpg' },
    ],
  },
  {
    tag: 'New Routes',
    title: 'Introducing Our New Mediterranean Explorer Route',
    description:
      'Discover hidden gems of the Mediterranean with our new 14-day route featuring exclusive ports in Croatia, Montenegro, and hidden Italian coastal towns.',
    authors: [{ name: 'Marco Venetian', avatar: '/static/images/avatar/6.jpg' }],
  },
  {
    tag: 'Ships',
    title: 'Meet Our Newest Ship: Ocean Majesty',
    description:
      'Step aboard our latest addition to the fleet. Ocean Majesty features revolutionary design, world-class dining, and exclusive amenities for the ultimate cruise experience.',
    authors: [{ name: 'Emma Navigator', avatar: '/static/images/avatar/7.jpg' }],
  },
  {
    tag: 'Destinations',
    title: 'Alaska\'s Glacier Bay: A Once-in-a-Lifetime Experience',
    description:
      'Experience the breathtaking beauty of Glacier Bay National Park. Watch glaciers calve into the sea while enjoying expert naturalist commentary.',
    authors: [{ name: 'Jack Wilderness', avatar: '/static/images/avatar/3.jpg' }],
  },
  {
    tag: 'Family',
    title: 'New Kids Club Programs for 2025',
    description:
      'Enhanced kids club programs featuring STEM activities, marine biology workshops, and age-appropriate entertainment that makes learning fun at sea.',
    authors: [
      { name: 'Lisa Family', avatar: '/static/images/avatar/4.jpg' },
      { name: 'Tom Activities', avatar: '/static/images/avatar/5.jpg' },
    ],
  },
  {
    tag: 'Dining',
    title: 'Celebrity Chef Partnership Brings Fine Dining to Sea',
    description:
      'Experience world-class cuisine with our new celebrity chef partnerships. Enjoy exclusive specialty restaurants and culinary experiences on select ships.',
    authors: [{ name: 'Chef Antonio', avatar: '/static/images/avatar/2.jpg' }],
  },
  {
    tag: 'Sustainability',
    title: 'Our Commitment to Ocean Conservation',
    description:
      'Learn about our environmental initiatives including advanced wastewater treatment, reduced emissions, and partnerships with marine conservation organizations.',
    authors: [
      { name: 'Dr. Green Ocean', avatar: '/static/images/avatar/4.jpg' },
      { name: 'Maya Eco', avatar: '/static/images/avatar/5.jpg' },
    ],
  },
  {
    tag: 'Technology',
    title: 'New Mobile App Features for Enhanced Cruise Experience',
    description:
      'Download our updated app featuring real-time ship location, digital room keys, restaurant reservations, and personalized daily itineraries.',
    authors: [{ name: 'Tech Navigator', avatar: '/static/images/avatar/2.jpg' }],
  },
  {
    tag: 'Excursions',
    title: 'Exclusive Shore Excursions for Adventure Seekers',
    description:
      'Discover new adventure excursions including helicopter tours over glaciers, swimming with dolphins, and exclusive archaeological site visits.',
    authors: [{ name: 'Adventure Kate', avatar: '/static/images/avatar/7.jpg' }],
  },
  {
    tag: 'Luxury',
    title: 'The Suite Life: Ultimate Luxury at Sea',
    description:
      'Experience unparalleled luxury in our newly renovated suites featuring private balconies, butler service, and exclusive suite-only amenities.',
    authors: [{ name: 'Luxury Concierge', avatar: '/static/images/avatar/3.jpg' }],
  },
];

const StyledTypography = styled(Typography)({
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

const TitleTypography = styled(Typography)(({ theme }) => ({
  position: 'relative',
  textDecoration: 'none',
  '&:hover': { cursor: 'pointer' },
  '& .arrow': {
    visibility: 'hidden',
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: 'translateY(-50%)',
  },
  '&:hover .arrow': {
    visibility: 'visible',
    opacity: 0.7,
  },
  '&:focus-visible': {
    outline: '3px solid',
    outlineColor: 'hsla(210, 98%, 48%, 0.5)',
    outlineOffset: '3px',
    borderRadius: '8px',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    width: 0,
    height: '1px',
    bottom: 0,
    left: 0,
    backgroundColor: (theme.vars || theme).palette.text.primary,
    opacity: 0.3,
    transition: 'width 0.3s ease, opacity 0.3s ease',
  },
  '&:hover::before': {
    width: '100%',
  },
}));

function Author({ authors }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 2,
        alignItems: 'center',
        justifyContent: 'space-between',
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

export default function Latest() {
  const [focusedCardIndex, setFocusedCardIndex] = React.useState(null);

  const handleFocus = (index) => {
    setFocusedCardIndex(index);
  };

  const handleBlur = () => {
    setFocusedCardIndex(null);
  };

  return (
    <div>
      <Typography variant="h2" gutterBottom>
        Latest Cruise News & Deals
      </Typography>
      <Grid container spacing={8} columns={12} sx={{ my: 4 }}>
        {articleInfo.map((article, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 1,
                height: '100%',
              }}
            >
              <Typography gutterBottom variant="caption" component="div">
                {article.tag}
              </Typography>
              <TitleTypography
                gutterBottom
                variant="h6"
                onFocus={() => handleFocus(index)}
                onBlur={handleBlur}
                tabIndex={0}
                className={focusedCardIndex === index ? 'Mui-focused' : ''}
              >
                {article.title}
                <NavigateNextRoundedIcon
                  className="arrow"
                  sx={{ fontSize: '1rem' }}
                />
              </TitleTypography>
              <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                {article.description}
              </StyledTypography>

              <Author authors={article.authors} />
            </Box>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 4 }}>
        <Pagination hidePrevButton hideNextButton count={10} boundaryCount={10} />
      </Box>
    </div>
  );
}
