import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Image,
  StatusBar,
  ListRenderItem
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react'


interface Medicine {
  id: number;
  name: string;
  price: string;
  rating: number;
  prescription: boolean;
}

interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
}

interface Order {
  id: number;
  name: string;
  date: string;
  price: string;
}

interface HealthTip {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
}

const app = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cartItems, setCartItems] = useState<number>(2);
  const featuredMedicines: Medicine[] = [
    { id: 1, name: 'Paracetamol 500mg', price: '$5.99', rating: 4.5, prescription: false },
    { id: 2, name: 'Vitamin D3', price: '$12.99', rating: 4.8, prescription: false },
    { id: 3, name: 'Ibuprofen 400mg', price: '$8.50', rating: 4.3, prescription: false },
    { id: 4, name: 'Multivitamin', price: '$15.99', rating: 4.7, prescription: false }
  ];

  const categories: Category[] = [
    { id: 1, name: 'Medicines', icon: 'medical-services', color: '#3B82F6' },
    { id: 2, name: 'Vitamins', icon: 'medication', color: '#10B981' },
    { id: 3, name: 'Personal Care', icon: 'face-smile', color: '#8B5CF6' },
    { id: 4, name: 'Baby Care', icon: 'child-care', color: '#F59E0B' },
    { id: 5, name: 'Health Devices', icon: 'monitor-heart', color: '#EF4444' },
    { id: 6, name: 'Supplements', icon: 'science', color: '#06B6D4' }
  ];

  const addToCart = (item: Medicine) => {
    setCartItems(item => item + 1);
  };
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  }
  const renderCategory: ListRenderItem<Category> = ({ item }) => (
    <TouchableOpacity >
      <View>
        <AntDesign name={item.icon as any} />
      </View>
      <Text style={styles.text}>{item.name}</Text>
    </TouchableOpacity>
  )
  const renderFeaturedProduct: ListRenderItem<Medicine> = ({ item }) => (
    <View >
      <View >
        <MaterialCommunityIcons name="pill" size={40} color="#3B82F6" />
      </View>
      <Text >{item.name}</Text>
      <View >
        <AntDesign name="star" size={16} color="#FCD34D" />
        <Text >{item.rating}</Text>
      </View>
      <View >
        <Text >{item.price}</Text>
        <TouchableOpacity onPress={() => addToCart(item)}>
          <Text >Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
  const renderOrder: ListRenderItem<Order> = ({ item }) => (
    <View>
      <View>
        <MaterialCommunityIcons name='pill' size={24} color="#3B82F6" />
      </View>
      <View>
        <Text >{item.name}</Text>
        <Text >Delivered on {item.date}</Text>
      </View>
      <View>
        <Text >{item.price}</Text>
        <TouchableOpacity>
          <Text >Reorder</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
  const rederHalthTip: ListRenderItem<HealthTip> = ({ item }) => (
    <View >
      <AntDesign name={item.icon as any} size={20} color={item.color} />
      <View >
        <Text >{item.title}</Text>
        <Text >{item.subtitle}</Text>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='dark-content' backgroundColor='#fff' />
      <View style={styles.header}>
        <View style={styles.headerTop} >
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <MaterialIcons name="local-pharmacy" size={24} color='#fff' />
            </View>
            <View>
              <Text style={styles.text}>Pharmacy</Text>
              <Text style={styles.text}>Your Health, Our Priority</Text>
            </View>

          </View>


          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <AntDesign name="bells" size={24} color="#fff" />
              <View style={styles.notificationDot} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton}>
              <AntDesign name="shoppingcart" size={24} color="#6B7280" />
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText} >{cartItems}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* Location */}
      <View style={styles.locationContainer}>
        <MaterialCommunityIcons name="map-marker" size={16} color="#3B82F6" />
        <Text style={styles.locationText}>Delivering To</Text>
        <Text style={styles.locationAddress}>DownTown,NewYork</Text>
      </View>

    </SafeAreaView>


  )
}




export default app

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  text: {
    fontSize: 20,
    color: 'white',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0, height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 32,
    height: 32,
    backgroundColor: '#3B82F6',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    backgroundColor: '#EF4444',
    borderRadius: 4,
  },
  cartBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 20,
    height: 20,
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationAddress: {
    fontSize: 14,
    fontWeight: 500,
    color: '#111827',
  },
  locationText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },

  iconButton: {
    marginLeft: 16,
    position: 'relative',
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  }


})
