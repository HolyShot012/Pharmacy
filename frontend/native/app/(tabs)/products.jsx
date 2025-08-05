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
import { getProducts } from '../api.jsx'
import FormatVND from '../../components/FormatVND';
import Slider from '@react-native-community/slider';

const FILTER_BUTTON_HEIGHT = 36;

const ProductPage = () => {
  const { addToCart } = useCart();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const params = useLocalSearchParams();
  const [products, setProducts] = useState([]); // State for fetched products

  // Filter modal state
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    classLevels: [], // Array of selected class levels
    inStockOnly: false,
    minPrice: 0,
    maxPrice: 10000000 // 10 million VND default max
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;

  const categories = [
    { id: 1, name: 'Medicine', icon: '💊', color: '#fee2e2' },
    { id: 2, name: 'Medical Equipment', icon: '🩺', color: '#d1fae5' },
    { id: 3, name: 'Cosmetic', icon: '🧴', color: '#dbeafe' },
    { id: 4, name: 'Supplement', icon: '🧘‍♀️', color: '#fce7f3' },
  ];

  // Handle URL parameters to set initial category
  useEffect(() => {
    if (params.category) {
      const categoryExists = categories.some(cat => cat.name === params.category);
      if (categoryExists) {
        setSelectedCategory(params.category);
      } else {
        setSelectedCategory('All');
      }
    }
  }, [params.category]);

  // Fetch all products once (large page size) and filter client-side
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts(1, 1000); // Fetch all products (or as many as possible)
        // Category to emoji mapping
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
        // Transform API data to match frontend expectations
        const transformedProducts = (response.results || []).map(product => ({
          ...product,
          price: parseFloat(product.unit_price || 0),
          in_stock: (product.available_quantity || 0) > 0,
          quantity: product.available_quantity || 0, // Add this for compatibility
          class_level: product.class_level?.toString() || 'OTC',
          rating: 4.5, // Default rating since API doesn't provide it
          image: getCategoryEmoji(product.category)
        }));
        setProducts(transformedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  // Client-side filtering and pagination
  const allFilteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClassLevel = filters.classLevels.length === 0 || filters.classLevels.includes(product.class_level);
    const matchesStock = !filters.inStockOnly || product.quantity > 0;
    let matchesPrice = true;
    matchesPrice = product.price >= filters.minPrice && product.price <= filters.maxPrice;
    return matchesCategory && matchesSearch && matchesClassLevel && matchesStock && matchesPrice;
  });

  // Calculate pagination (adjusted for filtered results)
  const totalFilteredCount = allFilteredProducts.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const filteredProducts = allFilteredProducts.slice(startIndex, endIndex);

  // Update pagination state when filtered products change
  useEffect(() => {
    setTotalCount(totalFilteredCount);
    setTotalPages(Math.ceil(totalFilteredCount / itemsPerPage));
  }, [totalFilteredCount]);

  // Reset to page 1 when filters/search/category change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, filters]);

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
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 3; i++) {
          pages.push(i);
        }
        if (totalPages > 4) {
          pages.push('...');
          pages.push(totalPages);
        }
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        if (totalPages > 4) {
          pages.push('...');
        }
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
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
                <Text style={styles.productPrice}><FormatVND value={item.price} /></Text>
                {item.originalPrice > item.price && (
                  <Text style={styles.productOriginalPrice}><FormatVND value={item.originalPrice} /></Text>
                )}
              </View>

              {item.need_approval && (
                <View style={{
                  backgroundColor: '#FEF3C7',
                  borderRadius: 4,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  alignSelf: 'flex-start',
                  marginTop: 4
                }}>
                  <Text style={{
                    color: '#92400E',
                    fontSize: 10,
                    fontWeight: '600'
                  }}>
                    Prescription Required
                  </Text>
                </View>
              )}

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
        ListEmptyComponent={() => (
          <View style={{ padding: theme.spacing.md, alignItems: 'center' }}>
            <Text style={{ color: theme.colors.subtext }}>No products found.</Text>
          </View>
        )}
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
              Showing {startIndex + 1}-{Math.min(endIndex, totalFilteredCount)} of {totalFilteredCount} results
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
                  Price Range (VND)
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={{ fontSize: 14, color: theme.colors.text }}><FormatVND value={filters.minPrice} /></Text>
                  <Text style={{ fontSize: 14, color: theme.colors.text }}>-</Text>
                  <Text style={{ fontSize: 14, color: theme.colors.text }}><FormatVND value={filters.maxPrice} /></Text>
                </View>
                <Slider
                  style={{ width: '100%', height: 40 }}
                  minimumValue={0}
                  maximumValue={1000000}
                  step={1000}
                  value={filters.minPrice}
                  onValueChange={min => setFilters(prev => ({ ...prev, minPrice: Math.min(min, prev.maxPrice) }))}
                  minimumTrackTintColor={theme.colors.primary}
                  maximumTrackTintColor="#E5E7EB"
                  thumbTintColor={theme.colors.primary}
                />
                <Slider
                  style={{ width: '100%', height: 40 }}
                  minimumValue={0}
                  maximumValue={1000000}
                  step={1000}
                  value={filters.maxPrice}
                  onValueChange={max => setFilters(prev => ({ ...prev, maxPrice: Math.max(max, prev.minPrice) }))}
                  minimumTrackTintColor={theme.colors.primary}
                  maximumTrackTintColor="#E5E7EB"
                  thumbTintColor={theme.colors.primary}
                />
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