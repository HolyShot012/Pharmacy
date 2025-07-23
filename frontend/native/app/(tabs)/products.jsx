import { AntDesign } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { styles } from '../../components/ui/Styles';
import { theme } from '../../components/ui/Theme';


const ProductPage = () => {
const categories = [
  { id: 1, name: 'Pain Relief', icon: '💊', color: '#fee2e2' },
  { id: 2, name: 'Vitamins', icon: '🧪', color: '#d1fae5' },
  { id: 3, name: 'Personal Care', icon: '🧴', color: '#dbeafe' },
  { id: 4, name: 'Baby Care', icon: '🍼', color: '#fce7f3' },
  { id: 5, name: 'First Aid', icon: '🩹', color: '#ffedd5' },
  { id: 6, name: 'Prescription', icon: '📋', color: '#ede9fe' },
];
const featuredProducts = [
  { id: 1, name: 'Paracetamol 500mg', price: 25.50, originalPrice: 30.00, discount: 15, image: '💊', category: 'Pain Relief', rating: 4.5, inStock: true },
  { id: 2, name: 'Hand Sanitizer 500ml', price: 45.00, originalPrice: 50.00, discount: 10, image: '🧴', category: 'Personal Care', rating: 4.8, inStock: true },
  { id: 3, name: 'Vitamin C 1000mg', price: 35.75, originalPrice: 40.00, discount: 11, image: '🧪', category: 'Vitamins', rating: 4.6, inStock: true },
  { id: 4, name: 'Face Mask (Pack of 50)', price: 120.00, originalPrice: 140.00, discount: 14, image: '😷', category: 'Protection', rating: 4.4, inStock: false },
  { id: 5, name: 'Digital Thermometer', price: 85.00, originalPrice: 100.00, discount: 15, image: '🌡️', category: 'Medical Devices', rating: 4.7, inStock: true },
];
const [favorites, setFavorites] = useState([1, 3, 5]);
const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Paracetamol 500mg', price: 25.50, quantity: 2, image: '💊' },
    { id: 2, name: 'Vitamin D3', price: 35.75, quantity: 1, image: '🧪' }
  ]);
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
  return (
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
  )
}
    
  
export default ProductPage