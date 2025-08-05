import { AntDesign } from '@expo/vector-icons';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useCart } from '../components/CartContext';
import { useAuth } from '../components/AuthContext';
import { styles } from '../components/ui/Styles';
import { theme } from '../components/ui/Theme';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FormatVND from '../components/FormatVND';

const CheckoutPage = () => {
    const { cartItems, clearCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [selectedPayment, setSelectedPayment] = useState('momo');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 2.50;
    const total = subtotal + deliveryFee;

    const paymentMethods = [
        { id: 'momo', name: 'Momo', icon: 'smartphone', description: 'Pay with Momo e-wallet' },
        { id: 'zalopay', name: 'Zalopay', icon: 'smartphone', description: 'Pay with Zalopay e-wallet' },
        { id: 'cash', name: 'Cash on Delivery', icon: 'money', description: 'Pay when you receive your order' }
    ];

    const handlePlaceOrder = () => {
        setShowSuccessModal(true);
    };

    const handleSuccessModalClose = () => {
        setShowSuccessModal(false);
        clearCart();
        router.push('/(tabs)/products/');
    };

    if (cartItems.length === 0) {
        return (
            <View style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.md }}>
                <MaterialIcons name="shopping-cart" size={64} color={theme.colors.subtext} />
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.text, marginTop: theme.spacing.md, textAlign: 'center' }}>
                    Your cart is empty
                </Text>
                <Text style={{ color: theme.colors.subtext, textAlign: 'center', marginTop: theme.spacing.sm }}>
                    Add some items to your cart before checkout
                </Text>
                <TouchableOpacity 
                    onPress={() => router.push('/(tabs)/')}
                    style={{ backgroundColor: theme.colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, marginTop: theme.spacing.md }}
                >
                    <Text style={{ color: theme.colors.white, fontWeight: 'bold' }}>Continue Shopping</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
                {/* Header */}
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: theme.spacing.md, paddingTop: theme.spacing.lg }}>
                    <TouchableOpacity onPress={() => router.back()} style={{ marginRight: theme.spacing.md }}>
                        <AntDesign name="arrowleft" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 24, fontWeight: 'bold', color: theme.colors.text }}>Checkout</Text>
                </View>

                {/* Order Summary */}
                <View style={{ margin: theme.spacing.md, backgroundColor: theme.colors.white, borderRadius: 12, padding: theme.spacing.md }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.text, marginBottom: theme.spacing.md }}>
                        Order Summary
                    </Text>
                    {cartItems.map((item) => (
                        <View key={item.product_id || item.id} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.sm }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontWeight: '500', color: theme.colors.text }}>{item.name}</Text>
                                <Text style={{ color: theme.colors.subtext, fontSize: 12 }}>Qty: {item.quantity}</Text>
                            </View>
                            <Text style={{ fontWeight: 'bold', color: theme.colors.text }}><FormatVND value={item.price * item.quantity} /></Text>
                        </View>
                    ))}
                    
                    <View style={{ borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: theme.spacing.sm, marginTop: theme.spacing.sm }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                            <Text style={{ color: theme.colors.subtext }}>Subtotal</Text>
                            <Text style={{ color: theme.colors.text }}><FormatVND value={subtotal} /></Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                            <Text style={{ color: theme.colors.subtext }}>Delivery Fee</Text>
                            <Text style={{ color: theme.colors.text }}><FormatVND value={deliveryFee} /></Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 8, marginTop: 8 }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.text }}>Total</Text>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.primary }}><FormatVND value={total} /></Text>
                        </View>
                    </View>
                </View>

                {/* Payment Methods */}
                <View style={{ margin: theme.spacing.md, backgroundColor: theme.colors.white, borderRadius: 12, padding: theme.spacing.md }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.text, marginBottom: theme.spacing.md }}>
                        Payment Method
                    </Text>
                    
                    {paymentMethods.map((method) => (
                        <TouchableOpacity
                            key={method.id}
                            onPress={() => setSelectedPayment(method.id)}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                padding: theme.spacing.md,
                                borderWidth: 2,
                                borderColor: selectedPayment === method.id ? theme.colors.primary : '#E5E7EB',
                                borderRadius: 8,
                                marginBottom: theme.spacing.sm,
                                backgroundColor: selectedPayment === method.id ? '#EBF4FF' : 'transparent'
                            }}
                        >
                            <View style={{ 
                                width: 48, 
                                height: 48, 
                                backgroundColor: '#F3F4F6', 
                                borderRadius: 24, 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                marginRight: theme.spacing.md 
                            }}>
                                <MaterialIcons 
                                    name={method.icon} 
                                    size={24} 
                                    color={selectedPayment === method.id ? theme.colors.primary : theme.colors.subtext} 
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontWeight: 'bold', color: theme.colors.text, fontSize: 16 }}>
                                    {method.name}
                                </Text>
                                <Text style={{ color: theme.colors.subtext, fontSize: 12, marginTop: 2 }}>
                                    {method.description}
                                </Text>
                            </View>
                            <View style={{
                                width: 20,
                                height: 20,
                                borderRadius: 10,
                                borderWidth: 2,
                                borderColor: selectedPayment === method.id ? theme.colors.primary : '#D1D5DB',
                                backgroundColor: selectedPayment === method.id ? theme.colors.primary : 'transparent',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {selectedPayment === method.id && (
                                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.white }} />
                                )}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Delivery Info */}
                <View style={{ margin: theme.spacing.md, backgroundColor: theme.colors.white, borderRadius: 12, padding: theme.spacing.md }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.text, marginBottom: theme.spacing.md }}>
                        Delivery Information
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.sm }}>
                        <MaterialIcons name="location-on" size={20} color={theme.colors.primary} />
                        <Text style={{ marginLeft: theme.spacing.sm, color: theme.colors.text, flex: 1 }}>
                            {user?.current_address || 'No address available'}
                            {user?.city && `, ${user.city}`}
                            {user?.province && `, ${user.province}`}
                        </Text>
                    </View>
                    {user?.phone_number && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.sm }}>
                            <MaterialIcons name="phone" size={20} color={theme.colors.primary} />
                            <Text style={{ marginLeft: theme.spacing.sm, color: theme.colors.text, flex: 1 }}>
                                {user.phone_number}
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Place Order Button */}
            <View style={{ padding: theme.spacing.md, backgroundColor: theme.colors.white, borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingBottom: insets.bottom }}>
                <TouchableOpacity
                    onPress={handlePlaceOrder}
                    style={{
                        backgroundColor: theme.colors.primary,
                        paddingVertical: 16,
                        borderRadius: 8,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <MaterialIcons name="shopping-cart" size={20} color={theme.colors.white} style={{ marginRight: 8 }} />
                    <Text style={{ color: theme.colors.white, fontWeight: 'bold', fontSize: 16 }}>
                        Place Order • <FormatVND value={total} />
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Success Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={showSuccessModal}
                onRequestClose={() => setShowSuccessModal(false)}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: theme.spacing.md
                }}>
                    <View style={{
                        backgroundColor: theme.colors.white,
                        borderRadius: 16,
                        padding: theme.spacing.lg,
                        width: '90%',
                        maxWidth: 400,
                        alignItems: 'center'
                    }}>
                        <View style={{
                            width: 80,
                            height: 80,
                            backgroundColor: '#4CAF50',
                            borderRadius: 40,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: theme.spacing.md
                        }}>
                            <MaterialIcons name="check" size={48} color={theme.colors.white} />
                        </View>
                        
                        <Text style={{
                            fontSize: 24,
                            fontWeight: 'bold',
                            color: theme.colors.text,
                            textAlign: 'center',
                            marginBottom: theme.spacing.sm
                        }}>
                            Order Successful!
                        </Text>
                        
                        <Text style={{
                            fontSize: 16,
                            color: theme.colors.subtext,
                            textAlign: 'center',
                            marginBottom: theme.spacing.md,
                            lineHeight: 24
                        }}>
                            Your order has been placed successfully and will be delivered soon.
                        </Text>
                        
                        <Text style={{
                            fontSize: 14,
                            color: theme.colors.subtext,
                            textAlign: 'center',
                            marginBottom: theme.spacing.lg
                        }}>
                            Payment method: {paymentMethods.find(p => p.id === selectedPayment)?.name}
                        </Text>
                        
                        <TouchableOpacity
                            onPress={handleSuccessModalClose}
                            style={{
                                backgroundColor: theme.colors.primary,
                                paddingVertical: 14,
                                paddingHorizontal: 32,
                                borderRadius: 8,
                                width: '100%'
                            }}
                        >
                            <Text style={{
                                color: theme.colors.white,
                                fontWeight: 'bold',
                                fontSize: 16,
                                textAlign: 'center'
                            }}>
                                Continue Shopping
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default CheckoutPage;
