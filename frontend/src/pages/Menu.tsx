import React, { useState, useEffect } from 'react';
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
  Divider,
  CircularProgress
} from '@mui/material';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import TapasIcon from '@mui/icons-material/Tapas';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import SetMealIcon from '@mui/icons-material/SetMeal';
import RamenDiningIcon from '@mui/icons-material/RamenDining';
import BrunchDiningIcon from '@mui/icons-material/BrunchDining';
import EggIcon from '@mui/icons-material/Egg';
import RiceBowlIcon from '@mui/icons-material/RiceBowl';
import BakeryDiningIcon from '@mui/icons-material/BakeryDining';
import LocalPizzaIcon from '@mui/icons-material/LocalPizza';
import IcecreamIcon from '@mui/icons-material/Icecream';
import EmojiFoodBeverageIcon from '@mui/icons-material/EmojiFoodBeverage';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import GrassIcon from '@mui/icons-material/Grass';
import CelebrationIcon from '@mui/icons-material/Celebration';
import '../styles/pages/menupage.css';

// Menu item type
interface MenuItem {
  menu_id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  image_url: string | null;
}

// Category with its items
interface MenuCategory {
  category: string;
  icon: JSX.Element;
  description: string;
  items: MenuItem[];
}

const MenuPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://127.0.0.1:8000/api/menus/list');
      
      if (!response.ok) {
        throw new Error('Failed to fetch menu items');
      }
      
      const data: MenuItem[] = await response.json();
      
      // Group menu items by category
      const categorizedMenu = processCategorizedData(data);
      setMenuCategories(categorizedMenu);
      
    } catch (error) {
      console.error('Error fetching menu data:', error);
      setError('Unable to load menu. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Function to get icon based on category
  const getCategoryIcon = (category: string): JSX.Element => {
    switch (category) {
      case 'APPETIZERS':
        return <TapasIcon />;
      case 'BEEF':
        return <LocalDiningIcon />;
      case 'SEAFOOD':
        return <SetMealIcon />;
      case 'PORK':
        return <LunchDiningIcon />;
      case 'CHICKEN':
        return <BrunchDiningIcon />;
      case 'SOUP':
        return <RamenDiningIcon />;
      case 'VEGGIES':
        return <GrassIcon />;
      case 'RICE':
        return <RiceBowlIcon />;
      case 'SIZZLERS':
        return <LocalDiningIcon />;
      case 'BURGER':
        return <LunchDiningIcon />;
      case 'SILOG MEALS':
        return <EggIcon />;
      case 'BEER':
        return <SportsBarIcon />;
      case 'SOFTDRINKS':
        return <LocalCafeIcon />;
      case 'COCKTAILS':
        return <LocalBarIcon />;
      case 'TOWER':
        return <CelebrationIcon />;
      case 'DESSERT':
        return <IcecreamIcon />;
      case 'PIZZA':
        return <LocalPizzaIcon />;
      case 'PASTA':
        return <BakeryDiningIcon />;
      default:
        return <EmojiFoodBeverageIcon />;
    }
  };

  // Function to get category description
  const getCategoryDescription = (category: string): string => {
    switch (category) {
      case 'APPETIZERS':
        return 'Perfect for sharing while watching the game';
      case 'BEEF':
        return 'Premium beef selections for the true meat lover';
      case 'SEAFOOD':
        return 'Fresh catches from the ocean to your table';
      case 'PORK':
        return 'Savory pork dishes to satisfy your cravings';
      case 'CHICKEN':
        return 'Delicious chicken dishes prepared to perfection';
      case 'SOUP':
        return 'Comforting broths to warm your soul';
      case 'VEGGIES':
        return 'Fresh vegetables for a healthy choice';
      case 'RICE':
        return 'Satisfying rice dishes for your meal';
      case 'SIZZLERS':
        return 'Hot plates that sizzle with flavor';
      case 'BURGER':
        return 'Juicy burgers that hit the spot';
      case 'SILOG MEALS':
        return 'Filipino breakfast classics served all day';
      case 'BEER':
        return 'Cold brews for the best plays';
      case 'SOFTDRINKS':
        return 'Refreshing beverages to quench your thirst';
      case 'COCKTAILS':
        return 'Expertly crafted cocktails for every taste';
      case 'TOWER':
        return 'Impressive drink towers perfect for sharing';
      case 'DESSERT':
        return 'Sweet endings to your perfect meal';
      case 'PIZZA':
        return 'Handcrafted pizzas with premium toppings';
      case 'PASTA':
        return 'Italian-inspired pasta dishes';
      default:
        return 'Delicious options to enjoy';
    }
  };

  // Process and categorize the data
  const processCategorizedData = (data: MenuItem[]): MenuCategory[] => {
    // Get unique categories
    const categories = [...new Set(data.map(item => item.category))];
    
    // Create category objects with their items
    return categories.map(category => {
      return {
        category,
        icon: getCategoryIcon(category),
        description: getCategoryDescription(category),
        items: data.filter(item => item.category === category && item.is_available)
      };
    });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  // Format price to Philippine Peso
  const formatPrice = (price: string) => {
    return `₱${parseFloat(price).toFixed(2)}`;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#121212' }}>
        <CircularProgress sx={{ color: '#d38236' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#121212', color: 'white' }}>
        <Typography variant="h5">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box className="menu-page" sx={{ backgroundColor: '#121212', pt: 2, pb: 8 }}>
      {/* Hero Section */}
      <Box 
        className="menu-hero" 
        sx={{ 
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url(https://plus.unsplash.com/premium_photo-1701766169067-412484e22158?q=80&w=2664&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
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
            {menuCategories.map((category, index) => (
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
        {menuCategories.map((category, categoryIndex) => (
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
              {category.items.map((item) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={item.menu_id}>
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
                    <CardMedia
                      component="img"
                      image={item.image_url || 'https://placehold.co/300x200'}
                      alt={item.name}
                      className="menu-card-image"
                      sx={{ 
                        height: 260,
                        width: "100%",
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
                          {formatPrice(item.price)}
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
                        {item.description || 'A delicious dish prepared by our expert chefs'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </Container>
      
      <Container maxWidth="lg">
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 4 }} />
      </Container>
    </Box>
  );
};

export default MenuPage;