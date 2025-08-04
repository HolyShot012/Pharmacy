import React, { useState } from 'react';
import { FlatList, Text, TouchableOpacity, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from '../components/ui/Styles';
import { theme } from '../components/ui/Theme';
import { useRouter } from 'expo-router';

const NotificationsPage = () => {
    const router = useRouter();
    const [notifications, setNotifications] = useState([
        { 
            id: 1, 
            title: 'Order Delivered', 
            message: 'Your order #ORD-2024-001 has been delivered successfully to your address. Thank you for choosing our pharmacy!', 
            time: '2 min ago', 
            read: false,
            type: 'order',
            icon: 'checkmark-circle',
            iconColor: '#16A34A'
        },
        { 
            id: 2, 
            title: 'New Offer Available', 
            message: 'Get 30% off on vitamins this week. Use code VITAMIN30 at checkout. Valid until Sunday.', 
            time: '1 hour ago', 
            read: false,
            type: 'offer',
            icon: 'pricetag',
            iconColor: '#F59E0B'
        },
        { 
            id: 3, 
            title: 'Prescription Reminder', 
            message: 'Time to refill your prescription for Paracetamol 500mg. Only 2 tablets remaining.', 
            time: '3 hours ago', 
            read: true,
            type: 'reminder',
            icon: 'medical',
            iconColor: '#8B5CF6'
        },
        { 
            id: 4, 
            title: 'Payment Successful', 
            message: 'Your payment of $45.50 for order #ORD-2024-002 has been processed successfully.', 
            time: '5 hours ago', 
            read: true,
            type: 'payment',
            icon: 'card',
            iconColor: '#10B981'
        },
        { 
            id: 5, 
            title: 'New Product Alert', 
            message: 'Digital Thermometer is now back in stock! Get yours before it runs out again.', 
            time: '1 day ago', 
            read: true,
            type: 'product',
            icon: 'cube',
            iconColor: '#3B82F6'
        },
        { 
            id: 6, 
            title: 'Health Checkup Reminder', 
            message: 'Your annual health checkup is due next week. Book your appointment now.', 
            time: '2 days ago', 
            read: true,
            type: 'health',
            icon: 'heart',
            iconColor: '#EF4444'
        },
        { 
            id: 7, 
            title: 'Delivery Update', 
            message: 'Your order #ORD-2024-003 is out for delivery and will arrive within 2 hours.', 
            time: '3 days ago', 
            read: true,
            type: 'delivery',
            icon: 'bicycle',
            iconColor: '#06B6D4'
        }
    ]);

    const [filter, setFilter] = useState('all'); // all, unread, read

    const handleNotificationPress = (notification) => {
        // Mark as read if unread
        if (!notification.read) {
            setNotifications(prev => 
                prev.map(n => 
                    n.id === notification.id ? { ...n, read: true } : n
                )
            );
        }

        // Handle different notification types
        switch (notification.type) {
            case 'order':
                Alert.alert(
                    'Order Details',
                    `Order ${notification.message.includes('#ORD-2024-001') ? '#ORD-2024-001' : '#ORD-2024-002'} details`,
                    [
                        { text: 'View Order', onPress: () => console.log('Navigate to order details') },
                        { text: 'OK', style: 'cancel' }
                    ]
                );
                break;
            case 'offer':
                Alert.alert(
                    'Special Offer',
                    'Would you like to browse our vitamin collection?',
                    [
                        { text: 'Browse Products', onPress: () => router.push('/products') },
                        { text: 'Later', style: 'cancel' }
                    ]
                );
                break;
            case 'reminder':
                Alert.alert(
                    'Prescription Refill',
                    'Would you like to reorder your prescription?',
                    [
                        { text: 'Reorder Now', onPress: () => console.log('Navigate to prescription reorder') },
                        { text: 'Remind Later', style: 'cancel' }
                    ]
                );
                break;
            case 'payment':
                Alert.alert(
                    'Payment Details',
                    'View payment receipt and details',
                    [
                        { text: 'View Receipt', onPress: () => console.log('Navigate to payment details') },
                        { text: 'OK', style: 'cancel' }
                    ]
                );
                break;
            case 'product':
                Alert.alert(
                    'Product Available',
                    'Would you like to view this product?',
                    [
                        { text: 'View Product', onPress: () => router.push('/products') },
                        { text: 'Later', style: 'cancel' }
                    ]
                );
                break;
            case 'health':
                Alert.alert(
                    'Health Checkup',
                    'Book your health checkup appointment',
                    [
                        { text: 'Book Now', onPress: () => console.log('Navigate to appointment booking') },
                        { text: 'Later', style: 'cancel' }
                    ]
                );
                break;
            case 'delivery':
                Alert.alert(
                    'Delivery Tracking',
                    'Track your delivery in real-time',
                    [
                        { text: 'Track Order', onPress: () => console.log('Navigate to order tracking') },
                        { text: 'OK', style: 'cancel' }
                    ]
                );
                break;
            default:
                console.log('Notification tapped:', notification.title);
        }
    };

    const handleMarkAllAsRead = () => {
        setNotifications(prev => 
            prev.map(n => ({ ...n, read: true }))
        );
    };

    const handleDeleteNotification = (notificationId) => {
        Alert.alert(
            'Delete Notification',
            'Are you sure you want to delete this notification?',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Delete', 
                    style: 'destructive',
                    onPress: () => {
                        setNotifications(prev => 
                            prev.filter(n => n.id !== notificationId)
                        );
                    }
                }
            ]
        );
    };

    const filteredNotifications = notifications.filter(notification => {
        if (filter === 'unread') return !notification.read;
        if (filter === 'read') return notification.read;
        return true; // all
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    const renderNotification = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.notificationItem,
                {
                    backgroundColor: !item.read ? '#F8FAFC' : '#FFFFFF',
                    borderLeftWidth: !item.read ? 4 : 0,
                    borderLeftColor: !item.read ? theme.colors.primary : 'transparent',
                    marginBottom: 8,
                    borderRadius: 12,
                    padding: 16,
                    elevation: 2,
                    shadowColor: '#000',
                    shadowOpacity: 0.1,
                    shadowOffset: { width: 0, height: 2 },
                    shadowRadius: 4,
                }
            ]}
            onPress={() => handleNotificationPress(item)}
        >
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                {/* Notification Icon */}
                <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: `${item.iconColor}20`,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12
                }}>
                    <Icon name={item.icon} size={20} color={item.iconColor} />
                </View>

                {/* Notification Content */}
                <View style={{ flex: 1, marginRight: 8 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                        <Text style={{
                            fontSize: 16,
                            fontWeight: !item.read ? '600' : '500',
                            color: theme.colors.text,
                            flex: 1,
                            marginRight: 8
                        }}>
                            {item.title}
                        </Text>
                        <Text style={{
                            fontSize: 12,
                            color: theme.colors.subtext,
                            fontWeight: '500'
                        }}>
                            {item.time}
                        </Text>
                    </View>
                    
                    <Text style={{
                        fontSize: 14,
                        color: theme.colors.subtext,
                        lineHeight: 20,
                        marginBottom: 8
                    }}>
                        {item.message}
                    </Text>

                    {/* Action Buttons */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {!item.read && (
                                <View style={{
                                    width: 8,
                                    height: 8,
                                    backgroundColor: theme.colors.primary,
                                    borderRadius: 4,
                                    marginRight: 8
                                }} />
                            )}
                            <Text style={{
                                fontSize: 12,
                                color: !item.read ? theme.colors.primary : theme.colors.subtext,
                                fontWeight: '500'
                            }}>
                                {!item.read ? 'New' : 'Read'}
                            </Text>
                        </View>

                        <TouchableOpacity
                            onPress={() => handleDeleteNotification(item.id)}
                            style={{
                                padding: 8,
                                borderRadius: 6
                            }}
                        >
                            <Icon name="trash-outline" size={16} color={theme.colors.subtext} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

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
                        Notifications
                    </Text>
                    {unreadCount > 0 && (
                        <Text style={{ fontSize: 14, color: theme.colors.subtext }}>
                            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                        </Text>
                    )}
                </View>

                <TouchableOpacity
                    onPress={handleMarkAllAsRead}
                    style={{
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 6,
                        backgroundColor: theme.colors.primary + '10'
                    }}
                >
                    <Text style={{
                        color: theme.colors.primary,
                        fontWeight: '600',
                        fontSize: 14
                    }}>
                        Mark All Read
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Filter Tabs */}
            <View style={{
                flexDirection: 'row',
                backgroundColor: '#FFFFFF',
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: '#E5E7EB'
            }}>
                {[
                    { key: 'all', label: 'All', count: notifications.length },
                    { key: 'unread', label: 'Unread', count: unreadCount },
                    { key: 'read', label: 'Read', count: notifications.length - unreadCount }
                ].map((tab) => (
                    <TouchableOpacity
                        key={tab.key}
                        onPress={() => setFilter(tab.key)}
                        style={{
                            flex: 1,
                            paddingVertical: 8,
                            paddingHorizontal: 16,
                            borderRadius: 8,
                            backgroundColor: filter === tab.key ? theme.colors.primary : 'transparent',
                            marginHorizontal: 4,
                            alignItems: 'center'
                        }}
                    >
                        <Text style={{
                            color: filter === tab.key ? '#FFFFFF' : theme.colors.subtext,
                            fontWeight: filter === tab.key ? '600' : '500',
                            fontSize: 14
                        }}>
                            {tab.label} ({tab.count})
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Notifications List */}
            <FlatList
                data={filteredNotifications}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderNotification}
                contentContainerStyle={{ padding: 16 }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingVertical: 60
                    }}>
                        <Icon name="notifications-outline" size={64} color={theme.colors.subtext} />
                        <Text style={{
                            fontSize: 18,
                            fontWeight: '600',
                            color: theme.colors.text,
                            marginTop: 16,
                            marginBottom: 8
                        }}>
                            No notifications
                        </Text>
                        <Text style={{
                            fontSize: 14,
                            color: theme.colors.subtext,
                            textAlign: 'center',
                            paddingHorizontal: 32
                        }}>
                            {filter === 'unread' 
                                ? "You're all caught up! No unread notifications."
                                : filter === 'read'
                                ? "No read notifications to show."
                                : "You don't have any notifications yet."
                            }
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

export default NotificationsPage;