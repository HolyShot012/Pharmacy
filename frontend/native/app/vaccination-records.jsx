import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { styles } from '../components/ui/Styles';
import { theme } from '../components/ui/Theme';
import { useRouter } from 'expo-router';

const VaccinationRecordsPage = () => {
    const router = useRouter();

    const vaccinationHistory = [
        {
            id: 1,
            vaccine: 'COVID-19 Booster (Pfizer)',
            date: '2024-01-15',
            provider: 'HealthCare Pharmacy',
            batchNumber: 'PF123456',
            status: 'completed',
            nextDue: null,
            certificate: true
        },
        {
            id: 2,
            vaccine: 'Influenza (Flu Shot)',
            date: '2024-03-22',
            provider: 'HealthCare Pharmacy',
            batchNumber: 'FL789012',
            status: 'completed',
            nextDue: '2025-03-22',
            certificate: true
        },
        {
            id: 3,
            vaccine: 'Hepatitis B',
            date: '2024-08-10',
            provider: 'HealthCare Pharmacy',
            batchNumber: 'HB345678',
            status: 'scheduled',
            nextDue: null,
            certificate: false
        },
        {
            id: 4,
            vaccine: 'Pneumococcal',
            date: '2023-05-18',
            provider: 'City Medical Center',
            batchNumber: 'PN901234',
            status: 'completed',
            nextDue: '2028-05-18',
            certificate: true
        }
    ];

    const upcomingVaccinations = [
        {
            id: 1,
            vaccine: 'Annual Flu Shot',
            scheduledDate: '2024-12-15',
            provider: 'HealthCare Pharmacy',
            status: 'scheduled'
        }
    ];

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return '#16A34A';
            case 'scheduled':
                return '#F59E0B';
            case 'overdue':
                return '#DC2626';
            default:
                return theme.colors.subtext;
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return 'checkmark-circle';
            case 'scheduled':
                return 'time';
            case 'overdue':
                return 'warning';
            default:
                return 'help-circle';
        }
    };

    const VaccinationCard = ({ vaccination, isUpcoming = false }) => (
        <View style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            elevation: 2,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 4,
            borderLeftWidth: 4,
            borderLeftColor: getStatusColor(vaccination.status)
        }}>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 12
            }}>
                <View style={{ flex: 1 }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: theme.colors.text,
                        marginBottom: 4
                    }}>
                        {vaccination.vaccine}
                    </Text>
                    <Text style={{
                        fontSize: 14,
                        color: theme.colors.subtext,
                        marginBottom: 8
                    }}>
                        {isUpcoming ? formatDate(vaccination.scheduledDate) : formatDate(vaccination.date)}
                    </Text>
                </View>
                
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: getStatusColor(vaccination.status) + '15',
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 12
                }}>
                    <Icon 
                        name={getStatusIcon(vaccination.status)} 
                        size={16} 
                        color={getStatusColor(vaccination.status)}
                        style={{ marginRight: 4 }}
                    />
                    <Text style={{
                        fontSize: 12,
                        fontWeight: '600',
                        color: getStatusColor(vaccination.status),
                        textTransform: 'capitalize'
                    }}>
                        {vaccination.status}
                    </Text>
                </View>
            </View>

            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 8
            }}>
                <Icon name="business" size={16} color={theme.colors.subtext} style={{ marginRight: 8 }} />
                <Text style={{
                    fontSize: 14,
                    color: theme.colors.subtext
                }}>
                    {vaccination.provider}
                </Text>
            </View>

            {!isUpcoming && vaccination.batchNumber && (
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 8
                }}>
                    <Icon name="barcode" size={16} color={theme.colors.subtext} style={{ marginRight: 8 }} />
                    <Text style={{
                        fontSize: 14,
                        color: theme.colors.subtext
                    }}>
                        Batch: {vaccination.batchNumber}
                    </Text>
                </View>
            )}

            {vaccination.nextDue && (
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 8
                }}>
                    <Icon name="calendar" size={16} color={theme.colors.subtext} style={{ marginRight: 8 }} />
                    <Text style={{
                        fontSize: 14,
                        color: theme.colors.subtext
                    }}>
                        Next due: {formatDate(vaccination.nextDue)}
                    </Text>
                </View>
            )}

            {!isUpcoming && vaccination.certificate && (
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 12,
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        backgroundColor: theme.colors.primary + '10',
                        borderRadius: 8,
                        alignSelf: 'flex-start'
                    }}
                    onPress={() => {
                        // Handle certificate download/view
                        alert('Certificate feature coming soon!');
                    }}
                >
                    <MaterialIcons name="file-download" size={16} color={theme.colors.primary} style={{ marginRight: 6 }} />
                    <Text style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: theme.colors.primary
                    }}>
                        Download Certificate
                    </Text>
                </TouchableOpacity>
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
                        Vaccination Records
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={() => router.push('/vaccination-booking')}
                    style={{
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 8,
                        backgroundColor: '#8B5CF6'
                    }}
                >
                    <Text style={{
                        color: '#FFFFFF',
                        fontWeight: '600',
                        fontSize: 14
                    }}>
                        Book New
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView 
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 16 }}
                showsVerticalScrollIndicator={false}
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
                            color: '#16A34A',
                            marginBottom: 4
                        }}>
                            {vaccinationHistory.filter(v => v.status === 'completed').length}
                        </Text>
                        <Text style={{
                            fontSize: 12,
                            color: theme.colors.subtext,
                            textAlign: 'center'
                        }}>
                            Completed
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
                            color: '#F59E0B',
                            marginBottom: 4
                        }}>
                            {upcomingVaccinations.length}
                        </Text>
                        <Text style={{
                            fontSize: 12,
                            color: theme.colors.subtext,
                            textAlign: 'center'
                        }}>
                            Upcoming
                        </Text>
                    </View>
                </View>

                {/* Upcoming Vaccinations */}
                {upcomingVaccinations.length > 0 && (
                    <>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: theme.colors.text,
                            marginBottom: 16,
                            marginLeft: 4
                        }}>
                            Upcoming Vaccinations
                        </Text>

                        {upcomingVaccinations.map((vaccination) => (
                            <VaccinationCard 
                                key={vaccination.id} 
                                vaccination={vaccination} 
                                isUpcoming={true}
                            />
                        ))}
                    </>
                )}

                {/* Vaccination History */}
                <Text style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: theme.colors.text,
                    marginBottom: 16,
                    marginTop: upcomingVaccinations.length > 0 ? 24 : 0,
                    marginLeft: 4
                }}>
                    Vaccination History
                </Text>

                {vaccinationHistory.map((vaccination) => (
                    <VaccinationCard key={vaccination.id} vaccination={vaccination} />
                ))}

                {/* Quick Actions */}
                <View style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 12,
                    padding: 20,
                    marginTop: 16,
                    elevation: 2,
                    shadowColor: '#000',
                    shadowOpacity: 0.1,
                    shadowOffset: { width: 0, height: 2 },
                    shadowRadius: 4,
                }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: theme.colors.text,
                        marginBottom: 16
                    }}>
                        Quick Actions
                    </Text>

                    <TouchableOpacity
                        onPress={() => router.push('/vaccination-booking')}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingVertical: 12,
                            borderBottomWidth: 1,
                            borderBottomColor: '#F3F4F6'
                        }}
                    >
                        <Icon name="add-circle" size={24} color="#8B5CF6" style={{ marginRight: 12 }} />
                        <Text style={{
                            fontSize: 16,
                            color: theme.colors.text,
                            flex: 1
                        }}>
                            Book New Vaccination
                        </Text>
                        <Icon name="chevron-forward" size={20} color={theme.colors.subtext} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push('/(tabs)/vaccination')}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingVertical: 12,
                            borderBottomWidth: 1,
                            borderBottomColor: '#F3F4F6'
                        }}
                    >
                        <Icon name="calendar" size={24} color="#8B5CF6" style={{ marginRight: 12 }} />
                        <Text style={{
                            fontSize: 16,
                            color: theme.colors.text,
                            flex: 1
                        }}>
                            View Vaccination Calendar
                        </Text>
                        <Icon name="chevron-forward" size={20} color={theme.colors.subtext} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => alert('Feature coming soon!')}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingVertical: 12
                        }}
                    >
                        <Icon name="download" size={24} color="#8B5CF6" style={{ marginRight: 12 }} />
                        <Text style={{
                            fontSize: 16,
                            color: theme.colors.text,
                            flex: 1
                        }}>
                            Download All Certificates
                        </Text>
                        <Icon name="chevron-forward" size={20} color={theme.colors.subtext} />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default VaccinationRecordsPage;
