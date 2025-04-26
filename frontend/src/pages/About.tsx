// src/pages/About.tsx
import React, { useEffect, useRef } from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, Avatar, Button, Divider } from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import SportsFootballIcon from '@mui/icons-material/SportsFootball';
import SportsBaseballIcon from '@mui/icons-material/SportsBaseball';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import MicExternalOnIcon from '@mui/icons-material/MicExternalOn';
import PoolIcon from '@mui/icons-material/Pool'; // For billiards
import TvIcon from '@mui/icons-material/Tv';
import { motion } from 'framer-motion';

// Import custom CSS
import '../styles/pages/aboutpage.css';

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionGrid = motion(Grid);

const AboutPage: React.FC = () => {
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add subtle background animation if needed
  }, []);

  const features = [
    {
      title: "Pro Billiards Tables",
      description: "Championship-quality tables for casual games and serious players. Weekly tournaments with cash prizes!",
      icon: <PoolIcon fontSize="large" />,
      color: "#e63946",
    },
    {
      title: "Private Karaoke Rooms",
      description: "Sound-proof rooms with premium systems and 50,000+ songs. Book online for special occasion packages!",
      icon: <MicExternalOnIcon fontSize="large" />,
      color: "#457b9d",
    },
    {
      title: "Live Sports Viewing",
      description: "15+ HD screens showing NBA, NFL, MLB, Premier League, UFC, and more. Never miss a game!",
      icon: <TvIcon fontSize="large" />,
      color: "#2a9d8f",
    },
    {
      title: "Premium Bar Service",
      description: "Craft beer selection, signature cocktails, and happy hour specials daily from 4-7pm.",
      icon: <SportsBarIcon fontSize="large" />,
      color: "#f4a261",
    }
  ];

  const teamMembers = [
    {
      name: "John Smith",
      position: "Owner & Founder",
      bio: "Former college basketball player with a passion for building the ultimate sports viewing experience.",
      image: "https://placehold.co/600x400", 
      socialMedia: {
        twitter: "johnsmith",
        instagram: "john.stopshot"
      }
    },
    {
      name: "Maria Garcia",
      position: "General Manager",
      bio: "15 years in hospitality management. Maria ensures every game day is perfectly executed.",
      image: "https://placehold.co/600x400",
      socialMedia: {
        twitter: "mariagarcia",
        instagram: "maria.stopshot"
      }
    },
    {
      name: "David Lee",
      position: "Head Bartender",
      bio: "Mixology champion creating our signature 'Slam Dunk' and 'Home Run' cocktails.",
      image: "https://placehold.co/600x400",
      socialMedia: {
        twitter: "davidlee",
        instagram: "david.stopshot"
      }
    }
  ];

  return (
    <Box className="about-page-container">
      <Box className="hero-section">
        <Container maxWidth="lg">
          <MotionGrid 
            container 
            spacing={4} 
            alignItems="center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Grid item xs={12} md={6}>
              <MotionTypography 
                variant="h2" 
                component="h1" 
                className="page-title"
                initial={{ x: -50 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5 }}
              >
                THE ULTIMATE <span className="highlight-text">SPORTS</span> EXPERIENCE
              </MotionTypography>
              <Typography variant="h5" className="tagline">
                Where Fans, Friends & Great Times Connect
              </Typography>
              <Box mt={4} className="sports-icons">
                <SportsBasketballIcon className="sports-icon basketball" />
                <SportsFootballIcon className="sports-icon football" />
                <SportsSoccerIcon className="sports-icon soccer" />
                <SportsBaseballIcon className="sports-icon baseball" />
              </Box>
              <Button variant="contained" className="cta-button" size="large" sx={{ mt: 4 }}>
                Book a Table
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <MotionBox 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="hero-image-container"
              >
                <Box
                  component="img"
                  className="hero-image"
                  alt="StopShot Sports Bar"
                  src="/hero/outside.png"
                />
              </MotionBox>
            </Grid>
          </MotionGrid>
        </Container>
      </Box>

      <Box className="story-section">
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={5}>
              <Box className="story-image-grid">
                <Box 
                  component="img" 
                  className="story-image main"
                  src="/about/interior.png" 
                  alt="Bar Interior" 
                />
                <Box 
                  component="img" 
                  className="story-image overlay-1"
                  src="/about/show.png" 
                  alt="Sports Fans" 
                />
                <Box 
                  component="img" 
                  className="story-image overlay-2"
                  src="/about/billiards.png" 
                  alt="Billiards Table" 
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={7}>
              <Typography variant="h3" className="section-title">
                Our Story
              </Typography>
              <Divider className="section-divider" />
              <Typography variant="body1" paragraph className="story-text">
                <span className="first-letter">F</span>ounded in 2020 during challenging times, StopShot was born from a dream to create Manila's premier sports destination. What began as a small viewing bar with two pool tables has evolved into the go-to sports entertainment venue in Mandaluyong City.
              </Typography>
              <Typography variant="body1" paragraph className="story-text">
                Our passion for sports runs deep. From showing every major sporting event on our state-of-the-art screens to hosting regional billiards tournaments, we've created a haven for sports enthusiasts and casual fans alike.
              </Typography>
              <Typography variant="body1" paragraph className="story-text">
                Whether you're cheering on your favorite team, challenging friends to a game of pool, or enjoying our signature gameday menu – at StopShot, you're not just a customer, you're part of our growing family of fans.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box className="features-section" ref={featuresRef}>
        <Container maxWidth="lg">
          <Typography variant="h3" className="section-title text-center">
            THE STOPSHOT EXPERIENCE
          </Typography>
          <Typography variant="subtitle1" className="section-subtitle text-center">
            Everything you need for the perfect game day
          </Typography>
          <Grid container spacing={3} mt={5}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <MotionBox
                  whileHover={{ y: -10, transition: { duration: 0.2 } }}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="feature-card">
                    <Box className="feature-icon-container" sx={{ bgcolor: feature.color }}>
                      {feature.icon}
                    </Box>
                    <CardContent>
                      <Typography variant="h5" component="h3" className="feature-title">
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" className="feature-description">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </MotionBox>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box className="atmosphere-section">
        <Container maxWidth="lg">
          <Grid container spacing={2}>
            {['bar.png', 'billiards.png', 'outside.png', 'karaoke.png', 'show.png'].map((image, index) => (
              <Grid item xs={6} md={4} lg={index === 0 ? 6 : 3} key={index}>
                <Box 
                  className={`atmosphere-image ${index === 0 ? 'large' : ''}`}
                  component="img"
                  src={`/gallery/${image}`}
                  alt={`Sports Bar Atmosphere ${index + 1}`}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box className="team-section">
        <Container maxWidth="lg">
          <Typography variant="h3" className="section-title text-center">
            THE ROSTER
          </Typography>
          <Typography variant="subtitle1" className="section-subtitle text-center">
            Meet the all-stars behind StopShot
          </Typography>
          <Grid container spacing={4} justifyContent="center" mt={4}>
            {teamMembers.map((person, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <MotionBox
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Card className="team-card">
                    <Box className="team-member-image-container">
                      <Box 
                        component="img" 
                        src={person.image} 
                        alt={person.name}
                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${person.name.replace(' ', '+')}&background=d38236&color=fff&size=200`;
                        }}
                        className="team-member-image"
                      />
                    </Box>
                    <CardContent className="team-member-content">
                      <Typography variant="h5" className="team-member-name">{person.name}</Typography>
                      <Typography variant="subtitle1" className="team-member-position">
                        {person.position}
                      </Typography>
                      <Typography variant="body2" className="team-member-bio">
                        {person.bio}
                      </Typography>
                      <Box className="social-links">
                        {/* Social icons would go here */}
                      </Box>
                    </CardContent>
                  </Card>
                </MotionBox>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box className="testimonials-section">
        <Container maxWidth="md">
          <Box className="testimonial-card">
            <Typography variant="h5" className="testimonial-text">
              "The atmosphere during big games is incredible! Best place to watch sports in the city, hands down. The billiards tables are top-notch too!"
            </Typography>
            <Box className="testimonial-author">
              <Typography variant="subtitle1">- Mike R., Regular since 2021</Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Box className="cta-section">
        <Container maxWidth="md">
          <Box textAlign="center">
            <Typography variant="h3" className="cta-title">
              Come Join the Fun!
            </Typography>
            <Typography variant="h6" className="cta-subtitle">
              Open daily 4PM - 2AM • Happy Hour 4-7PM
            </Typography>
            <Button variant="contained" className="cta-button" size="large" sx={{ mt: 3 }}>
              Reserve Your Spot
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default AboutPage;