import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, Text, TouchableOpacity, View, Alert, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from '../components/ui/Styles';
import { theme } from '../components/ui/Theme';
import { useRouter } from 'expo-router';
import { useAuth } from '../components/AuthContext';
import { updateProfile } from './api';
import { push } from 'expo-router/build/global-state/routing';

// Move ProfileField component outside to prevent re-creation on renders
const ProfileField = React.memo(({ label, value, icon, fieldKey, editable = true, multiline = false, isEditing, onChangeText }) => (
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
                value={value || ''}
                onChangeText={(text) => onChangeText(fieldKey, text)}
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
                placeholder={`Enter ${label.toLowerCase()}`}
                placeholderTextColor={theme.colors.subtext}
            />
        ) : (
            <Text style={{
                fontSize: 16,
                color: value === 'Not provided' ? theme.colors.subtext : theme.colors.text,
                lineHeight: 24,
                fontStyle: value === 'Not provided' ? 'italic' : 'normal'
            }}>
                {value}
            </Text>
        )}
    </View>
));

const ProfilePage = () => {
    const router = useRouter();
    const { user, refreshAuth } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [userInfo, setUserInfo] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        dateOfBirth: '',
        gender: '',
        emergencyContact: ''
    });

    const [editedInfo, setEditedInfo] = useState({ ...userInfo });

    // Update userInfo when user data changes
    useEffect(() => {
        if (user) {
            const formattedUserInfo = {
                name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Not provided',
                email: user.email || 'Not provided',
                phone: user.phone_number || 'Not provided',
                address: user.current_address || 'Not provided',
                city: user.city || '',
                province: user.province || '',
                dateOfBirth: user.birth_date ? new Date(user.birth_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }) : 'Not provided',
            };
            setUserInfo(formattedUserInfo);
            setEditedInfo(formattedUserInfo);
        }
    }, [user]);

    const handleSave = async () => {
        try {
            setIsLoading(true);
            
            // Parse the name into first and last name
            const nameParts = editedInfo.name.trim().split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            // Prepare the data for the API call
            const profileData = {
                first_name: firstName,
                last_name: lastName,
                phone_number: editedInfo.phone !== 'Not provided' ? editedInfo.phone : null,
                current_address: editedInfo.address !== 'Not provided' ? editedInfo.address : null,
                city: editedInfo.city || null,
                province: editedInfo.province || null,
            };

            // Only include birth_date if it's a valid date
            if (editedInfo.dateOfBirth && editedInfo.dateOfBirth !== 'Not provided') {
                try {
                    const dateStr = new Date(editedInfo.dateOfBirth).toISOString().split('T')[0];
                    profileData.birth_date = dateStr;
                } catch (dateError) {
                    console.warn('Invalid date format:', editedInfo.dateOfBirth);
                }
            }

            // Call the API to update the profile
            await updateProfile(profileData);
            
            // Refresh the auth context to get updated user data
            await refreshAuth();
            
            setUserInfo({ ...editedInfo });
            setIsEditing(false);
            Alert.alert('Success', 'Profile updated successfully!');
        } catch (error) {
            console.error('Profile update error:', error);
            Alert.alert(
                'Error', 
                error.error || error.message || 'Failed to update profile. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setEditedInfo({ ...userInfo });
        setIsEditing(false);
    };

    // Optimize the onChange handler with useCallback to prevent unnecessary re-renders
    const handleFieldChange = useCallback((fieldKey, text) => {
        setEditedInfo(prev => ({ ...prev, [fieldKey]: text }));
    }, []);

    // Show loading screen if user data is not available yet
    if (!user) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center' }]} edges={['top']}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={{ marginTop: 16, color: theme.colors.subtext }}>Loading profile...</Text>
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
                    disabled={isLoading}
                    style={{
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 8,
                        backgroundColor: isLoading ? theme.colors.subtext : (isEditing ? theme.colors.primary : theme.colors.primary + '10'),
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}
                >
                    {isLoading && (
                        <ActivityIndicator 
                            size="small" 
                            color="#FFFFFF" 
                            style={{ marginRight: 8 }}
                        />
                    )}
                    <Text style={{
                        color: isLoading ? '#FFFFFF' : (isEditing ? '#FFFFFF' : theme.colors.primary),
                        fontWeight: '600',
                        fontSize: 14
                    }}>
                        {isLoading ? 'Saving...' : (isEditing ? 'Save' : 'Edit')}
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
                    value={isEditing ? editedInfo.name : userInfo.name} 
                    icon="person-outline"
                    fieldKey="name"
                    isEditing={isEditing}
                    onChangeText={handleFieldChange}
                />

                <ProfileField 
                    label="Email Address" 
                    value={isEditing ? editedInfo.email : userInfo.email} 
                    icon="mail-outline"
                    fieldKey="email"
                    editable={false}
                    isEditing={isEditing}
                    onChangeText={handleFieldChange}
                />

                <ProfileField 
                    label="Phone Number" 
                    value={isEditing ? editedInfo.phone : userInfo.phone} 
                    icon="call-outline"
                    fieldKey="phone"
                    isEditing={isEditing}
                    onChangeText={handleFieldChange}
                />

                <ProfileField 
                    label="Address" 
                    value={isEditing ? editedInfo.address : userInfo.address} 
                    icon="location-outline"
                    fieldKey="address"
                    multiline={true}
                    isEditing={isEditing}
                    onChangeText={handleFieldChange}
                />

                {(userInfo.city || isEditing) && (
                    <ProfileField 
                        label="City" 
                        value={isEditing ? editedInfo.city : userInfo.city} 
                        icon="location-outline"
                        fieldKey="city"
                        isEditing={isEditing}
                        onChangeText={handleFieldChange}
                    />
                )}

                {(userInfo.province || isEditing) && (
                    <ProfileField 
                        label="Province" 
                        value={isEditing ? editedInfo.province : userInfo.province} 
                        icon="location-outline"
                        fieldKey="province"
                        isEditing={isEditing}
                        onChangeText={handleFieldChange}
                    />
                )}

                <ProfileField 
                    label="Date of Birth" 
                    value={isEditing ? editedInfo.dateOfBirth : userInfo.dateOfBirth} 
                    icon="calendar-outline"
                    fieldKey="dateOfBirth"
                    isEditing={isEditing}
                    onChangeText={handleFieldChange}
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
                    onPress={() => router.push('/medical-history')}
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
                    onPress={() => router.push('/coming-soon')}
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