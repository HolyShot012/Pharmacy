import React, { useState, useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from '../components/ui/Styles';
import { theme } from '../components/ui/Theme';
import { useRouter } from 'expo-router';
import { useAuth } from '../components/AuthContext';

const OrderCard = ({ order }) => (
    <View style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    }}>
        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12
        }}>
            <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: theme.colors.text
            }}>
                Order #{order.id}
            </Text>
            <View style={{
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderRadius: 16,
                backgroundColor: order.status === 'Completed' ? '#DCFCE7' : 
                               order.status === 'Delivered' ? '#E0F2FE' : '#FEF3C7'
            }}>
                <Text style={{
                    fontSize: 12,
                    fontWeight: '600',
                    color: order.status === 'Completed' ? '#16A34A' : 
                           order.status === 'Delivered' ? '#0284C7' : '#F59E0B'
                }}>
                    {order.status}
                </Text>
            </View>
        </View>

        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8
        }}>
            <Icon name="calendar-outline" size={14} color={theme.colors.subtext} />
            <Text style={{
                fontSize: 14,
                color: theme.colors.subtext,
                marginLeft: 6
            }}>
                {order.date}
            </Text>
        </View>

        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 12
        }}>
            <Icon name="medical-outline" size={14} color={theme.colors.subtext} />
            <Text style={{
                fontSize: 14,
                color: theme.colors.subtext,
                marginLeft: 6
            }}>
                {order.items.length} medication{order.items.length > 1 ? 's' : ''}
            </Text>
        </View>

        <View style={{
            borderTopWidth: 1,
            borderTopColor: '#F3F4F6',
            paddingTop: 12
        }}>
            {order.items.map((item, index) => (
                <View key={index} style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: index < order.items.length - 1 ? 8 : 0
                }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{
                            fontSize: 14,
                            fontWeight: '500',
                            color: theme.colors.text
                        }}>
                            {item.name}
                        </Text>
                        <Text style={{
                            fontSize: 12,
                            color: theme.colors.subtext
                        }}>
                            Qty: {item.quantity} • {item.dosage}
                        </Text>
                    </View>
                    <Text style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: theme.colors.primary
                    }}>
                        ${item.price}
                    </Text>
                </View>
            ))}
        </View>

        {order.prescription && (
            <View style={{
                marginTop: 12,
                padding: 12,
                backgroundColor: '#F8FAFC',
                borderRadius: 8,
                borderLeftWidth: 4,
                borderLeftColor: theme.colors.primary
            }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 4
                }}>
                    <Icon name="document-text-outline" size={16} color={theme.colors.primary} />
                    <Text style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: theme.colors.primary,
                        marginLeft: 6
                    }}>
                        Prescription Details
                    </Text>
                </View>
                <Text style={{
                    fontSize: 12,
                    color: theme.colors.subtext,
                    marginBottom: 2
                }}>
                    Doctor: {order.prescription.doctor}
                </Text>
                <Text style={{
                    fontSize: 12,
                    color: theme.colors.subtext
                }}>
                    Prescription ID: {order.prescription.id}
                </Text>
            </View>
        )}

        <View style={{
            marginTop: 12,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <Text style={{
                fontSize: 16,
                fontWeight: '700',
                color: theme.colors.text
            }}>
                Total: ${order.total}
            </Text>
            <TouchableOpacity style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: theme.colors.primary
            }}>
                <Text style={{
                    fontSize: 12,
                    fontWeight: '600',
                    color: theme.colors.primary
                }}>
                    View Details
                </Text>
            </TouchableOpacity>
        </View>
    </View>
);

