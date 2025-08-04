import React, { useState, useEffect } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { FlatList, ScrollView, Text, TextInput, TouchableOpacity, View, Modal, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useCart } from '../../components/CartContext';
import { useFavorites } from '../../components/FavoritesContext';
import { styles } from '../../components/ui/Styles';
import { theme } from '../../components/ui/Theme';
import { useLocalSearchParams } from 'expo-router';

const FILTER_BUTTON_HEIGHT = 36;

const ProductPage = () => {
  const { addToCart } = useCart();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const params = useLocalSearchParams();
  
  // Filter modal state
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    classLevels: [], // Array of selected class levels
    inStockOnly: false,
    priceRange: 'all' // 'all', 'under25', '25to50', '50to100', 'over100'
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;

  const categories = [
    { id: 1, name: 'Medicines', icon: '💊', color: '#fee2e2' },
    { id: 2, name: 'Medical Equipments', icon: '🩺', color: '#d1fae5' },
    { id: 3, name: 'Cosmeceuticals', icon: '🧴', color: '#dbeafe' },
    { id: 4, name: 'Selfcare', icon: '🧘‍♀️', color: '#fce7f3' },
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
      category: 'Selfcare',
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
      category: 'Selfcare',
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
    {
      product_id: 8,
      name: 'Blood Pressure Monitor',
      category: 'Medical Equipments',
      price: 89.99,
      quantity: 15,
      manufacturer: 'HealthTech',
      prescription: 'Not Required',
      class_level: 3,
      need_approval: false,
      expiration_date: '2028-05-20',
      image: '🩺',
      rating: 4.6,
      originalPrice: 99.99,
      discount: 10
    },
    {
      product_id: 9,
      name: 'Insulin Pen',
      category: 'Medicines',
      price: 15.75,
      quantity: 80,
      manufacturer: 'DiabetesCare',
      prescription: 'Required',
      class_level: 4,
      need_approval: true,
      expiration_date: '2025-08-15',
      image: '💉',
      rating: 4.8,
      originalPrice: 18.00,
      discount: 12
    },
    {
      product_id: 10,
      name: 'Moisturizing Lotion',
      category: 'Selfcare',
      price: 12.50,
      quantity: 200,
      manufacturer: 'SkinCare Plus',
      prescription: 'Not Required',
      class_level: 0,
      need_approval: false,
      expiration_date: '2026-12-31',
      image: '🧴',
      rating: 4.2,
      originalPrice: 15.00,
      discount: 17
    },
    {
      product_id: 11,
      name: 'Moisturizing Lotion',
      category: 'Selfcare',
      price: 12.50,
      quantity: 200,
      manufacturer: 'SkinCare Plus',
      prescription: 'Not Required',
      class_level: 0,
      need_approval: false,
      expiration_date: '2026-12-31',
      image: '🧴',
      rating: 4.2,
      originalPrice: 15.00,
      discount: 17
    },
    {
      product_id: 12,
      name: 'Moisturizing Lotion',
      category: 'Selfcare',
      price: 12.50,
      quantity: 200,
      manufacturer: 'SkinCare Plus',
      prescription: 'Not Required',
      class_level: 0,
      need_approval: false,
      expiration_date: '2026-12-31',
      image: '🧴',
      rating: 4.2,
      originalPrice: 15.00,
      discount: 17
    },
    {
      product_id: 13,
      name: 'Moisturizing Lotion',
      category: 'Selfcare',
      price: 12.50,
      quantity: 200,
      manufacturer: 'SkinCare Plus',
      prescription: 'Not Required',
      class_level: 0,
      need_approval: false,
      expiration_date: '2026-12-31',
      image: '🧴',
      rating: 4.2,
      originalPrice: 15.00,
      discount: 17
    },
    {
      product_id: 14,
      name: 'Moisturizing Lotion',
      category: 'Selfcare',
      price: 12.50,
      quantity: 200,
      manufacturer: 'SkinCare Plus',
      prescription: 'Not Required',
      class_level: 0,
      need_approval: false,
      expiration_date: '2026-12-31',
      image: '🧴',
      rating: 4.2,
      originalPrice: 15.00,
      discount: 17
    },
    {
      product_id: 15,
      name: 'Moisturizing Lotion',
      category: 'Selfcare',
      price: 12.50,
      quantity: 200,
      manufacturer: 'SkinCare Plus',
      prescription: 'Not Required',
      class_level: 0,
      need_approval: false,
      expiration_date: '2026-12-31',
      image: '🧴',
      rating: 4.2,
      originalPrice: 15.00,
      discount: 17
    },
    {
      product_id: 16,
      name: 'Moisturizing Lotion',
      category: 'Selfcare',
      price: 12.50,
      quantity: 200,
      manufacturer: 'SkinCare Plus',
      prescription: 'Not Required',
      class_level: 0,
      need_approval: false,
      expiration_date: '2026-12-31',
      image: '🧴',
      rating: 4.2,
      originalPrice: 15.00,
      discount: 17
    },
  ];

  // Handle URL parameters to set initial category
  useEffect(() => {
    if (params.category) {
      // Check if the category from params exists in our categories list
      const categoryExists = categories.some(cat => cat.name === params.category);
      if (categoryExists) {
        setSelectedCategory(params.category);
      } else {
        // If category doesn't exist, default to 'All'
        setSelectedCategory('All');
      }
    }
  }, [params.category]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, filters]);

  // Filter products based on all criteria
  const allFilteredProducts = featuredProducts.filter(product => {
    // Category filter
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    
    // Search filter
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Class level filter
    const matchesClassLevel = filters.classLevels.length === 0 || filters.classLevels.includes(product.class_level);
    
    // Stock filter
    const matchesStock = !filters.inStockOnly || product.quantity > 0;
    
    // Price range filter
    let matchesPrice = true;
    switch (filters.priceRange) {
      case 'under25':
        matchesPrice = product.price < 25;
        break;
      case '25to50':
        matchesPrice = product.price >= 25 && product.price <= 50;
        break;
      case '50to100':
        matchesPrice = product.price > 50 && product.price <= 100;
        break;
      case 'over100':
        matchesPrice = product.price > 100;
        break;
      default:
        matchesPrice = true;
    }
    
    return matchesCategory && matchesSearch && matchesClassLevel && matchesStock && matchesPrice;
  });

  // Calculate pagination
  const totalFilteredCount = allFilteredProducts.length;
  const calculatedTotalPages = Math.ceil(totalFilteredCount / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const filteredProducts = allFilteredProducts.slice(startIndex, endIndex);

  // Update pagination state when filtered products change
  useEffect(() => {
    setTotalCount(totalFilteredCount);
    setTotalPages(calculatedTotalPages);
  }, [totalFilteredCount, calculatedTotalPages]);

  const handleCategoryPress = (categoryName) => {
    setSelectedCategory(categoryName);
  };

  const handleClassLevelToggle = (level) => {
    setFilters(prev => ({
      ...prev,
      classLevels: prev.classLevels.includes(level)
        ? prev.classLevels.filter(l => l !== level)
        : [...prev.classLevels, level]
    }));
  };

  const handleStockToggle = () => {
    setFilters(prev => ({
      ...prev,
      inStockOnly: !prev.inStockOnly
    }));
  };

  const handlePriceRangeChange = (range) => {
    setFilters(prev => ({
      ...prev,
      priceRange: range
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      classLevels: [],
      inStockOnly: false,
      priceRange: 'all'
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.classLevels.length > 0) count++;
    if (filters.inStockOnly) count++;
    if (filters.priceRange !== 'all') count++;
    return count;
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than or equal to max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages with ellipsis logic
      if (currentPage <= 3) {
        // Show first 3 pages, ellipsis, and last page
        for (let i = 1; i <= 3; i++) {
          pages.push(i);
        }
        if (totalPages > 4) {
          pages.push('...');
          pages.push(totalPages);
        }
      } else if (currentPage >= totalPages - 2) {
        // Show first page, ellipsis, and last 3 pages
        pages.push(1);
        if (totalPages > 4) {
          pages.push('...');
        }
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show first page, ellipsis, current page and neighbors, ellipsis, last page
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Header and filter row */}
      <View style={{ paddingHorizontal: theme.spacing.md, paddingTop: theme.spacing.lg, backgroundColor: theme.colors.background }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.md }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: theme.colors.text }}>Products</Text>
          <TouchableOpacity 
            onPress={() => setShowFilterModal(true)}
            style={{ position: 'relative' }}
          >
            <MaterialIcons name="filter-list" size={28} color={theme.colors.subtext} />
            {getActiveFiltersCount() > 0 && (
              <View style={{
                position: 'absolute',
                top: -4,
                right: -4,
                backgroundColor: theme.colors.primary,
                borderRadius: 10,
                minWidth: 20,
                height: 20,
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Text style={{
                  color: 'white',
                  fontSize: 12,
                  fontWeight: 'bold'
                }}>
                  {getActiveFiltersCount()}
                </Text>
              </View>
            )}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <View style={{
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.md,
          backgroundColor: theme.colors.background,
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB'
        }}>
          {/* Results info */}
          <View style={{ alignItems: 'center', marginBottom: theme.spacing.sm }}>
            <Text style={{ 
              fontSize: 14, 
              color: theme.colors.subtext,
              textAlign: 'center'
            }}>
              Showing {startIndex + 1}-{Math.min(endIndex, totalCount)} of {totalCount} results
            </Text>
          </View>

          {/* Pagination controls */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            {/* Previous button */}
            <TouchableOpacity
              onPress={handlePreviousPage}
              disabled={currentPage === 1}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                marginHorizontal: 4,
                marginVertical: 2,
                borderRadius: 8,
                backgroundColor: currentPage === 1 ? '#F3F4F6' : theme.colors.primary,
                minWidth: 40,
                alignItems: 'center'
              }}
            >
              <Icon 
                name="chevron-back" 
                size={16} 
                color={currentPage === 1 ? '#9CA3AF' : 'white'} 
              />
            </TouchableOpacity>

            {/* Page numbers */}
            {getPageNumbers().map((page, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => typeof page === 'number' ? handlePageChange(page) : null}
                disabled={page === '...' || page === currentPage}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  marginHorizontal: 2,
                  marginVertical: 2,
                  borderRadius: 8,
                  backgroundColor: page === currentPage 
                    ? theme.colors.primary 
                    : page === '...' 
                      ? 'transparent' 
                      : '#F3F4F6',
                  minWidth: 40,
                  alignItems: 'center'
                }}
              >
                <Text style={{
                  color: page === currentPage 
                    ? 'white' 
                    : page === '...' 
                      ? theme.colors.subtext 
                      : theme.colors.text,
                  fontWeight: page === currentPage ? 'bold' : 'normal',
                  fontSize: 14
                }}>
                  {page}
                </Text>
              </TouchableOpacity>
            ))}

            {/* Next button */}
            <TouchableOpacity
              onPress={handleNextPage}
              disabled={currentPage === totalPages}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                marginHorizontal: 4,
                marginVertical: 2,
                borderRadius: 8,
                backgroundColor: currentPage === totalPages ? '#F3F4F6' : theme.colors.primary,
                minWidth: 40,
                alignItems: 'center'
              }}
            >
              <Icon 
                name="chevron-forward" 
                size={16} 
                color={currentPage === totalPages ? '#9CA3AF' : 'white'} 
              />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{
            backgroundColor: theme.colors.background,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingHorizontal: theme.spacing.lg,
            paddingTop: theme.spacing.lg,
            paddingBottom: theme.spacing.xl,
            maxHeight: '80%'
          }}>
            {/* Modal Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.lg }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.colors.text }}>Filters</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Icon name="close" size={24} color={theme.colors.subtext} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Class Level Filter */}
              <View style={{ marginBottom: theme.spacing.lg }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.text, marginBottom: theme.spacing.sm }}>
                  Class Level
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {[0, 1, 2, 3, 4].map(level => (
                    <TouchableOpacity
                      key={level}
                      onPress={() => handleClassLevelToggle(level)}
                      style={{
                        backgroundColor: filters.classLevels.includes(level) ? theme.colors.primary : '#E5E7EB',
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 20,
                        marginRight: 8,
                        marginBottom: 8
                      }}
                    >
                      <Text style={{
                        color: filters.classLevels.includes(level) ? 'white' : theme.colors.text,
                        fontWeight: filters.classLevels.includes(level) ? 'bold' : 'normal'
                      }}>
                        Level {level}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Stock Filter */}
              <View style={{ marginBottom: theme.spacing.lg }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.text, marginBottom: theme.spacing.sm }}>
                  Availability
                </Text>
                <TouchableOpacity
                  onPress={handleStockToggle}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: filters.inStockOnly ? theme.colors.primary : '#E5E7EB',
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderRadius: 12,
                    alignSelf: 'flex-start'
                  }}
                >
                  <Icon 
                    name={filters.inStockOnly ? "checkmark-circle" : "ellipse-outline"} 
                    size={20} 
                    color={filters.inStockOnly ? 'white' : theme.colors.subtext}
                    style={{ marginRight: 8 }}
                  />
                  <Text style={{
                    color: filters.inStockOnly ? 'white' : theme.colors.text,
                    fontWeight: filters.inStockOnly ? 'bold' : 'normal'
                  }}>
                    In Stock Only
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Price Range Filter */}
              <View style={{ marginBottom: theme.spacing.lg }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.text, marginBottom: theme.spacing.sm }}>
                  Price Range
                </Text>
                <View style={{ gap: 8 }}>
                  {[
                    { key: 'all', label: 'All Prices' },
                    { key: 'under25', label: 'Under $25' },
                    { key: '25to50', label: '$25 - $50' },
                    { key: '50to100', label: '$50 - $100' },
                    { key: 'over100', label: 'Over $100' }
                  ].map(range => (
                    <TouchableOpacity
                      key={range.key}
                      onPress={() => handlePriceRangeChange(range.key)}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: filters.priceRange === range.key ? theme.colors.primary : '#E5E7EB',
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        borderRadius: 12
                      }}
                    >
                      <Icon 
                        name={filters.priceRange === range.key ? "radio-button-on" : "radio-button-off"} 
                        size={20} 
                        color={filters.priceRange === range.key ? 'white' : theme.colors.subtext}
                        style={{ marginRight: 12 }}
                      />
                      <Text style={{
                        color: filters.priceRange === range.key ? 'white' : theme.colors.text,
                        fontWeight: filters.priceRange === range.key ? 'bold' : 'normal'
                      }}>
                        {range.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            {/* Modal Footer */}
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              marginTop: theme.spacing.md,
              paddingTop: theme.spacing.md,
              borderTopWidth: 1,
              borderTopColor: '#E5E7EB'
            }}>
              <TouchableOpacity
                onPress={clearAllFilters}
                style={{
                  backgroundColor: '#E5E7EB',
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                  borderRadius: 12,
                  flex: 1,
                  marginRight: 8,
                  alignItems: 'center'
                }}
              >
                <Text style={{ color: theme.colors.text, fontWeight: '600' }}>Clear All</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => setShowFilterModal(false)}
                style={{
                  backgroundColor: theme.colors.primary,
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                  borderRadius: 12,
                  flex: 1,
                  marginLeft: 8,
                  alignItems: 'center'
                }}
              >
                <Text style={{ color: 'white', fontWeight: '600' }}>
                  Apply Filters ({filteredProducts.length})
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProductPage;