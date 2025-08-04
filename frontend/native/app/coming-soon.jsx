import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../components/ui/Styles';
import { theme } from '../components/ui/Theme';
import { useRouter } from 'expo-router';

const ComingSoonPage = () => {
    const router = useRouter();

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
                        Coming Soon
                    </Text>
                </View>
            </View>

            {/* Main Content */}
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 32
            }}>
                {/* Animated Icon Container */}
                <LinearGradient
                    colors={[theme.colors.primary + '20', theme.colors.primary + '10']}
                    style={{
                        width: 120,
                        height: 120,
                        borderRadius: 60,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 32,
                        elevation: 4,
                        shadowColor: theme.colors.primary,
                        shadowOpacity: 0.3,
                        shadowOffset: { width: 0, height: 4 },
                        shadowRadius: 8,
                    }}
                >
                    <Icon name="rocket" size={60} color={theme.colors.primary} />
                </LinearGradient>

                {/* Main Title */}
                <Text style={{
                    fontSize: 32,
                    fontWeight: 'bold',
                    color: theme.colors.text,
                    textAlign: 'center',
                    marginBottom: 16
                }}>
                    Coming Soon
                </Text>

                {/* Subtitle */}
                <Text style={{
                    fontSize: 18,
                    color: theme.colors.subtext,
                    textAlign: 'center',
                    marginBottom: 24,
                    lineHeight: 26
                }}>
                    We're working hard to bring you this amazing feature!
                </Text>

                {/* Description */}
                <Text style={{
                    fontSize: 16,
                    color: theme.colors.subtext,
                    textAlign: 'center',
                    marginBottom: 40,
                    lineHeight: 24,
                    paddingHorizontal: 20
                }}>
                    This feature is currently under development. Stay tuned for updates and new functionality that will enhance your pharmacy experience.
                </Text>


                {/* Action Buttons */}
                <View style={{
                    width: '100%',
                    gap: 12
                }}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{
                            backgroundColor: theme.colors.primary,
                            paddingVertical: 16,
                            paddingHorizontal: 32,
                            borderRadius: 12,
                            alignItems: 'center',
                            elevation: 2,
                            shadowColor: theme.colors.primary,
                            shadowOpacity: 0.3,
                            shadowOffset: { width: 0, height: 2 },
                            shadowRadius: 4,
                        }}
                    >
                        <Text style={{
                            color: '#FFFFFF',
                            fontSize: 16,
                            fontWeight: 'bold'
                        }}>
                            Go Back
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push('/(tabs)/home')}
                        style={{
                            backgroundColor: 'transparent',
                            paddingVertical: 16,
                            paddingHorizontal: 32,
                            borderRadius: 12,
                            alignItems: 'center',
                            borderWidth: 2,
                            borderColor: theme.colors.primary
                        }}
                    >
                        <Text style={{
                            color: theme.colors.primary,
                            fontSize: 16,
                            fontWeight: 'bold'
                        }}>
                            Return to Home
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Footer Note */}
                <View style={{
                    marginTop: 32,
                    paddingTop: 24,
                    borderTopWidth: 1,
                    borderTopColor: '#E5E7EB',
                    width: '100%'
                }}>
                    <Text style={{
                        fontSize: 14,
                        color: theme.colors.subtext,
                        textAlign: 'center',
                        fontStyle: 'italic'
                    }}>
                        Thank you for your patience as we work to improve your experience.
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default ComingSoonPage;