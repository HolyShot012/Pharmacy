import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Bell from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { theme } from './components/ui/Theme';

const services = [
  { id: 1, name: 'Prescription Upload', icon: FontAwesome5, iconName: 'camera', color: '#3B82F6' },
  { id: 2, name: 'QR Code Scan', icon: FontAwesome5, iconName: 'qrcode', color: '#10B981' },
  { id: 3, name: 'Health Checkup', icon: FontAwesome5, iconName: 'shield-alt', color: '#8B5CF6' },
  { id: 4, name: 'Medicine Reminder', icon: MaterialIcons, iconName: 'access-time', color: '#F59E0B' },
];

const offers = [
  { id: 1, title: 'Summer Health Sale', subtitle: 'Up to 30% off on vitamins', code: 'SUMMER30', colors: ['#FBBF24', '#F97316'] },
  { id: 2, title: 'Free Delivery', subtitle: 'On orders above $50', code: 'FREEDEL', colors: ['#34D399', '#3B82F6'] },
  { id: 3, title: 'First Order Discount', subtitle: '20% off for new customers', code: 'WELCOME20', colors: ['#A78BFA', '#EC4899'] },
];

const categories = [
  { id: 1, name: 'Pain Relief', icon: '💊', color: '#fee2e2' },
  { id: 2, name: 'Vitamins', icon: '🧪', color: '#d1fae5' },
  { id: 3, name: 'Personal Care', icon: '🧴', color: '#dbeafe' },
  { id: 4, name: 'Baby Care', icon: '🍼', color: '#fce7f3' },
  { id: 5, name: 'First Aid', icon: '🩹', color: '#ffedd5' },
  { id: 6, name: 'Prescription', icon: '📋', color: '#ede9fe' },
];

const nearbyPharmacies = [
  { id: 1, name: 'HealthCare Pharmacy', distance: '0.2 km', rating: 4.8, openUntil: '22:00', isOpen: true },
  { id: 2, name: 'MediPlus Store', distance: '0.5 km', rating: 4.6, openUntil: '20:00', isOpen: true },
  { id: 3, name: 'Quick Meds', distance: '0.8 km', rating: 4.7, openUntil: '24:00', isOpen: true },
];

const featuredProducts = [
  { id: 1, name: 'Paracetamol 500mg', price: 25.50, originalPrice: 30.00, discount: 15, image: '💊', category: 'Pain Relief', rating: 4.5, inStock: true },
  { id: 2, name: 'Hand Sanitizer 500ml', price: 45.00, originalPrice: 50.00, discount: 10, image: '🧴', category: 'Personal Care', rating: 4.8, inStock: true },
  { id: 3, name: 'Vitamin C 1000mg', price: 35.75, originalPrice: 40.00, discount: 11, image: '🧪', category: 'Vitamins', rating: 4.6, inStock: true },
  { id: 4, name: 'Face Mask (Pack of 50)', price: 120.00, originalPrice: 140.00, discount: 14, image: '😷', category: 'Protection', rating: 4.4, inStock: false },
  { id: 5, name: 'Digital Thermometer', price: 85.00, originalPrice: 100.00, discount: 15, image: '🌡️', category: 'Medical Devices', rating: 4.7, inStock: true },
];

const vaccinations = [
  { id: 1, name: 'COVID-19 Booster', price: 45.00, duration: '30 min', nextAvailable: 'Today 2:00 PM' },
  { id: 2, name: 'Flu Shot', price: 35.00, duration: '15 min', nextAvailable: 'Tomorrow 10:00 AM' },
  { id: 3, name: 'Hepatitis B', price: 65.00, duration: '20 min', nextAvailable: 'Jul 5, 9:00 AM' }
];

