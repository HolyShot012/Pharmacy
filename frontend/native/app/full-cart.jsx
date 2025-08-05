import { AntDesign } from '@expo/vector-icons';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import { useCart } from '../components/CartContext';
import { styles } from '../components/ui/Styles';
import { theme } from '../components/ui/Theme';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormatVND from '../components/FormatVND';

const FullCartPage = () => {
    const { cartItems, updateQuantity, clearCart } = useCart();
    const router = useRouter();
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleProceedToCheckout = () => {
        router.push('/checkout');
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top']}>
            {/* Header */}
            <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                paddingHorizontal: theme.spacing.md, 
                paddingVertical: theme.spacing.sm,
                borderBottomWidth: 1,
                borderBottomColor: '#E5E7EB'
            }}>
                <TouchableOpacity 
                    onPress={() => router.back()}
                    style={{ marginRight: theme.spacing.md }}
                >
                    <Icon name="arrow-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.colors.text, flex: 1 }}>
                    All Cart Items ({cartItems.length})
                </Text>
                <TouchableOpacity onPress={clearCart}>
                    <Text style={{ color: '#EF4444', fontWeight: 'bold' }}>Clear All</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={cartItems}
                keyExtractor={item => (item.product_id || item.id).toString()}
                renderItem={({ item }) => (
                    <View style={styles.productCard}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ width: 64, height: 64, backgroundColor: '#F3F4F6', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                                <Text style={{ fontSize: 28 }}>{item.image}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontWeight: 'bold', color: theme.colors.text, fontSize: 16 }}>{item.name}</Text>
                                <Text style={{ color: theme.colors.subtext, fontSize: 12, marginTop: 2 }}>{item.category}</Text>
                                {item.manufacturer && (
                                    <Text style={{ color: theme.colors.subtext, fontSize: 11, marginTop: 1 }}>{item.manufacturer}</Text>
                                )}
                                <Text style={{ color: '#16A34A', fontWeight: 'bold', fontSize: 16, marginTop: 4 }}><FormatVND value={item.price} /></Text>
                                {item.need_approval && (
                                    <View style={{ backgroundColor: '#FEF3C7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, alignSelf: 'flex-start', marginTop: 4 }}>
                                        <Text style={{ color: '#92400E', fontSize: 10, fontWeight: 'bold' }}>Prescription Required</Text>
                                    </View>
                                )}
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity
                                    onPress={() => updateQuantity(item.product_id || item.id, -1)}
                                    style={{ backgroundColor: '#E5E7EB', borderRadius: 999, padding: 8, marginRight: 4 }}
                                >
                                    <AntDesign name="minus" size={16} color={theme.colors.text} />
                                </TouchableOpacity>
                                <Text style={{ width: 24, textAlign: 'center', fontWeight: 'bold' }}>{item.quantity}</Text>
                                <TouchableOpacity
                                    onPress={() => updateQuantity(item.product_id || item.id, 1)}
                                    style={{ backgroundColor: theme.colors.primary, borderRadius: 999, padding: 8, marginLeft: 4 }}
                                >
                                    <AntDesign name="plus" size={16} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F3F4F6' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={{ color: theme.colors.subtext, fontSize: 14 }}>Subtotal</Text>
                                <Text style={{ fontWeight: 'bold', color: theme.colors.text, fontSize: 14 }}>
                                    <FormatVND value={item.price * item.quantity} />
                                </Text>
                            </View>
                        </View>
                    </View>
                )}
                ListFooterComponent={cartItems.length > 0 ? (
                    <View style={styles.productCard}>
                        <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 16, color: theme.colors.text }}>Order Summary</Text>

                        {/* Items breakdown */}
                        {cartItems.map((item, index) => (
                            <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                                <Text style={{ color: theme.colors.subtext, flex: 1 }}>
                                    {item.name} x{item.quantity}
                                </Text>
                                <Text style={{ fontWeight: 'bold', color: theme.colors.text }}>
                                    <FormatVND value={item.price * item.quantity} />
                                </Text>
                            </View>
                        ))}

                        <View style={{ height: 1, backgroundColor: '#F3F4F6', marginVertical: 12 }} />

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                            <Text style={{ color: theme.colors.subtext }}>Subtotal</Text>
                            <Text style={{ fontWeight: 'bold' }}><FormatVND value={total} /></Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                            <Text style={{ color: theme.colors.subtext }}>Delivery Fee</Text>
                            <Text style={{ fontWeight: 'bold' }}><FormatVND value={5000} /></Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                            <Text style={{ color: theme.colors.subtext }}>Tax (8%)</Text>
                            <Text style={{ fontWeight: 'bold' }}><FormatVND value={total * 0.08} /></Text>
                        </View>

                        <View style={{ height: 1, backgroundColor: '#F3F4F6', marginVertical: 8 }} />

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 18, color: theme.colors.text }}>Total</Text>
                            <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#16A34A' }}>
                                <FormatVND value={total + 5000 + (total * 0.08)} />
                            </Text>
                        </View>

                        <TouchableOpacity 
                            onPress={handleProceedToCheckout}
                            style={{
                                backgroundColor: theme.colors.primary,
                                padding: 16,
                                borderRadius: 12,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 4,
                                elevation: 3
                            }}
                        >
                            <MaterialIcons name="credit-card" size={20} color="#fff" style={{ marginRight: 8 }} />
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Proceed to Checkout</Text>
                        </TouchableOpacity>
                    </View>
                ) : null}
                ListEmptyComponent={(
                    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, marginTop: 100, paddingHorizontal: theme.spacing.md }}>
                        <Text style={{ fontSize: 64, marginBottom: 24 }}>🛒</Text>
                        <Text style={{ fontSize: 24, fontWeight: 'bold', color: theme.colors.text, marginBottom: 8, textAlign: 'center' }}>
                            Your cart is empty
                        </Text>
                        <Text style={{ color: theme.colors.subtext, marginBottom: 32, textAlign: 'center', fontSize: 16 }}>
                            Add some products to get started
                        </Text>
                        <TouchableOpacity
                            onPress={() => router.push('/(tabs)/products')}
                            style={{
                                backgroundColor: theme.colors.primary,
                                paddingHorizontal: 32,
                                paddingVertical: 16,
                                borderRadius: 12,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 4,
                                elevation: 3
                            }}
                        >
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Browse Products</Text>
                        </TouchableOpacity>
                    </View>
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </SafeAreaView>
    );
};

export default FullCartPage;