const MedicalHistoryPage = () => {
    const router = useRouter();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [orders, setOrders] = useState([]);

    // Mock data for demonstration
    const mockOrders = [
        {
            id: 'ORD-2024-001',
            date: 'March 15, 2024',
            status: 'Delivered',
            total: '89.50',
            items: [
                {
                    name: 'Amoxicillin 500mg',
                    quantity: 30,
                    dosage: '500mg capsules',
                    price: '25.99'
                },
                {
                    name: 'Lisinopril 10mg',
                    quantity: 90,
                    dosage: '10mg tablets',
                    price: '15.75'
                },
                {
                    name: 'Vitamin D3 1000IU',
                    quantity: 60,
                    dosage: '1000IU softgels',
                    price: '12.50'
                }
            ],
            prescription: {
                doctor: 'Dr. Sarah Johnson',
                id: 'RX-2024-0315-001'
            }
        },
        {
            id: 'ORD-2024-002',
            date: 'February 28, 2024',
            status: 'Completed',
            total: '42.25',
            items: [
                {
                    name: 'Ibuprofen 200mg',
                    quantity: 50,
                    dosage: '200mg tablets',
                    price: '8.99'
                },
                {
                    name: 'Omeprazole 20mg',
                    quantity: 30,
                    dosage: '20mg capsules',
                    price: '33.26'
                }
            ],
            prescription: {
                doctor: 'Dr. Michael Chen',
                id: 'RX-2024-0228-002'
            }
        },
        {
            id: 'ORD-2024-003',
            date: 'January 20, 2024',
            status: 'Completed',
            total: '67.80',
            items: [
                {
                    name: 'Metformin 500mg',
                    quantity: 90,
                    dosage: '500mg tablets',
                    price: '22.40'
                },
                {
                    name: 'Aspirin 81mg',
                    quantity: 100,
                    dosage: '81mg tablets',
                    price: '6.50'
                },
                {
                    name: 'Atorvastatin 20mg',
                    quantity: 30,
                    dosage: '20mg tablets',
                    price: '38.90'
                }
            ],
            prescription: {
                doctor: 'Dr. Emily Rodriguez',
                id: 'RX-2024-0120-003'
            }
        }
    ];

    useEffect(() => {
        loadMedicalHistory();
    }, []);

    const loadMedicalHistory = async () => {
        try {
            setIsLoading(true);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setOrders(mockOrders);
        } catch (error) {
            console.error('Error loading medical history:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadMedicalHistory();
        setRefreshing(false);
    };

    if (isLoading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center' }]} edges={['top']}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={{ marginTop: 16, color: theme.colors.subtext }}>Loading medical history...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: '#F9FAFB' }]} edges={['top']}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: '#FFFFFF', elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4 }]}>
                <TouchableOpacity 
                    onPress={() => router.back()}
                    style={{ padding: 8, marginRight: 16 }}
                >
                    <Icon name="arrow-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                
                <View style={{ flex: 1 }}>
                    <Text style={[styles.headerTitle, { fontSize: 20, fontWeight: 'bold' }]}>
                        Medical History
                    </Text>
                    <Text style={{
                        fontSize: 14,
                        color: theme.colors.subtext,
                        marginTop: 2
                    }}>
                        Your past orders and prescriptions
                    </Text>
                </View>
            </View>

            <ScrollView 
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 16 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[theme.colors.primary]}
                    />
                }
            >
                {/* Summary Stats */}
                <View style={{
                    flexDirection: 'row',
                    marginBottom: 24
                }}>
                    <View style={{
                        flex: 1,
                        backgroundColor: '#FFFFFF',
                        borderRadius: 12,
                        padding: 16,
                        marginRight: 8,
                        alignItems: 'center',
                        elevation: 2,
                        shadowColor: '#000',
                        shadowOpacity: 0.1,
                        shadowOffset: { width: 0, height: 2 },
                        shadowRadius: 4,
                    }}>
                        <Text style={{
                            fontSize: 24,
                            fontWeight: 'bold',
                            color: theme.colors.primary,
                            marginBottom: 4
                        }}>
                            {orders.length}
                        </Text>
                        <Text style={{
                            fontSize: 12,
                            color: theme.colors.subtext,
                            textAlign: 'center'
                        }}>
                            Total Orders
                        </Text>
                    </View>
                    
                    <View style={{
                        flex: 1,
                        backgroundColor: '#FFFFFF',
                        borderRadius: 12,
                        padding: 16,
                        marginLeft: 8,
                        alignItems: 'center',
                        elevation: 2,
                        shadowColor: '#000',
                        shadowOpacity: 0.1,
                        shadowOffset: { width: 0, height: 2 },
                        shadowRadius: 4,
                    }}>
                        <Text style={{
                            fontSize: 24,
                            fontWeight: 'bold',
                            color: theme.colors.primary,
                            marginBottom: 4
                        }}>
                            ${orders.reduce((sum, order) => sum + parseFloat(order.total), 0).toFixed(2)}
                        </Text>
                        <Text style={{
                            fontSize: 12,
                            color: theme.colors.subtext,
                            textAlign: 'center'
                        }}>
                            Total Spent
                        </Text>
                    </View>
                </View>

                {/* Filter Tabs */}
                <View style={{
                    flexDirection: 'row',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 12,
                    padding: 4,
                    marginBottom: 20,
                    elevation: 2,
                    shadowColor: '#000',
                    shadowOpacity: 0.1,
                    shadowOffset: { width: 0, height: 2 },
                    shadowRadius: 4,
                }}>
                    <TouchableOpacity style={{
                        flex: 1,
                        paddingVertical: 12,
                        paddingHorizontal: 16,
                        borderRadius: 8,
                        backgroundColor: theme.colors.primary,
                        alignItems: 'center'
                    }}>
                        <Text style={{
                            fontSize: 14,
                            fontWeight: '600',
                            color: '#FFFFFF'
                        }}>
                            All Orders
                        </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={{
                        flex: 1,
                        paddingVertical: 12,
                        paddingHorizontal: 16,
                        alignItems: 'center'
                    }}>
                        <Text style={{
                            fontSize: 14,
                            fontWeight: '600',
                            color: theme.colors.subtext
                        }}>
                            Prescriptions
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Orders List */}
                {orders.length === 0 ? (
                    <View style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: 12,
                        padding: 32,
                        alignItems: 'center',
                        elevation: 2,
                        shadowColor: '#000',
                        shadowOpacity: 0.1,
                        shadowOffset: { width: 0, height: 2 },
                        shadowRadius: 4,
                    }}>
                        <Icon name="medical-outline" size={48} color={theme.colors.subtext} />
                        <Text style={{
                            fontSize: 18,
                            fontWeight: '600',
                            color: theme.colors.text,
                            marginTop: 16,
                            marginBottom: 8
                        }}>
                            No Medical History
                        </Text>
                        <Text style={{
                            fontSize: 14,
                            color: theme.colors.subtext,
                            textAlign: 'center',
                            lineHeight: 20
                        }}>
                            Your past orders and prescriptions will appear here
                        </Text>
                    </View>
                ) : (
                    orders.map((order, index) => (
                        <OrderCard key={index} order={order} />
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default MedicalHistoryPage;
