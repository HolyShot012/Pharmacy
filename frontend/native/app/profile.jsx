import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from '../components/ui/Styles';
import { theme } from '../components/ui/Theme';
import { useRouter } from 'expo-router';

const ProfilePage = () => {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [userInfo, setUserInfo] = useState({
        name: 'John Doe',
        email: 'john.doe@email.com',
        phone: '+1 (555) 123-4567',
        address: '123 Main Street, Ho Chi Minh City, District 1, Vietnam',
        dateOfBirth: 'January 15, 1990',
        gender: 'Male',
        emergencyContact: '+1 (555) 987-6543'
    });

    const [editedInfo, setEditedInfo] = useState({ ...userInfo });

    const handleSave = () => {
        setUserInfo({ ...editedInfo });
        setIsEditing(false);
        Alert.alert('Success', 'Profile updated successfully!');
    };

    const handleCancel = () => {
        setEditedInfo({ ...userInfo });
        setIsEditing(false);
    };

    const ProfileField = ({ label, value, icon, editable = true, multiline = false }) => (
        <View style={{
            marginBottom: 20,
            backgroundColor: '#FFFFFF',
            borderRadius: 12,
            padding: 16,
            elevation: 2,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 4,
        }}>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 8
            }}>
                <Icon name={icon} size={20} color={theme.colors.primary} style={{ marginRight: 8 }} />
                <Text style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: theme.colors.subtext,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5
                }}>
                    {label}
                </Text>
            </View>
            {isEditing && editable ? (
                <TextInput
                    value={editedInfo[Object.keys(userInfo).find(key => userInfo[key] === value)]}
                    onChangeText={(text) => {
                        const key = Object.keys(userInfo).find(k => userInfo[k] === value);
                        setEditedInfo(prev => ({ ...prev, [key]: text }));
                    }}
                    style={{
                        fontSize: 16,
                        color: theme.colors.text,
                        borderWidth: 1,
                        borderColor: theme.colors.primary,
                        borderRadius: 8,
                        padding: 12,
                        backgroundColor: '#F8FAFC'
                    }}
                    multiline={multiline}
                    numberOfLines={multiline ? 3 : 1}
                />
            ) : (
                <Text style={{
                    fontSize: 16,
                    color: theme.colors.text,
                    lineHeight: 24
                }}>
                    {value}
                </Text>
            )}
        </View>
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
                        Profile
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={() => {
                        if (isEditing) {
                            handleSave();
                        } else {
                            setIsEditing(true);
                        }
                    }}
                    style={{
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 8,
                        backgroundColor: isEditing ? theme.colors.primary : theme.colors.primary + '10'
                    }}
                >
                    <Text style={{
                        color: isEditing ? '#FFFFFF' : theme.colors.primary,
                        fontWeight: '600',
                        fontSize: 14
                    }}>
                        {isEditing ? 'Save' : 'Edit'}
                    </Text>
                </TouchableOpacity>

                {isEditing && (
                    <TouchableOpacity
                        onPress={handleCancel}
                        style={{
                            paddingHorizontal: 16,
                            paddingVertical: 8,
                            borderRadius: 8,
                            marginLeft: 8,
                            backgroundColor: '#F3F4F6'
                        }}
                    >
                        <Text style={{
                            color: theme.colors.subtext,
                            fontWeight: '600',
                            fontSize: 14
                        }}>
                            Cancel
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView 
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 16 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Avatar Section */}
                <View style={{
                    alignItems: 'center',
                    marginBottom: 32,
                    backgroundColor: '#FFFFFF',
                    borderRadius: 16,
                    padding: 24,
                    elevation: 2,
                    shadowColor: '#000',
                    shadowOpacity: 0.1,
                    shadowOffset: { width: 0, height: 2 },
                    shadowRadius: 4,
                }}>
                    <View style={{
                        width: 100,
                        height: 100,
                        borderRadius: 50,
                        backgroundColor: theme.colors.primary,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 16
                    }}>
                        <Icon name="person" size={50} color="#FFFFFF" />
                    </View>
                    <Text style={{
                        fontSize: 24,
                        fontWeight: 'bold',
                        color: theme.colors.text,
                        marginBottom: 4
                    }}>
                        {userInfo.name}
                    </Text>
                    <Text style={{
                        fontSize: 16,
                        color: theme.colors.subtext
                    }}>
                        Patient ID: #PAT-2024-001
                    </Text>
                </View>

                {/* Personal Information */}
                <Text style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: theme.colors.text,
                    marginBottom: 16,
                    marginLeft: 4
                }}>
                    Personal Information
                </Text>

                <ProfileField 
                    label="Full Name" 
                    value={userInfo.name} 
                    icon="person-outline" 
                />

                <ProfileField 
                    label="Email Address" 
                    value={userInfo.email} 
                    icon="mail-outline" 
                />

                <ProfileField 
                    label="Phone Number" 
                    value={userInfo.phone} 
                    icon="call-outline" 
                />

                <ProfileField 
                    label="Address" 
                    value={userInfo.address} 
                    icon="location-outline" 
                    multiline={true}
                />

                <ProfileField 
                    label="Date of Birth" 
                    value={userInfo.dateOfBirth} 
                    icon="calendar-outline" 
                />

                <ProfileField 
                    label="Gender" 
                    value={userInfo.gender} 
                    icon="person-outline" 
                />

                <ProfileField 
                    label="Emergency Contact" 
                    value={userInfo.emergencyContact} 
                    icon="call-outline" 
                />

                {/* Health Information Section */}
                <Text style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: theme.colors.text,
                    marginBottom: 16,
                    marginTop: 24,
                    marginLeft: 4
                }}>
                    Health Information
                </Text>

                {/* Vaccination Records Button */}
                <TouchableOpacity
                    onPress={() => router.push('/vaccination-records')}
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: 12,
                        padding: 20,
                        elevation: 2,
                        shadowColor: '#000',
                        shadowOpacity: 0.1,
                        shadowOffset: { width: 0, height: 2 },
                        shadowRadius: 4,
                        marginBottom: 16,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <View style={{
                            width: 48,
                            height: 48,
                            borderRadius: 24,
                            backgroundColor: '#E8F5E8',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 16
                        }}>
                            <Icon name="shield-checkmark" size={24} color="#16A34A" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{
                                fontSize: 16,
                                fontWeight: '600',
                                color: theme.colors.text,
                                marginBottom: 4
                            }}>
                                Vaccination Records
                            </Text>
                            <Text style={{
                                fontSize: 14,
                                color: theme.colors.subtext
                            }}>
                                View your vaccination history and certificates
                            </Text>
                        </View>
                    </View>
                    <Icon name="chevron-forward" size={20} color={theme.colors.subtext} />
                </TouchableOpacity>

                {/* Medical History Button */}
                <TouchableOpacity
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: 12,
                        padding: 20,
                        elevation: 2,
                        shadowColor: '#000',
                        shadowOpacity: 0.1,
                        shadowOffset: { width: 0, height: 2 },
                        shadowRadius: 4,
                        marginBottom: 16,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                    onPress={() => Alert.alert('Medical History', 'This feature will be available soon.')}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <View style={{
                            width: 48,
                            height: 48,
                            borderRadius: 24,
                            backgroundColor: '#FEF3C7',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 16
                        }}>
                            <Icon name="document-text" size={24} color="#F59E0B" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{
                                fontSize: 16,
                                fontWeight: '600',
                                color: theme.colors.text,
                                marginBottom: 4
                            }}>
                                Medical History
                            </Text>
                            <Text style={{
                                fontSize: 14,
                                color: theme.colors.subtext
                            }}>
                                Access your medical records and prescriptions
                            </Text>
                        </View>
                    </View>
                    <Icon name="chevron-forward" size={20} color={theme.colors.subtext} />
                </TouchableOpacity>

                {/* Insurance Information Button */}
                <TouchableOpacity
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: 12,
                        padding: 20,
                        elevation: 2,
                        shadowColor: '#000',
                        shadowOpacity: 0.1,
                        shadowOffset: { width: 0, height: 2 },
                        shadowRadius: 4,
                        marginBottom: 32,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                    onPress={() => Alert.alert('Insurance Information', 'This feature will be available soon.')}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <View style={{
                            width: 48,
                            height: 48,
                            borderRadius: 24,
                            backgroundColor: '#DBEAFE',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 16
                        }}>
                            <Icon name="card" size={24} color="#3B82F6" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{
                                fontSize: 16,
                                fontWeight: '600',
                                color: theme.colors.text,
                                marginBottom: 4
                            }}>
                                Insurance Information
                            </Text>
                            <Text style={{
                                fontSize: 14,
                                color: theme.colors.subtext
                            }}>
                                Manage your health insurance details
                            </Text>
                        </View>
                    </View>
                    <Icon name="chevron-forward" size={20} color={theme.colors.subtext} />
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ProfilePage;