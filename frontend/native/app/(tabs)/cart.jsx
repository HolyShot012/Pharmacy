import { AntDesign } from '@expo/vector-icons';
import { FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../../components/ui/Theme';

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

export default CartPage;