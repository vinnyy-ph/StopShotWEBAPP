import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  Container,
  Tab, 
  Tabs,
  Chip, 
  Divider,
  IconButton,
  Badge
} from '@mui/material';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import TapasIcon from '@mui/icons-material/Tapas';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import StarIcon from '@mui/icons-material/Star';
import '../styles/pages/menupage.css';

// Enhanced menu data structure
const menuData = [
  {
    category: 'Appetizers',
    icon: <TapasIcon />,
    description: 'Perfect for sharing while watching the game',
    items: [
      {
        name: 'Loaded Nachos Supreme',
        description: 'Crispy tortilla chips smothered in cheese, jalapeños, guacamole, and pulled pork',
        price: '$14',
        image: 'https://placehold.co/300x200',
        popular: true,
        spicy: true
      },
      {
        name: 'Championship Wings',
        description: 'Choose from 6 signature sauces - from mild to "challenge the ref" hot',
        price: '$16',
        image: 'https://placehold.co/300x200',
        popular: true,
        spicy: true
      },
      {
        name: 'MVP Quesadillas',
        description: 'Grilled tortillas stuffed with cheese, chicken, peppers and our signature sauce',
        price: '$12',
        image: 'https://placehold.co/300x200'
      },
      {
        name: 'Slam Dunk Sliders',
        description: 'Three mini burgers with different toppings - bacon, cheese, and BBQ',
        price: '$13.50',
        image: 'https://placehold.co/300x200',
        popular: true
      },
    ]
  },
  {
    category: 'Main Event',
    icon: <LunchDiningIcon />,
    description: 'Heavy hitters that satisfy those game day cravings',
    items: [
      {
        name: 'Overtime Burger',
        description: 'Double beef patty, bacon, cheese, caramelized onions, and secret sauce on a brioche bun',
        price: '$17.99',
        image: 'https://placehold.co/300x200',
        popular: true
      },
      {
        name: 'Three-Point Chicken Sandwich',
        description: 'Crispy fried chicken breast with spicy mayo, pickles, and slaw',
        price: '$15.99',
        image: 'https://placehold.co/300x200'
      },
      {
        name: 'Grand Slam Ribs',
        description: 'Fall-off-the-bone BBQ ribs served with fries and homemade coleslaw',
        price: '$22.99',
        image: 'https://placehold.co/300x200',
        popular: true
      },
      {
        name: 'Power Forward Pizza',
        description: 'Hand-stretched dough topped with premium ingredients and melted cheese',
        price: '$18.99',
        image: 'https://placehold.co/300x200'
      }
    ]
  },
  {
    category: 'Signature Cocktails',
    icon: <LocalBarIcon />,
    description: 'Championship-worthy mixed drinks',
    items: [
      {
        name: 'The Slam Dunk',
        description: 'Bourbon, orange bitters, maple syrup, and a flaming orange peel',
        price: '$12',
        image: 'https://placehold.co/300x200',
        popular: true
      },
      {
        name: 'Touchdown Tequila',
        description: 'Premium tequila, lime, agave, and a splash of jalapeño for the brave',
        price: '$14',
        image: 'https://placehold.co/300x200',
        spicy: true
      },
      {
        name: 'Buzzer Beater',
        description: 'Vodka, fresh berries, lemon, and topped with champagne',
        price: '$13',
        image: 'https://placehold.co/300x200'
      },
      {
        name: 'The MVP Mojito',
        description: 'White rum, fresh mint, lime, sugar, and a splash of soda',
        price: '$11',
        image: 'https://placehold.co/300x200'
      }
    ]
  },
  {
    category: 'Draft Beers',
    icon: <SportsBarIcon />,
    description: 'Cold brews for the best plays',
    items: [
      {
        name: 'Local Champion IPA',
        description: 'Hoppy, citrusy brew with a smooth finish from our neighborhood brewery',
        price: '$7',
        image: 'https://placehold.co/300x200',
        popular: true
      },
      {
        name: 'Extra Time Lager',
        description: 'Crisp, refreshing beer that goes into overtime with flavor',
        price: '$6',
        image: 'https://placehold.co/300x200'
      },
      {
        name: 'Underdog Amber Ale',
        description: 'Malty, medium-bodied brew with caramel undertones',
        price: '$7',
        image: 'https://placehold.co/300x200'
      },
      {
        name: 'Seasonal Draft Special',
        description: 'Ask your server about our rotating tap selection',
        price: '$8',
        image: 'https://placehold.co/300x200'
      }
    ]
  }
];

const MenuPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <Box className="menu-page" sx={{ backgroundColor: '#121212', pt: 2, pb: 8 }}>
      {/* Hero Section */}
      <Box 
        className="menu-hero" 
        sx={{ 
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url(https://placehold.co/1200x400)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          py: 6,
          mb: 4
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <SportsBasketballIcon 
              sx={{ 
                color: '#d38236', 
                fontSize: 40, 
                mr: 2,
                animation: 'bounce 2s infinite'
              }} 
            />
            <Typography 
              variant="h2" 
              className="menu-heading"
              sx={{ 
                color: 'white',
                fontWeight: 800,
                letterSpacing: '1px',
                textTransform: 'uppercase'
              }}
            >
              Game Day Menu
            </Typography>
            <SportsSoccerIcon 
              sx={{ 
                color: '#d38236', 
                fontSize: 40, 
                ml: 2,
                animation: 'bounce 2s infinite',
                animationDelay: '0.5s'
              }} 
            />
          </Box>
          <Typography 
            variant="h6" 
            align="center"
            sx={{ 
              color: '#bbb',
              maxWidth: '700px',
              mx: 'auto'
            }}
          >
            Fuel up with championship-worthy food and drinks while you catch all the action
          </Typography>
        </Container>
      </Box>
      
      {/* Tab Navigation */}
      <Container maxWidth="lg" sx={{ mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
          <Tabs 
            value={currentTab} 
            onChange={handleTabChange} 
            variant="scrollable"
            scrollButtons="auto"
            aria-label="menu categories"
            TabIndicatorProps={{
              style: {
                backgroundColor: '#d38236',
              }
            }}
            sx={{
              '& .MuiTab-root': {
                color: '#999',
                '&.Mui-selected': {
                  color: '#d38236',
                }
              }
            }}
          >
            {menuData.map((category, index) => (
              <Tab 
                key={index} 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {React.cloneElement(category.icon, { style: { marginRight: '8px' } })}
                    {category.category}
                  </Box>
                }
                sx={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: 'rgba(211, 130, 54, 0.8)',
                    backgroundColor: 'rgba(255,255,255,0.03)'
                  }
                }}
              />
            ))}
          </Tabs>
        </Box>
      </Container>

      {/* Current Category Section */}
      <Container maxWidth="lg">
        {menuData.map((category, categoryIndex) => (
          <Box 
            key={category.category} 
            className="menu-category-section"
            sx={{ 
              display: categoryIndex === currentTab ? 'block' : 'none',
              mb: 6
            }}
          >
            {/* Category Info */}
            <Box 
              sx={{ 
                mb: 4,
                pb: 2,
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                flexDirection: { xs: 'column', sm: 'row' }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, sm: 0 } }}>
                <Box 
                  sx={{ 
                    backgroundColor: 'rgba(211, 130, 54, 0.2)', 
                    borderRadius: '50%',
                    p: 1.5,
                    mr: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {React.cloneElement(category.icon, { style: { color: '#d38236', fontSize: 32 } })}
                </Box>
                <Typography 
                  variant="h4" 
                  className="category-title"
                  sx={{ 
                    color: 'white', 
                    fontWeight: 700,
                    textTransform: 'uppercase'
                  }}
                >
                  {category.category}
                </Typography>
              </Box>
              <Typography 
                variant="body1"
                sx={{ 
                  color: '#aaa',
                  ml: { xs: 0, sm: 3 },
                  fontStyle: 'italic'
                }}
              >
                {category.description}
              </Typography>
            </Box>

            {/* Menu Items Grid */}
            <Grid container spacing={3}>
              {category.items.map((item, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Card 
                    className="menu-card"
                    sx={{
                      backgroundColor: '#1E1E1E',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      position: 'relative',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.5)'
                      }
                    }}
                  >
                    {/* Badges for popular/spicy items */}
                    <Box sx={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 1 }}>
                      {item.popular && (
                        <Chip 
                          icon={<StarIcon fontSize="small" />} 
                          label="Fan Favorite" 
                          size="small"
                          sx={{ 
                            backgroundColor: 'rgba(211, 130, 54, 0.9)',
                            color: 'white',
                            fontWeight: 'bold'
                          }}
                        />
                      )}
                      {item.spicy && (
                        <IconButton size="small" sx={{ backgroundColor: 'rgba(255,59,48,0.9)', p: 0.5 }}>
                          <LocalFireDepartmentIcon fontSize="small" sx={{ color: 'white' }} />
                        </IconButton>
                      )}
                    </Box>
                    
                    <CardMedia
                      component="img"
                      image={item.image}
                      alt={item.name}
                      className="menu-card-image"
                      sx={{ 
                        height: 180,
                        objectFit: 'cover'
                      }}
                    />
                    <CardContent sx={{ p: 2.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography 
                          variant="h6" 
                          className="menu-item-name"
                          sx={{ 
                            fontWeight: 600, 
                            color: 'white',
                            fontSize: '1.1rem'
                          }}
                        >
                          {item.name}
                        </Typography>
                        <Typography 
                          variant="body1" 
                          className="menu-item-price"
                          sx={{ 
                            color: '#d38236', 
                            fontWeight: 700,
                            fontSize: '1.2rem'
                          }}
                        >
                          {item.price}
                        </Typography>
                      </Box>
                      <Typography 
                        variant="body2" 
                        className="menu-item-description"
                        sx={{ 
                          color: '#bbb',
                          fontSize: '0.9rem',
                          lineHeight: 1.5
                        }}
                      >
                        {item.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </Container>
      
      {/* Legend Section */}
      <Container maxWidth="lg">
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 4 }} />
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Chip 
              icon={<StarIcon fontSize="small" />} 
              label="Fan Favorite" 
              size="small"
              sx={{ 
                backgroundColor: 'rgba(211, 130, 54, 0.9)',
                color: 'white'
              }}
            />
            <Typography variant="body2" sx={{ ml: 1, color: '#aaa' }}>
              Most popular choices
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton size="small" sx={{ backgroundColor: 'rgba(255,59,48,0.9)', p: 0.5, mr: 1 }}>
              <LocalFireDepartmentIcon fontSize="small" sx={{ color: 'white' }} />
            </IconButton>
            <Typography variant="body2" sx={{ color: '#aaa' }}>
              Spicy options
            </Typography>
          </Box>
        </Box>
      </Container>
      
    </Box>
  );
};

export default MenuPage;