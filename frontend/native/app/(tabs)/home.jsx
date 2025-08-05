import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useEffect, useRef } from 'react';
import { FlatList, ScrollView, Text, TextInput, TouchableOpacity, View, Alert, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Bell from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useCart } from '../../components/CartContext';
import { useFavorites } from '../../components/FavoritesContext';
import { styles } from '../../components/ui/Styles';
import { theme } from '../../components/ui/Theme';
import { useRouter } from 'expo-router';
import { Modal, Pressable } from 'react-native';
import { useAuth } from '../../components/AuthContext';
import { getProducts } from '../api.jsx';
import FormatVND from '../../components/FormatVND';

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
    { id: 1, name: 'Medicine', icon: '💊', color: '#fee2e2' },
    { id: 2, name: 'Medical Equipment', icon: '🩺', color: '#d1fae5' },
    { id: 3, name: 'Cosmeceutical', icon: '🧴', color: '#dbeafe' },
    { id: 4, name: 'Supplement', icon: '🧘‍♀️', color: '#fce7f3' },
];

const nearbyPharmacies = [
    { id: 1, name: 'HealthCare Pharmacy', distance: '0.2 km', rating: 4.8, openUntil: '22:00', isOpen: true },
    { id: 2, name: 'MediPlus Store', distance: '0.5 km', rating: 4.6, openUntil: '20:00', isOpen: true },
    { id: 3, name: 'Quick Meds', distance: '0.8 km', rating: 4.7, openUntil: '24:00', isOpen: true },
];

// Featured products will be fetched from backend

