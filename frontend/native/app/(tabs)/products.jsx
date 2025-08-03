import React, { useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { FlatList, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useCart } from '../../components/CartContext';
import { useFavorites } from '../../components/FavoritesContext';
import { styles } from '../../components/ui/Styles';
import { theme } from '../../components/ui/Theme';

const FILTER_BUTTON_HEIGHT = 36;

const ProductPage = () => {
  const { addToCart } = useCart();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 1, name: 'Medicines', icon: '💊', color: '#fee2e2' },
    { id: 2, name: 'Medical Equipments', icon: '🩺', color: '#d1fae5' },
    { id: 3, name: 'Cosmeceuticals', icon: '🧴', color: '#dbeafe' },
    { id: 4, name: 'Self-care', icon: '🌿', color: '#fce7f3' },
  ];

  const featuredProducts = [
    {
      product_id: 1,
      name: 'Paracetamol 500mg',
      category: 'Medicines',
      price: 25.50,
      quantity: 100,
      manufacturer: 'PharmaCorp',
      prescription: 'Not Required',
      class_level: 1,
      need_approval: false,
      expiration_date: '2025-12-31',
      image: '💊',
      rating: 4.5,
      originalPrice: 30.00,
      discount: 15
    },
    {
      product_id: 2,
      name: 'Hand Sanitizer 500ml',
      category: 'Self-care',
      price: 45.00,
      quantity: 50,
      manufacturer: 'CleanCare Ltd',
      prescription: 'Not Required',
      class_level: 0,
      need_approval: false,
      expiration_date: '2026-06-30',
      image: '🧴',
      rating: 4.8,
      originalPrice: 50.00,
      discount: 10
    },
    {
      product_id: 3,
      name: 'Vitamin C 1000mg',
      category: 'Self-care',
      price: 35.75,
      quantity: 75,
      manufacturer: 'VitaHealth',
      prescription: 'Not Required',
      class_level: 0,
      need_approval: false,
      expiration_date: '2025-09-15',
      image: '🧪',
      rating: 4.6,
      originalPrice: 40.00,
      discount: 11
    },
    {
      product_id: 4,
      name: 'Surgical Face Mask (Pack of 50)',
      category: 'Medical Equipments',
      price: 120.00,
      quantity: 0,
      manufacturer: 'MedSupply Co',
      prescription: 'Not Required',
      class_level: 1,
      need_approval: false,
      expiration_date: '2027-03-20',
      image: '😷',
      rating: 4.4,
      originalPrice: 140.00,
      discount: 14
    },
    {
      product_id: 5,
      name: 'Digital Thermometer',
      category: 'Medical Equipments',
      price: 85.00,
      quantity: 25,
      manufacturer: 'TechMed',
      prescription: 'Not Required',
      class_level: 1,
      need_approval: false,
      expiration_date: '2028-01-10',
      image: '🌡️',
      rating: 4.7,
      originalPrice: 100.00,
      discount: 15
    },
    {
      product_id: 6,
      name: 'Anti-Aging Serum',
      category: 'Cosmeceuticals',
      price: 150.00,
      quantity: 30,
      manufacturer: 'DermaTech',
      prescription: 'Required',
      class_level: 2,
      need_approval: true,
      expiration_date: '2025-08-30',
      image: '🧪',
      rating: 4.9,
      originalPrice: 180.00,
      discount: 17
    },
    {
      product_id: 7,
      name: 'Antibiotic Cream',
      category: 'Medicines',
      price: 55.00,
      quantity: 40,
      manufacturer: 'MediCare',
      prescription: 'Required',
      class_level: 2,
      need_approval: true,
      expiration_date: '2025-11-15',
      image: '🧴',
      rating: 4.3,
      originalPrice: 65.00,
      discount: 15
    },
  ];

  // Filter products based on selected category and search query
  const filteredProducts = featuredProducts.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCategoryPress = (categoryName) => {
    setSelectedCategory(categoryName);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Header and filter row */}
      <View style={{ paddingHorizontal: theme.spacing.md, paddingTop: theme.spacing.lg, backgroundColor: theme.colors.background }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.md }}>
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
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: theme.spacing.md, marginTop: theme.spacing.sm }}
          contentContainerStyle={{ paddingLeft: theme.spacing.md }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: selectedCategory === 'All' ? theme.colors.primary : '#E5E7EB',
              paddingHorizontal: 16,
              height: FILTER_BUTTON_HEIGHT,
              justifyContent: 'center',
              borderRadius: 999,
              marginRight: 8
            }}
            onPress={() => handleCategoryPress('All')}
          >
            <Text style={{
              color: selectedCategory === 'All' ? '#fff' : theme.colors.text,
              fontWeight: selectedCategory === 'All' ? 'bold' : 'normal'
            }}>
              All
            </Text>
          </TouchableOpacity>

          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={{
                backgroundColor: selectedCategory === category.name ? theme.colors.primary : '#E5E7EB',
                paddingHorizontal: 16,
                height: FILTER_BUTTON_HEIGHT,
                justifyContent: 'center',
                borderRadius: 999,
                marginRight: 8
              }}
              onPress={() => handleCategoryPress(category.name)}
            >
              <Text style={{
                color: selectedCategory === category.name ? '#fff' : theme.colors.text,
                fontWeight: selectedCategory === category.name ? 'bold' : 'normal'
              }}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={
          filteredProducts.length % 2 === 1
            ? [...filteredProducts, { product_id: 'placeholder' }]
            : filteredProducts
        }
        keyExtractor={item => item.product_id.toString()}
        renderItem={({ item }) => {
          if (item.product_id === 'placeholder') {
            return <View style={[styles.productCard, { backgroundColor: 'transparent', elevation: 0, shadowOpacity: 0 }]} />;
          }

          const isInStock = item.quantity > 0;

          return (
            <View style={[styles.productCard, { justifyContent: 'flex-start' }]}>
              <View style={styles.productImageWrapper}>
                <Text style={styles.productImage}>{item.image}</Text>
                <TouchableOpacity
                  onPress={() => toggleFavorite(item.product_id)}
                  style={styles.favoriteButton}
                >
                  <Icon name="heart" size={16} color={isFavorite(item.product_id) ? '#EF4444' : '#D1D5DB'} />
                </TouchableOpacity>
                {item.discount > 0 && (
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>-{item.discount}%</Text>
                  </View>
                )}
                {item.need_approval && (
                  <View style={[styles.discountBadge, { backgroundColor: '#FEF3C7', top: 8, right: 8 }]}>
                    <Text style={[styles.discountText, { color: '#92400E' }]}>Rx</Text>
                  </View>
                )}
              </View>

              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productCategory}>{item.category}</Text>
              <Text style={[styles.productCategory, { fontSize: 11, color: theme.colors.subtext }]}>
                {item.manufacturer}
              </Text>

              <View style={styles.productRatingRow}>
                <Icon name="star" size={14} color="#FBBF24" />
                <Text style={styles.productRating}>{item.rating}</Text>
                <Text style={[styles.productRating, { marginLeft: 8, color: theme.colors.subtext }]}>
                  Qty: {item.quantity}
                </Text>
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
                  disabled={!isInStock}
                  style={{
                    backgroundColor: isInStock ? theme.colors.primary : '#E5E7EB',
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    height: 32,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 8,
                    flex: 1
                  }}
                >
                  <Text style={{
                    color: isInStock ? '#fff' : '#9CA3AF',
                    fontSize: 12,
                    fontWeight: 'bold'
                  }}>
                    Add to Cart
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Reserve space for Out of Stock */}
              <View style={{ minHeight: 16, justifyContent: 'center', marginTop: 4 }}>
                {!isInStock && (
                  <Text style={[styles.outOfStock, { marginTop: 0, textAlign: 'center' }]}>
                    Out of Stock
                  </Text>
                )}
              </View>
            </View>
          );
        }}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: theme.spacing.sm }}
        contentContainerStyle={{ paddingBottom: 0, paddingHorizontal: theme.spacing.md }}
      />
    </View>
  );
};

export default ProductPage;