const HomeScreen = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([1, 3, 5]);
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Paracetamol 500mg', price: 25.50, quantity: 2, image: '💊' },
    { id: 2, name: 'Vitamin D3', price: 35.75, quantity: 1, image: '🧪' }
  ]);

  const toggleFavorite = (productId) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1, image: product.image }];
    });
  };

  // Home Page (existing content)
  const HomePage = () => (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={[]}
        keyExtractor={() => 'empty'}
        ListHeaderComponent={
          <>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.location}>
                <Icon name="location" size={20} color={theme.colors.primary} />
                <View>
                  <Text style={styles.locationText}>Deliver to</Text>
                  <Text style={styles.locationSubtext}>Ho Chi Minh City, District 1</Text>
                </View>
              </View>
              <View style={styles.headerIcons}>
                <View style={styles.notification}>
                  <Bell name="bell" size={24} color={theme.colors.subtext} />
                  <View style={styles.notificationBadge} />
                </View>
                <View style={styles.profile}>
                  <Icon name="person" size={20} color={theme.colors.white} />
                </View>
              </View>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <Icon name="search" size={20} color={theme.colors.subtext} style={styles.searchIcon} />
              <TextInput
                placeholder="Search..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchInput}
              />
            </View>

            {/* Quick Services */}
            <View style={styles.section}>
              <View style={styles.quickServicesRow}>
                {services.map((service, idx) => (
                  <TouchableOpacity
                    key={service.id}
                    style={[styles.serviceButton, idx !== services.length - 1 && { marginRight: theme.spacing.sm }]}
                  >
                    <View style={[styles.serviceIcon, { backgroundColor: service.color }]}> 
                      <service.icon name={service.iconName} size={24} color={theme.colors.white} />
                    </View>
                    <Text style={styles.serviceText}>{service.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Special Offers */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Special Offers</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {offers.map(offer => (
                  <LinearGradient
                    key={offer.id}
                    colors={offer.colors}
                    style={styles.offerCard}
                  >
                    <Text style={styles.offerTitle}>{offer.title}</Text>
                    <Text style={styles.offerSubtitle}>{offer.subtitle}</Text>
                    <View style={styles.offerFooter}>
                      <Text style={styles.offerCode}>{offer.code}</Text>
                      <Icon name="chevron-forward" size={20} color={theme.colors.white} />
                    </View>
                  </LinearGradient>
                ))}
              </ScrollView>
            </View>

            {/* Categories */}
            <View style={styles.section}>
              <View style={styles.categoriesHeader}>
                <Text style={styles.sectionTitle}>Categories</Text>
                <TouchableOpacity>
                  <Text style={styles.linkText}>View All</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={categories}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.categoryButton}>
                    <View style={[styles.categoryIcon, { backgroundColor: item.color }]}> 
                      <Text style={styles.categoryIconText}>{item.icon}</Text>
                    </View>
                    <Text style={styles.categoryText}>{item.name}</Text>
                  </View>
                )}
                numColumns={3}
                columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: theme.spacing.sm }}
                scrollEnabled={false}
              />
            </View>

            {/* Nearby Pharmacies */}
            <View style={styles.section}>
              <View style={styles.categoriesHeader}>
                <Text style={styles.sectionTitle}>Nearby Pharmacies</Text>
                <TouchableOpacity>
                  <Text style={styles.linkText}>View All</Text>
                </TouchableOpacity>
              </View>
              <View>
                {nearbyPharmacies.slice(0, 2).map(pharmacy => (
                  <View key={pharmacy.id} style={styles.pharmacyCard}>
                    <View style={styles.pharmacyHeader}>
                      <Text style={styles.pharmacyName}>{pharmacy.name}</Text>
                      <View style={styles.pharmacyRatingRow}>
                        <Icon name="star" size={16} color="#FBBF24" />
                        <Text style={styles.pharmacyRating}>{pharmacy.rating}</Text>
                      </View>
                    </View>
                    <View style={styles.pharmacyFooter}>
                      <View style={styles.pharmacyInfoRow}>
                        <Text style={styles.pharmacyDistance}>{pharmacy.distance}</Text>
                        <Text style={[styles.pharmacyOpen, { color: pharmacy.isOpen ? '#16A34A' : '#DC2626' }]}>Open until {pharmacy.openUntil}</Text>
                      </View>
                      <View style={styles.pharmacyActionsRow}>
                        <TouchableOpacity style={styles.pharmacyActionButton}>
                          <Icon name="call" size={16} color="#2563EB" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.pharmacyActionButton}>
                          <Icon name="location" size={16} color="#10B981" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Featured Products */}
            <View style={styles.section}>
              <View style={styles.categoriesHeader}>
                <Text style={styles.sectionTitle}>Featured Products</Text>
                <TouchableOpacity>
                  <Text style={styles.linkText}>View All</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={featuredProducts.slice(0, 4)}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={[styles.productCard, { justifyContent: 'flex-start' }]}> 
                    <View style={styles.productImageWrapper}>
                      <Text style={styles.productImage}>{item.image}</Text>
                      <TouchableOpacity
                        onPress={() => toggleFavorite(item.id)}
                        style={styles.favoriteButton}
                      >
                        <Icon name="heart" size={16} color={favorites.includes(item.id) ? '#EF4444' : '#D1D5DB'} />
                      </TouchableOpacity>
                      {item.discount > 0 && (
                        <View style={styles.discountBadge}>
                          <Text style={styles.discountText}>-{item.discount}%</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.productCategory}>{item.category}</Text>
                    <View style={styles.productRatingRow}>
                      <Icon name="star" size={14} color="#FBBF24" />
                      <Text style={styles.productRating}>{item.rating}</Text>
                    </View>
                    <View style={styles.productPriceRow}>
                      <Text style={styles.productPrice}>${item.price}</Text>
                      {item.originalPrice > item.price && (
                        <Text style={styles.productOriginalPrice}>${item.originalPrice}</Text>
                      )}
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, minHeight: 32 }}>
                      <TouchableOpacity
                        onPress={() => addToCart(item)}
                        disabled={!item.inStock}
                        style={{ backgroundColor: item.inStock ? theme.colors.primary : '#E5E7EB', borderRadius: 8, width: 36, height: 32, alignItems: 'center', justifyContent: 'center', marginRight: 8 }}
                      >
                        <AntDesign name="plus" size={16} color={item.inStock ? '#fff' : '#9CA3AF'} />
                      </TouchableOpacity>
                      <View style={{ flex: 1, minHeight: 20, justifyContent: 'center' }}>
                        {!item.inStock && (
                          <Text style={[styles.outOfStock, { marginTop: 0 }]}>Out of Stock</Text>
                        )}
                      </View>
                    </View>
                  </View>
                )}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: theme.spacing.sm }}
                scrollEnabled={false}
              />
            </View>
          </>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );

  // Products Page
  const ProductPage = () => (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: theme.spacing.md }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: theme.colors.text }}>Products</Text>
          <TouchableOpacity>
            <MaterialIcons name="filter-list" size={28} color={theme.colors.subtext} />
          </TouchableOpacity>
        </View>
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color={theme.colors.subtext} style={styles.searchIcon} />
          <TextInput
            placeholder="Search products..."
            style={styles.searchInput}
          />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: theme.spacing.md, paddingLeft: theme.spacing.md }}>
          <TouchableOpacity style={{ backgroundColor: theme.colors.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999, marginRight: 8 }}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>All</Text>
          </TouchableOpacity>
          {categories.map(category => (
            <TouchableOpacity key={category.id} style={{ backgroundColor: '#E5E7EB', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999, marginRight: 8 }}>
              <Text style={{ color: theme.colors.text }}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <FlatList
          data={
            featuredProducts.length % 2 === 1
              ? [...featuredProducts, { id: 'placeholder' }]
              : featuredProducts
          }
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => {
            if (item.id === 'placeholder') {
              return <View style={[styles.productCard, { backgroundColor: 'transparent', elevation: 0, shadowOpacity: 0 }]} />;
            }
            return (
              <View style={[styles.productCard, { justifyContent: 'flex-start' }]}> 
                <View style={styles.productImageWrapper}>
                  <Text style={styles.productImage}>{item.image}</Text>
                  <TouchableOpacity
                    onPress={() => toggleFavorite(item.id)}
                    style={styles.favoriteButton}
                  >
                    <Icon name="heart" size={16} color={favorites.includes(item.id) ? '#EF4444' : '#D1D5DB'} />
                  </TouchableOpacity>
                  {item.discount > 0 && (
                    <View style={styles.discountBadge}>
                      <Text style={styles.discountText}>-{item.discount}%</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productCategory}>{item.category}</Text>
                <View style={styles.productRatingRow}>
                  <Icon name="star" size={14} color="#FBBF24" />
                  <Text style={styles.productRating}>{item.rating}</Text>
                </View>
                <View style={styles.productPriceRow}>
                  <Text style={styles.productPrice}>${item.price}</Text>
                  {item.originalPrice > item.price && (
                    <Text style={styles.productOriginalPrice}>${item.originalPrice}</Text>
                  )}
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, minHeight: 32 }}>
                  <TouchableOpacity
                    onPress={() => addToCart(item)}
                    disabled={!item.inStock}
                    style={{ backgroundColor: item.inStock ? theme.colors.primary : '#E5E7EB', borderRadius: 8, width: 36, height: 32, alignItems: 'center', justifyContent: 'center', marginRight: 8 }}
                  >
                    <AntDesign name="plus" size={16} color={item.inStock ? '#fff' : '#9CA3AF'} />
                  </TouchableOpacity>
                  {/* Reserve space for Out of Stock */}
                  <View style={{ flex: 1, minHeight: 20, justifyContent: 'center' }}>
                    {!item.inStock && (
                      <Text style={[styles.outOfStock, { marginTop: 0 }]}>Out of Stock</Text>
                    )}
                  </View>
                </View>
              </View>
            );
          }}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: theme.spacing.sm }}
          scrollEnabled={false}
        />
      </ScrollView>
    </SafeAreaView>
  );

  // Cart Page
  const CartPage = () => {
    const updateQuantity = (id, change) => {
      setCartItems(prev =>
        prev.map(item =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item
        ).filter(item => item.quantity > 0)
      );
    };
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={cartItems}
          keyExtractor={item => item.id.toString()}
          ListHeaderComponent={
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: theme.spacing.md }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: theme.colors.text }}>Shopping Cart ({cartItems.length})</Text>
              <TouchableOpacity onPress={() => setCartItems([])}>
                <Text style={{ color: '#EF4444', fontWeight: 'bold' }}>Clear All</Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 64, height: 64, backgroundColor: '#F3F4F6', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                  <Text style={{ fontSize: 28 }}>{item.image}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: 'bold', color: theme.colors.text }}>{item.name}</Text>
                  <Text style={{ color: '#16A34A', fontWeight: 'bold' }}>${item.price}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TouchableOpacity onPress={() => updateQuantity(item.id, -1)} style={{ backgroundColor: '#E5E7EB', borderRadius: 999, padding: 8, marginRight: 4 }}>
                    <AntDesign name="minus" size={16} color={theme.colors.text} />
                  </TouchableOpacity>
                  <Text style={{ width: 24, textAlign: 'center', fontWeight: 'bold' }}>{item.quantity}</Text>
                  <TouchableOpacity onPress={() => updateQuantity(item.id, 1)} style={{ backgroundColor: theme.colors.primary, borderRadius: 999, padding: 8, marginLeft: 4 }}>
                    <AntDesign name="plus" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          ListFooterComponent={cartItems.length > 0 ? (
            <View style={styles.productCard}>
              <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 8 }}>Order Summary</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text style={{ color: theme.colors.subtext }}>Subtotal</Text>
                <Text style={{ fontWeight: 'bold' }}>${total.toFixed(2)}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text style={{ color: theme.colors.subtext }}>Delivery Fee</Text>
                <Text style={{ fontWeight: 'bold' }}>$5.00</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Total</Text>
                <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#16A34A' }}>${(total + 5).toFixed(2)}</Text>
              </View>
              <TouchableOpacity style={{ backgroundColor: theme.colors.primary, padding: 16, borderRadius: 12, marginTop: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <MaterialIcons name="credit-card" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Proceed to Checkout</Text>
              </TouchableOpacity>
            </View>
          ) : null}
          ListEmptyComponent={(
            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, marginTop: 60 }}>
              <Text style={{ fontSize: 48, marginBottom: 16 }}>🛒</Text>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.colors.text, marginBottom: 8 }}>Your cart is empty</Text>
              <Text style={{ color: theme.colors.subtext, marginBottom: 24 }}>Add some products to get started</Text>
              <TouchableOpacity
                onPress={() => setActiveTab('products')}
                style={{ backgroundColor: theme.colors.primary, paddingHorizontal: 32, paddingVertical: 12, borderRadius: 16 }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Browse Products</Text>
              </TouchableOpacity>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    );
  };

  // Vaccination Page
  const VaccinationPage = () => (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: theme.spacing.md }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: theme.colors.text }}>Vaccination Services</Text>
          <TouchableOpacity style={{ backgroundColor: '#8B5CF6', padding: 8, borderRadius: 8 }}>
            <MaterialIcons name="calendar-today" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <LinearGradient colors={["#8B5CF6", "#EC4899"]} style={{ borderRadius: 20, padding: 24, margin: 16 }}>
          <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>Book Your Vaccination</Text>
          <Text style={{ color: '#fff', opacity: 0.9, marginBottom: 16 }}>Stay protected with our vaccination services</Text>
          <TouchableOpacity style={{ backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, alignSelf: 'flex-start' }}>
            <Text style={{ color: '#8B5CF6', fontWeight: 'bold' }}>Book Appointment</Text>
          </TouchableOpacity>
        </LinearGradient>
        <FlatList
          data={vaccinations}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <View style={{ width: 48, height: 48, backgroundColor: '#EDE9FE', borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                  <MaterialIcons name="vaccines" size={28} color="#8B5CF6" />
                </View>
                <View>
                  <Text style={{ fontWeight: 'bold', color: theme.colors.text }}>{item.name}</Text>
                  <Text style={{ color: theme.colors.subtext }}>Duration: {item.duration}</Text>
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Text style={{ color: '#16A34A', fontWeight: 'bold', fontSize: 16 }}>${item.price}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={{ color: theme.colors.subtext }}>Next Available:</Text>
                  <Text style={{ color: '#8B5CF6', fontWeight: 'bold' }}>{item.nextAvailable}</Text>
                </View>
                <TouchableOpacity style={{ backgroundColor: '#8B5CF6', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 }}>
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>Book Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          scrollEnabled={false}
        />
        <View style={[styles.productCard, { backgroundColor: '#EFF6FF', borderColor: '#DBEAFE', borderWidth: 1 }]}> 
          <Text style={{ fontWeight: 'bold', color: '#1E40AF', marginBottom: 8 }}>Vaccination Records</Text>
          <Text style={{ color: '#2563EB', marginBottom: 12 }}>Keep track of your immunization history</Text>
          <TouchableOpacity style={{ backgroundColor: '#3B82F6', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 }}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>View Records</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  // Tab Navigation
  const renderPage = () => {
    switch(activeTab) {
      case 'home': return <HomePage />;
      case 'products': return <ProductPage />;
      case 'cart': return <CartPage />;
      case 'vaccinations': return <VaccinationPage />;
      default: return <HomePage />;
    }
  };

  // Main Layout with Bottom Tabs
  const { bottom: insetBottom } = require('react-native-safe-area-context').useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ flex: 1 }}>{renderPage()}</View>
      {/* Bottom Tab Navigation */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: 64 + insetBottom, backgroundColor: theme.colors.white, borderTopWidth: 1, borderColor: '#E5E7EB', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2, elevation: 2, paddingBottom: insetBottom }}>
        <TouchableOpacity onPress={() => setActiveTab('home')} style={{ alignItems: 'center', flex: 1 }}>
          <Icon name="home" size={28} color={activeTab === 'home' ? theme.colors.primary : theme.colors.subtext} />
          <Text style={{ color: activeTab === 'home' ? theme.colors.primary : theme.colors.subtext, fontSize: 12 }}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('products')} style={{ alignItems: 'center', flex: 1 }}>
          <MaterialIcons name="local-offer" size={28} color={activeTab === 'products' ? theme.colors.primary : theme.colors.subtext} />
          <Text style={{ color: activeTab === 'products' ? theme.colors.primary : theme.colors.subtext, fontSize: 12 }}>Products</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('cart')} style={{ alignItems: 'center', flex: 1 }}>
          <MaterialIcons name="shopping-cart" size={28} color={activeTab === 'cart' ? theme.colors.primary : theme.colors.subtext} />
          <Text style={{ color: activeTab === 'cart' ? theme.colors.primary : theme.colors.subtext, fontSize: 12 }}>Cart</Text>
          {cartItems.length > 0 && (
            <View style={{ position: 'absolute', top: 2, right: 24, backgroundColor: '#EF4444', borderRadius: 10, width: 20, height: 20, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#fff', fontSize: 12 }}>{cartItems.length}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('vaccinations')} style={{ alignItems: 'center', flex: 1 }}>
          <MaterialIcons name="vaccines" size={28} color={activeTab === 'vaccinations' ? theme.colors.primary : theme.colors.subtext} />
          <Text style={{ color: activeTab === 'vaccinations' ? theme.colors.primary : theme.colors.subtext, fontSize: 12 }}>Vaccines</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    // Remove extra padding to avoid white bar at the top
    paddingTop: 0,
  },
  header: {
    backgroundColor: 'transparent', // Remove white bar at the top of header
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: theme.fontSizes.sm,
    fontWeight: '500',
    color: theme.colors.text,
  },
  locationSubtext: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.subtext,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notification: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 12,
    height: 12,
    backgroundColor: theme.colors.error,
    borderRadius: 6,
  },
  profile: {
    width: 32,
    height: 32,
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.spacing.sm,
  },
  searchContainer: {
    padding: theme.spacing.md,
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: 28,
    top: 28,
  },
  searchInput: {
    width: '100%',
    paddingLeft: 40,
    paddingRight: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    fontSize: theme.fontSizes.md,
  },
  section: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  linkText: {
    color: theme.colors.primary,
    fontWeight: '500',
    fontSize: theme.fontSizes.sm,
  },
  quickServicesRow: {
    flexDirection: 'row',
    marginTop: theme.spacing.md,
  },
  serviceButton: {
    alignItems: 'center',
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flex: 1,
  },
  serviceIcon: {
    padding: theme.spacing.sm,
    borderRadius: 999,
    marginBottom: theme.spacing.sm,
  },
  serviceText: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.text,
    textAlign: 'center',
    fontWeight: '500',
  },
  categoriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  categoriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  categoryButton: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    padding: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    minWidth: 0,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  categoryIconText: {
    fontSize: 24,
  },
  categoryText: {
    fontSize: theme.fontSizes.sm,
    fontWeight: '500',
    color: theme.colors.text,
    textAlign: 'center',
  },
  pharmacyCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  pharmacyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  pharmacyName: {
    fontWeight: '600',
    color: theme.colors.text,
    fontSize: theme.fontSizes.md,
  },
  pharmacyRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pharmacyRating: {
    marginLeft: 4,
    color: '#FBBF24',
    fontWeight: '500',
  },
  pharmacyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pharmacyInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pharmacyDistance: {
    color: theme.colors.subtext,
    fontSize: theme.fontSizes.sm,
    marginRight: 12,
  },
  pharmacyOpen: {
    fontSize: theme.fontSizes.sm,
    fontWeight: '500',
  },
  pharmacyActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pharmacyActionButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 8,
    marginLeft: 4,
  },
  featuredProductsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  productCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    padding: theme.spacing.md,
    flex: 1,
    marginHorizontal: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    minWidth: 0,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  productImageWrapper: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  productImage: {
    fontSize: 32,
    textAlign: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  discountBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  discountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  productName: {
    fontWeight: '500',
    color: theme.colors.text,
    fontSize: theme.fontSizes.sm,
    marginBottom: 2,
  },
  productCategory: {
    color: theme.colors.subtext,
    fontSize: theme.fontSizes.xs,
    marginBottom: 2,
  },
  productRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  productRating: {
    marginLeft: 4,
    color: '#FBBF24',
    fontWeight: '500',
    fontSize: theme.fontSizes.xs,
  },
  productPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  productPrice: {
    color: '#16A34A',
    fontWeight: 'bold',
    fontSize: theme.fontSizes.md,
  },
  productOriginalPrice: {
    color: theme.colors.subtext,
    fontSize: theme.fontSizes.xs,
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
  outOfStock: {
    color: '#EF4444',
    fontSize: theme.fontSizes.xs,
    marginTop: 2,
    fontWeight: '500',
  },
  offerCard: {
    minWidth: 280,
    borderRadius: 16,
    padding: theme.spacing.md,
    marginRight: theme.spacing.sm,
  },
  offerTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: '700',
    color: theme.colors.white,
  },
  offerSubtitle: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.white,
    opacity: 0.9,
    marginBottom: theme.spacing.sm,
  },
  offerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  offerCode: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: 999,
    fontSize: theme.fontSizes.xs,
    color: theme.colors.white,
  },
});