const HomePage = () => {
    const [activeTab, setActiveTab] = useState('home');
    const { addToCart } = useCart();
    const { favorites, toggleFavorite, isFavorite } = useFavorites();
    const [showLogout, setShowLogout] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState('Ho Chi Minh City, District 1');
    const [showNotifications, setShowNotifications] = useState(false);
    const { logout } = useAuth();
    const router = useRouter();
    const [featuredProducts, setFeaturedProducts] = useState([]);

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                const response = await getProducts(1, 4);
                // Category to emoji mapping (same as products.jsx)
                const getCategoryEmoji = (category) => {
                    const categoryMap = {
                        'Supplement': '🌱',
                        'Cosmetic': '🧴',
                        'Medical Equipment': '🩺',
                        'Medicine': '💊',
                        'default': '💊'
                    };
                    return categoryMap[category] || categoryMap['default'];
                };
                const transformedProducts = (response.results || []).map(product => ({
                    id: product.product_id,
                    name: product.name,
                    price: parseFloat(product.unit_price || 0),
                    originalPrice: product.original_price ? parseFloat(product.original_price) : parseFloat(product.unit_price || 0),
                    discount: product.discount || 0,
                    image: getCategoryEmoji(product.category),
                    category: product.category,
                    rating: 4.5, // Default rating
                    inStock: (product.available_quantity || 0) > 0,
                    quantity: product.available_quantity || 0,
                    manufacturer: product.manufacturer || '',
                }));
                setFeaturedProducts(transformedProducts);
            } catch (error) {
                setFeaturedProducts([]);
            }
        };
        fetchFeaturedProducts();
    }, []);

    // Animation refs for notification modal
    const backgroundOpacity = useRef(new Animated.Value(0)).current;
    const modalTranslateY = useRef(new Animated.Value(-50)).current;
    const modalOpacity = useRef(new Animated.Value(0)).current;

    // Animation refs for location modal
    const locationBackgroundOpacity = useRef(new Animated.Value(0)).current;
    const locationModalTranslateY = useRef(new Animated.Value(-50)).current;
    const locationModalOpacity = useRef(new Animated.Value(0)).current;

    // Animation effects for notification modal
    useEffect(() => {
        if (showNotifications) {
            // Reset values
            backgroundOpacity.setValue(0);
            modalTranslateY.setValue(-50);
            modalOpacity.setValue(0);
            
            // Start animations
            Animated.parallel([
                // Background fade in
                Animated.timing(backgroundOpacity, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: false,
                }),
                // Modal slide down and fade in
                Animated.sequence([
                    Animated.delay(50), // Small delay for better effect
                    Animated.parallel([
                        Animated.timing(modalTranslateY, {
                            toValue: 0,
                            duration: 250,
                            useNativeDriver: true,
                        }),
                        Animated.timing(modalOpacity, {
                            toValue: 1,
                            duration: 200,
                            useNativeDriver: true,
                        }),
                    ])
                ])
            ]).start();
        } else {
            // Animate out
            Animated.parallel([
                Animated.timing(backgroundOpacity, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: false,
                }),
                Animated.timing(modalTranslateY, {
                    toValue: -50,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(modalOpacity, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [showNotifications]);

    // Animation effects for location modal
    useEffect(() => {
        if (showLocationModal) {
            // Reset values
            locationBackgroundOpacity.setValue(0);
            locationModalTranslateY.setValue(-50);
            locationModalOpacity.setValue(0);
            
            // Start animations
            Animated.parallel([
                // Background fade in
                Animated.timing(locationBackgroundOpacity, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: false,
                }),
                // Modal slide down and fade in
                Animated.sequence([
                    Animated.delay(50), // Small delay for better effect
                    Animated.parallel([
                        Animated.timing(locationModalTranslateY, {
                            toValue: 0,
                            duration: 250,
                            useNativeDriver: true,
                        }),
                        Animated.timing(locationModalOpacity, {
                            toValue: 1,
                            duration: 200,
                            useNativeDriver: true,
                        }),
                    ])
                ])
            ]).start();
        } else {
            // Animate out
            Animated.parallel([
                Animated.timing(locationBackgroundOpacity, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: false,
                }),
                Animated.timing(locationModalTranslateY, {
                    toValue: -50,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(locationModalOpacity, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [showLocationModal]);

    const locations = [
        'Ho Chi Minh City, District 1',
        'Ho Chi Minh City, District 3',
        'Ho Chi Minh City, District 7',
        'Hanoi, Ba Dinh District',
        'Da Nang, Hai Chau District'
    ];

    const notifications = [
        { id: 1, title: 'Order Delivered', message: 'Your order #ORD-2024-001 has been delivered', time: '2 min ago', read: false },
        { id: 2, title: 'New Offer Available', message: 'Get 30% off on vitamins this week', time: '1 hour ago', read: false },
        { id: 3, title: 'Prescription Reminder', message: 'Time to refill your prescription', time: '3 hours ago', read: true },
    ];

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await logout(); // Use AuthContext logout
            setShowLogout(false);
            // No need to manually navigate - AuthContext will handle the redirect
        } catch (error) {
            console.error('Logout error:', error);
            Alert.alert(
                'Logout Error',
                'Failed to logout. Please try again.',
                [
                    {
                        text: 'OK',
                        onPress: () => setIsLoggingOut(false)
                    }
                ]
            );
        }
    };

    const handleServicePress = (serviceName) => {
        switch (serviceName) {
            case 'Prescription Upload':
                Alert.alert(
                    'Prescription Upload',
                    'This feature allows you to upload your prescription for processing.',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Upload Photo', onPress: () => console.log('Camera opened') },
                        { text: 'Choose from Gallery', onPress: () => console.log('Gallery opened') }
                    ]
                );
                break;
            case 'QR Code Scan':
                Alert.alert('QR Scanner', 'Opening QR code scanner...', [
                    { text: 'OK', onPress: () => console.log('QR scanner opened') }
                ]);
                break;
            case 'Health Checkup':
                Alert.alert('Health Checkup', 'Book a health checkup appointment', [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Book Now', onPress: () => console.log('Booking health checkup') }
                ]);
                break;
            case 'Medicine Reminder':
                Alert.alert('Medicine Reminder', 'Set up reminders for your medications', [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Set Reminder', onPress: () => console.log('Setting reminder') }
                ]);
                break;
        }
    };

    const handleOfferPress = (offer) => {
        Alert.alert(
            offer.title,
            `${offer.subtitle}\n\nUse code: ${offer.code}`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Copy Code', onPress: () => {
                        console.log(`Copied: ${offer.code}`);
                        Alert.alert('Copied!', `Code ${offer.code} copied to clipboard`);
                    }
                }
            ]
        );
    };

    const handleCategoryPress = (category) => {
        // Navigate to products page with category parameter
        router.push({
            pathname: '/products',
            params: { category: category.name }
        });
    };

    const handlePharmacyCall = (pharmacy) => {
        Alert.alert(
            'Call Pharmacy',
            `Call ${pharmacy.name}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Call', onPress: () => console.log(`Calling ${pharmacy.name}`) }
            ]
        );
    };

    const handlePharmacyLocation = (pharmacy) => {
        Alert.alert(
            'Get Directions',
            `Get directions to ${pharmacy.name}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Open Maps', onPress: () => console.log(`Opening maps for ${pharmacy.name}`) }
            ]
        );
    };


    const handleViewAllCategories = () => {
        router.push('/products');
    };

    const handleViewAllPharmacies = () => {
        Alert.alert('Nearby Pharmacies', 'Showing all nearby pharmacies...', [
            { text: 'OK', onPress: () => console.log('Showing all pharmacies') }
        ]);
    };

    const handleViewAllProducts = () => {
        router.push('/products');
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <FlatList
                data={[]}
                keyExtractor={() => 'empty'}
                ListHeaderComponent={<>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.location} onPress={() => setShowLocationModal(true)}>
                            <Icon name="location" size={20} color={theme.colors.primary} />
                            <View>
                                <Text style={styles.locationText}>Deliver to</Text>
                                <Text style={styles.locationSubtext}>{selectedLocation}</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={styles.headerIcons}>
                            <TouchableOpacity style={styles.notification} onPress={() => setShowNotifications(true)}>
                                <Bell name="bell" size={24} color={theme.colors.subtext} />
                                <View style={styles.notificationBadge} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.profile} onPress={() => setShowLogout(true)}>
                                <Icon name="person" size={20} color={theme.colors.white} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* User Menu Modal */}
                    <Modal
                        visible={showLogout}
                        transparent
                        animationType="fade"
                        onRequestClose={() => setShowLogout(false)}
                    >
                        <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.1)' }} onPress={() => setShowLogout(false)}>
                            <View style={{
                                position: 'absolute',
                                top: 60,
                                right: 24,
                                backgroundColor: '#FFF',
                                borderRadius: 12,
                                padding: 0,
                                elevation: 8,
                                shadowColor: '#000',
                                shadowOpacity: 0.2,
                                shadowOffset: { width: 0, height: 4 },
                                shadowRadius: 8,
                                minWidth: 160
                            }}>
                                {/* Profile Button */}
                                <TouchableOpacity
                                    onPress={() => {
                                        setShowLogout(false);
                                        router.push('/profile');
                                    }}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        paddingHorizontal: 20,
                                        paddingVertical: 16,
                                        borderBottomWidth: 1,
                                        borderBottomColor: '#F3F4F6'
                                    }}
                                >
                                    <Icon
                                        name="person-outline"
                                        size={18}
                                        color={theme.colors.primary}
                                        style={{ marginRight: 12 }}
                                    />
                                    <Text style={{
                                        color: theme.colors.text,
                                        fontWeight: '600',
                                        fontSize: 16
                                    }}>
                                        Profile
                                    </Text>
                                </TouchableOpacity>

                                {/* Logout Button */}
                                <TouchableOpacity
                                    onPress={handleLogout}
                                    disabled={isLoggingOut}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        paddingHorizontal: 20,
                                        paddingVertical: 16,
                                        opacity: isLoggingOut ? 0.6 : 1
                                    }}
                                >
                                    <Icon
                                        name="log-out-outline"
                                        size={18}
                                        color="#EF4444"
                                        style={{ marginRight: 12 }}
                                    />
                                    <Text style={{
                                        color: '#EF4444',
                                        fontWeight: '600',
                                        fontSize: 16
                                    }}>
                                        {isLoggingOut ? 'Logging out...' : 'Log out'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </Pressable>
                    </Modal>

                    {/* Location Modal - Custom slide-down animation from location button */}
                    <Modal
                        visible={showLocationModal}
                        transparent
                        animationType="none"
                        onRequestClose={() => setShowLocationModal(false)}
                    >
                        <Animated.View 
                            style={{ 
                                flex: 1, 
                                backgroundColor: locationBackgroundOpacity.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.1)']
                                })
                            }} 
                        >
                            <Pressable 
                                style={{ flex: 1 }} 
                                onPress={() => setShowLocationModal(false)}
                            >
                                {/* Location dropdown positioned near the location button */}
                                <Animated.View style={{
                                    position: 'absolute',
                                    top: 70, // Position below the header
                                    left: 16, // Align with location button
                                    backgroundColor: '#FFF',
                                    borderRadius: 12,
                                    padding: 0,
                                    width: 320,
                                    maxHeight: 400,
                                    elevation: 8,
                                    shadowColor: '#000',
                                    shadowOpacity: 0.15,
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowRadius: 12,
                                    borderWidth: 1,
                                    borderColor: '#E5E7EB',
                                    transform: [{ translateY: locationModalTranslateY }],
                                    opacity: locationModalOpacity
                                }}>
                                {/* Header with title and close button */}
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    paddingHorizontal: 20,
                                    paddingVertical: 16,
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#F3F4F6'
                                }}>
                                    <Text style={{ 
                                        fontSize: 18, 
                                        fontWeight: 'bold', 
                                        color: theme.colors.text 
                                    }}>
                                        Select Location
                                    </Text>
                                    <TouchableOpacity 
                                        onPress={() => setShowLocationModal(false)}
                                        style={{
                                            padding: 4,
                                            borderRadius: 6
                                        }}
                                    >
                                        <Icon name="close" size={20} color={theme.colors.subtext} />
                                    </TouchableOpacity>
                                </View>

                                {/* Location list */}
                                <ScrollView 
                                    style={{ maxHeight: 300 }}
                                    showsVerticalScrollIndicator={false}
                                >
                                    {locations.map((location, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={{ 
                                                paddingHorizontal: 20,
                                                paddingVertical: 16, 
                                                borderBottomWidth: index < locations.length - 1 ? 1 : 0, 
                                                borderBottomColor: '#F3F4F6',
                                                backgroundColor: selectedLocation === location ? '#F8FAFC' : 'transparent'
                                            }}
                                            onPress={() => {
                                                setSelectedLocation(location);
                                                setShowLocationModal(false);
                                            }}
                                        >
                                            <View style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'space-between'
                                            }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                                    <Icon 
                                                        name="location" 
                                                        size={20} 
                                                        color={selectedLocation === location ? theme.colors.primary : theme.colors.subtext}
                                                        style={{ marginRight: 12 }}
                                                    />
                                                    <Text style={{ 
                                                        fontSize: 16, 
                                                        color: selectedLocation === location ? theme.colors.primary : theme.colors.text,
                                                        fontWeight: selectedLocation === location ? '600' : '400',
                                                        flex: 1
                                                    }}>
                                                        {location}
                                                    </Text>
                                                </View>
                                                {selectedLocation === location && (
                                                    <Icon 
                                                        name="checkmark-circle" 
                                                        size={20} 
                                                        color={theme.colors.primary}
                                                    />
                                                )}
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                                </Animated.View>
                            </Pressable>
                        </Animated.View>
                    </Modal>

                    {/* Notifications Modal - Facebook-style dropdown with custom animations */}
                    <Modal
                        visible={showNotifications}
                        transparent
                        animationType="none"
                        onRequestClose={() => setShowNotifications(false)}
                    >
                        <Animated.View 
                            style={{ 
                                flex: 1, 
                                backgroundColor: backgroundOpacity.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.1)']
                                })
                            }} 
                        >
                            <Pressable 
                                style={{ flex: 1 }} 
                                onPress={() => setShowNotifications(false)}
                            >
                                {/* Notification dropdown positioned near the bell icon */}
                                <Animated.View style={{
                                    position: 'absolute',
                                    top: 70, // Position below the header
                                    right: 16, // Align with notification icon
                                    backgroundColor: '#FFF',
                                    borderRadius: 12,
                                    padding: 0,
                                    width: 320,
                                    maxHeight: 400,
                                    elevation: 8,
                                    shadowColor: '#000',
                                    shadowOpacity: 0.15,
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowRadius: 12,
                                    borderWidth: 1,
                                    borderColor: '#E5E7EB',
                                    transform: [{ translateY: modalTranslateY }],
                                    opacity: modalOpacity
                                }}>
                                {/* Header with title and close button */}
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    paddingHorizontal: 16,
                                    paddingVertical: 12,
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#F3F4F6'
                                }}>
                                    <Text style={{ 
                                        fontSize: 18, 
                                        fontWeight: 'bold', 
                                        color: theme.colors.text 
                                    }}>
                                        Notifications
                                    </Text>
                                    <TouchableOpacity 
                                        onPress={() => setShowNotifications(false)}
                                        style={{
                                            padding: 4,
                                            borderRadius: 6
                                        }}
                                    >
                                        <Icon name="close" size={20} color={theme.colors.subtext} />
                                    </TouchableOpacity>
                                </View>
                                
                                {/* Notifications list */}
                                <ScrollView 
                                    style={{ maxHeight: 320 }}
                                    showsVerticalScrollIndicator={false}
                                >
                                    {notifications.map((notification, index) => (
                                        <TouchableOpacity 
                                            key={notification.id} 
                                            style={{ 
                                                paddingHorizontal: 16,
                                                paddingVertical: 12, 
                                                borderBottomWidth: index < notifications.length - 1 ? 1 : 0, 
                                                borderBottomColor: '#F3F4F6',
                                                backgroundColor: !notification.read ? '#F8FAFC' : 'transparent'
                                            }}
                                            onPress={() => {
                                                // Handle notification tap
                                                console.log('Notification tapped:', notification.title);
                                                setShowNotifications(false);
                                                router.push('/notifications');
                                            }}
                                        >
                                            <View style={{ 
                                                flexDirection: 'row', 
                                                justifyContent: 'space-between', 
                                                alignItems: 'flex-start' 
                                            }}>
                                                <View style={{ flex: 1, marginRight: 8 }}>
                                                    <Text style={{ 
                                                        fontSize: 15, 
                                                        fontWeight: !notification.read ? '600' : '500', 
                                                        color: theme.colors.text,
                                                        marginBottom: 2
                                                    }}>
                                                        {notification.title}
                                                    </Text>
                                                    <Text style={{ 
                                                        fontSize: 13, 
                                                        color: theme.colors.subtext, 
                                                        lineHeight: 18
                                                    }}>
                                                        {notification.message}
                                                    </Text>
                                                    <Text style={{ 
                                                        fontSize: 11, 
                                                        color: theme.colors.primary, 
                                                        marginTop: 4,
                                                        fontWeight: '500'
                                                    }}>
                                                        {notification.time}
                                                    </Text>
                                                </View>
                                                {!notification.read && (
                                                    <View style={{ 
                                                        width: 8, 
                                                        height: 8, 
                                                        backgroundColor: theme.colors.primary, 
                                                        borderRadius: 4, 
                                                        marginTop: 6 
                                                    }} />
                                                )}
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                    
                                    {/* View all notifications footer */}
                                    <TouchableOpacity 
                                        style={{
                                            paddingVertical: 12,
                                            alignItems: 'center',
                                            borderTopWidth: 1,
                                            borderTopColor: '#F3F4F6',
                                            marginTop: 4
                                        }}
                                        onPress={() => {
                                            setShowNotifications(false);
                                            // Navigate to full notifications page
                                            router.push('/notifications');
                                        }}
                                    >
                                        <Text style={{
                                            color: theme.colors.primary,
                                            fontWeight: '600',
                                            fontSize: 14
                                        }}>
                                            View All Notifications
                                        </Text>
                                    </TouchableOpacity>
                                </ScrollView>
                                </Animated.View>
                            </Pressable>
                        </Animated.View>
                    </Modal>


                    {/* Quick Services */}
                    <View style={styles.section}>
                        <View style={styles.quickServicesRow}>
                            {services.map((service, idx) => (
                                <TouchableOpacity
                                    key={service.id}
                                    style={[styles.serviceButton, idx !== services.length - 1 && { marginRight: theme.spacing.sm }]}
                                    onPress={() => router.push('/coming-soon')}
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
                                <TouchableOpacity key={offer.id} onPress={() => handleOfferPress(offer)}>
                                    <LinearGradient
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
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Categories */}
                    <View style={styles.section}>
                        <View style={styles.categoriesHeader}>
                            <Text style={styles.sectionTitle}>Categories</Text>
                            <TouchableOpacity onPress={handleViewAllCategories}>
                                <Text style={styles.linkText}>View All</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={categories}
                            keyExtractor={item => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.categoryButton} onPress={() => handleCategoryPress(item)}>
                                    <View style={[styles.categoryIcon, { backgroundColor: item.color }]}>
                                        <Text style={styles.categoryIconText}>{item.icon}</Text>
                                    </View>
                                    <Text style={styles.categoryText}>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                            numColumns={2}
                            columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: theme.spacing.sm }}
                            scrollEnabled={false} />
                    </View>

                    {/* Nearby Pharmacies */}
                    <View style={styles.section}>
                        <View style={styles.categoriesHeader}>
                            <Text style={styles.sectionTitle}>Nearby Pharmacies</Text>
                            <TouchableOpacity onPress={handleViewAllPharmacies}>
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
                                            <TouchableOpacity style={styles.pharmacyActionButton} onPress={() => handlePharmacyCall(pharmacy)}>
                                                <Icon name="call" size={16} color="#2563EB" />
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.pharmacyActionButton} onPress={() => handlePharmacyLocation(pharmacy)}>
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
                            <TouchableOpacity onPress={handleViewAllProducts}>
                                <Text style={styles.linkText}>View All</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={featuredProducts}
                            keyExtractor={item => item.id.toString()}
                            renderItem={({ item }) => (
                                <View style={[styles.productCard, { justifyContent: 'flex-start' }]}>
                                    <View style={styles.productImageWrapper}>
                                        <Text style={styles.productImage}>{item.image}</Text>
                                        <TouchableOpacity
                                            onPress={() => toggleFavorite(item.id)}
                                            style={styles.favoriteButton}
                                        >
                                            <Icon name="heart" size={16} color={isFavorite(item.id) ? '#EF4444' : '#D1D5DB'} />
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
                                        <Text style={styles.productPrice}><FormatVND value={item.price} /></Text>
                                        {item.originalPrice > item.price && (
                                            <Text style={styles.productOriginalPrice}><FormatVND value={item.originalPrice} /></Text>
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
                            scrollEnabled={false} />
                    </View>
                </>}
                showsVerticalScrollIndicator={false}
                renderItem={undefined}
            />
        </SafeAreaView>
    );
}

export default HomePage;