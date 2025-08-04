import React, { useState } from 'react';
import { FlatList, Text, TouchableOpacity, View, Alert, Modal, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from '../components/ui/Styles';
import { theme } from '../components/ui/Theme';
import { useRouter } from 'expo-router';

const VaccinationRecordsPage = () => {
    const router = useRouter();
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [showCertificate, setShowCertificate] = useState(false);

    const vaccinationRecords = [
        {
            id: 1,
            vaccine: 'COVID-19 (Pfizer-BioNTech)',
            date: '2024-01-15',
            doseNumber: '1st Dose',
            location: 'HealthCare Pharmacy',
            batchNumber: 'PF001234',
            administrator: 'Dr. Sarah Johnson',
            nextDue: '2024-02-15',
            status: 'Completed',
            certificateId: 'COV-2024-001',
            sideEffects: 'Mild soreness at injection site',
            notes: 'Patient tolerated vaccine well'
        },
        {
            id: 2,
            vaccine: 'COVID-19 (Pfizer-BioNTech)',
            date: '2024-02-15',
            doseNumber: '2nd Dose',
            location: 'HealthCare Pharmacy',
            batchNumber: 'PF001567',
            administrator: 'Dr. Sarah Johnson',
            nextDue: '2024-08-15',
            status: 'Completed',
            certificateId: 'COV-2024-002',
            sideEffects: 'None reported',
            notes: 'Booster recommended in 6 months'
        },
        {
            id: 3,
            vaccine: 'Influenza (Flu Shot)',
            date: '2023-10-20',
            doseNumber: 'Annual',
            location: 'MediPlus Store',
            batchNumber: 'FLU2023-456',
            administrator: 'Nurse Mary Wilson',
            nextDue: '2024-10-20',
            status: 'Completed',
            certificateId: 'FLU-2023-001',
            sideEffects: 'None reported',
            notes: 'Annual flu vaccination completed'
        },
        {
            id: 4,
            vaccine: 'Hepatitis B',
            date: '2023-06-10',
            doseNumber: '3rd Dose',
            location: 'Quick Meds',
            batchNumber: 'HEP-B-789',
            administrator: 'Dr. Michael Chen',
            nextDue: 'N/A',
            status: 'Completed',
            certificateId: 'HEP-2023-001',
            sideEffects: 'Mild fatigue',
            notes: 'Series completed - immunity confirmed'
        },
        {
            id: 5,
            vaccine: 'Tetanus-Diphtheria (Td)',
            date: '2022-03-15',
            doseNumber: 'Booster',
            location: 'HealthCare Pharmacy',
            batchNumber: 'TD-2022-123',
            administrator: 'Dr. Sarah Johnson',
            nextDue: '2032-03-15',
            status: 'Completed',
            certificateId: 'TD-2022-001',
            sideEffects: 'Mild soreness',
            notes: 'Next booster due in 10 years'
        }
    ];

    const upcomingVaccinations = [
        {
            id: 1,
            vaccine: 'COVID-19 Booster',
            dueDate: '2024-08-15',
            priority: 'Recommended',
            description: 'Annual booster shot recommended'
        },
        {
            id: 2,
            vaccine: 'Influenza (Flu Shot)',
            dueDate: '2024-10-20',
            priority: 'Due Soon',
            description: 'Annual flu vaccination'
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return '#16A34A';
            case 'Pending': return '#F59E0B';
            case 'Overdue': return '#EF4444';
            default: return theme.colors.subtext;
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'Due Soon': return '#EF4444';
            case 'Recommended': return '#F59E0B';
            case 'Optional': return '#6B7280';
            default: return theme.colors.subtext;
        }
    };

    const handleViewCertificate = (record) => {
        setSelectedRecord(record);
        setShowCertificate(true);
    };

    const handleDownloadCertificate = (record) => {
        Alert.alert(
            'Download Certificate',
            `Download vaccination certificate for ${record.vaccine}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Download', 
                    onPress: () => {
                        Alert.alert('Success', 'Certificate downloaded to your device');
                    }
                }
            ]
        );
    };

    const renderVaccinationRecord = ({ item }) => (
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
                        fontWeight: '600',
                        color: theme.colors.text,
                        marginBottom: 4
                    }}>
                        {item.vaccine}
                    </Text>
                    <Text style={{
                        fontSize: 14,
                        color: theme.colors.subtext,
                        marginBottom: 2
                    }}>
                        {item.doseNumber} • {item.date}
                    </Text>
                    <Text style={{
                        fontSize: 14,
                        color: theme.colors.subtext
                    }}>
                        {item.location}
                    </Text>
                </View>
                <View style={{
                    backgroundColor: getStatusColor(item.status) + '20',
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 6
                }}>
                    <Text style={{
                        fontSize: 12,
                        fontWeight: '600',
                        color: getStatusColor(item.status)
                    }}>
                        {item.status}
                    </Text>
                </View>
            </View>

            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 12
            }}>
                <Icon name="person" size={16} color={theme.colors.subtext} />
                <Text style={{
                    fontSize: 14,
                    color: theme.colors.subtext,
                    marginLeft: 8
                }}>
                    Administered by: {item.administrator}
                </Text>
            </View>

            {item.nextDue !== 'N/A' && (
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 12
                }}>
                    <Icon name="calendar" size={16} color={theme.colors.primary} />
                    <Text style={{
                        fontSize: 14,
                        color: theme.colors.primary,
                        marginLeft: 8,
                        fontWeight: '500'
                    }}>
                        Next due: {item.nextDue}
                    </Text>
                </View>
            )}

            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: 12,
                borderTopWidth: 1,
                borderTopColor: '#F3F4F6'
            }}>
                <TouchableOpacity
                    onPress={() => handleViewCertificate(item)}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        backgroundColor: theme.colors.primary + '10',
                        borderRadius: 8
                    }}
                >
                    <Icon name="document-text" size={16} color={theme.colors.primary} />
                    <Text style={{
                        fontSize: 14,
                        color: theme.colors.primary,
                        fontWeight: '600',
                        marginLeft: 6
                    }}>
                        View Certificate
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => handleDownloadCertificate(item)}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        backgroundColor: '#F3F4F6',
                        borderRadius: 8
                    }}
                >
                    <Icon name="download" size={16} color={theme.colors.subtext} />
                    <Text style={{
                        fontSize: 14,
                        color: theme.colors.subtext,
                        fontWeight: '600',
                        marginLeft: 6
                    }}>
                        Download
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderUpcomingVaccination = ({ item }) => (
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
            borderLeftColor: getPriorityColor(item.priority)
        }}>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 8
            }}>
                <View style={{ flex: 1 }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: '600',
                        color: theme.colors.text,
                        marginBottom: 4
                    }}>
                        {item.vaccine}
                    </Text>
                    <Text style={{
                        fontSize: 14,
                        color: theme.colors.subtext,
                        marginBottom: 4
                    }}>
                        {item.description}
                    </Text>
                    <Text style={{
                        fontSize: 14,
                        color: theme.colors.primary,
                        fontWeight: '500'
                    }}>
                        Due: {item.dueDate}
                    </Text>
                </View>
                <View style={{
                    backgroundColor: getPriorityColor(item.priority) + '20',
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 6
                }}>
                    <Text style={{
                        fontSize: 12,
                        fontWeight: '600',
                        color: getPriorityColor(item.priority)
                    }}>
                        {item.priority}
                    </Text>
                </View>
            </View>

            <TouchableOpacity
                style={{
                    backgroundColor: theme.colors.primary,
                    paddingVertical: 10,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    alignItems: 'center',
                    marginTop: 8
                }}
                onPress={() => Alert.alert('Schedule Vaccination', 'This feature will redirect you to booking system.')}
            >
                <Text style={{
                    color: '#FFFFFF',
                    fontWeight: '600',
                    fontSize: 14
                }}>
                    Schedule Appointment
                </Text>
            </TouchableOpacity>
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
                    onPress={() => Alert.alert('Add Record', 'This feature will allow you to add new vaccination records.')}
                    style={{
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 6,
                        backgroundColor: theme.colors.primary + '10'
                    }}
                >
                    <Icon name="add" size={20} color={theme.colors.primary} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={[]}
                keyExtractor={() => 'empty'}
                ListHeaderComponent={
                    <View style={{ padding: 16 }}>
                        {/* Summary Card */}
                        <View style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: 16,
                            padding: 20,
                            marginBottom: 24,
                            elevation: 2,
                            shadowColor: '#000',
                            shadowOpacity: 0.1,
                            shadowOffset: { width: 0, height: 2 },
                            shadowRadius: 4,
                        }}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginBottom: 16
                            }}>
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
                                        fontSize: 18,
                                        fontWeight: 'bold',
                                        color: theme.colors.text,
                                        marginBottom: 4
                                    }}>
                                        Vaccination Summary
                                    </Text>
                                    <Text style={{
                                        fontSize: 14,
                                        color: theme.colors.subtext
                                    }}>
                                        Your immunization status
                                    </Text>
                                </View>
                            </View>

                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                                paddingTop: 16,
                                borderTopWidth: 1,
                                borderTopColor: '#F3F4F6'
                            }}>
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={{
                                        fontSize: 24,
                                        fontWeight: 'bold',
                                        color: '#16A34A'
                                    }}>
                                        {vaccinationRecords.length}
                                    </Text>
                                    <Text style={{
                                        fontSize: 12,
                                        color: theme.colors.subtext,
                                        textAlign: 'center'
                                    }}>
                                        Total{'\n'}Vaccinations
                                    </Text>
                                </View>
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={{
                                        fontSize: 24,
                                        fontWeight: 'bold',
                                        color: '#F59E0B'
                                    }}>
                                        {upcomingVaccinations.length}
                                    </Text>
                                    <Text style={{
                                        fontSize: 12,
                                        color: theme.colors.subtext,
                                        textAlign: 'center'
                                    }}>
                                        Upcoming{'\n'}Due
                                    </Text>
                                </View>
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={{
                                        fontSize: 24,
                                        fontWeight: 'bold',
                                        color: '#3B82F6'
                                    }}>
                                        100%
                                    </Text>
                                    <Text style={{
                                        fontSize: 12,
                                        color: theme.colors.subtext,
                                        textAlign: 'center'
                                    }}>
                                        Compliance{'\n'}Rate
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Upcoming Vaccinations */}
                        {upcomingVaccinations.length > 0 && (
                            <>
                                <Text style={{
                                    fontSize: 18,
                                    fontWeight: 'bold',
                                    color: theme.colors.text,
                                    marginBottom: 16
                                }}>
                                    Upcoming Vaccinations
                                </Text>
                                <FlatList
                                    data={upcomingVaccinations}
                                    keyExtractor={(item) => item.id.toString()}
                                    renderItem={renderUpcomingVaccination}
                                    scrollEnabled={false}
                                    style={{ marginBottom: 24 }}
                                />
                            </>
                        )}

                        {/* Vaccination History */}
                        <Text style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: theme.colors.text,
                            marginBottom: 16
                        }}>
                            Vaccination History
                        </Text>
                        <FlatList
                            data={vaccinationRecords}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderVaccinationRecord}
                            scrollEnabled={false}
                        />
                    </View>
                }
                showsVerticalScrollIndicator={false}
                renderItem={undefined}
            />

            {/* Certificate Modal */}
            <Modal
                visible={showCertificate}
                transparent
                animationType="fade"
                onRequestClose={() => setShowCertificate(false)}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 20
                }}>
                    <View style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: 16,
                        padding: 24,
                        width: '100%',
                        maxHeight: '83%'
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 20
                        }}>
                            <Text style={{
                                fontSize: 20,
                                fontWeight: 'bold',
                                color: theme.colors.text
                            }}>
                                Vaccination Certificate
                            </Text>
                            <TouchableOpacity
                                onPress={() => setShowCertificate(false)}
                                style={{
                                    padding: 8,
                                    borderRadius: 8,
                                    backgroundColor: '#F3F4F6'
                                }}
                            >
                                <Icon name="close" size={20} color={theme.colors.subtext} />
                            </TouchableOpacity>
                        </View>

                        {selectedRecord && (
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={{
                                    borderWidth: 2,
                                    borderColor: theme.colors.primary,
                                    borderRadius: 12,
                                    padding: 20,
                                    marginBottom: 20
                                }}>
                                    <Text style={{
                                        fontSize: 18,
                                        fontWeight: 'bold',
                                        color: theme.colors.primary,
                                        textAlign: 'center',
                                        marginBottom: 16
                                    }}>
                                        VACCINATION CERTIFICATE
                                    </Text>

                                    <View style={{ marginBottom: 12 }}>
                                        <Text style={{ fontSize: 14, color: theme.colors.subtext, marginBottom: 4 }}>
                                            Certificate ID
                                        </Text>
                                        <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.text }}>
                                            {selectedRecord.certificateId}
                                        </Text>
                                    </View>

                                    <View style={{ marginBottom: 12 }}>
                                        <Text style={{ fontSize: 14, color: theme.colors.subtext, marginBottom: 4 }}>
                                            Patient Name
                                        </Text>
                                        <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.text }}>
                                            John Doe
                                        </Text>
                                    </View>

                                    <View style={{ marginBottom: 12 }}>
                                        <Text style={{ fontSize: 14, color: theme.colors.subtext, marginBottom: 4 }}>
                                            Vaccine
                                        </Text>
                                        <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.text }}>
                                            {selectedRecord.vaccine}
                                        </Text>
                                    </View>

                                    <View style={{ marginBottom: 12 }}>
                                        <Text style={{ fontSize: 14, color: theme.colors.subtext, marginBottom: 4 }}>
                                            Dose Number
                                        </Text>
                                        <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.text }}>
                                            {selectedRecord.doseNumber}
                                        </Text>
                                    </View>

                                    <View style={{ marginBottom: 12 }}>
                                        <Text style={{ fontSize: 14, color: theme.colors.subtext, marginBottom: 4 }}>
                                            Date Administered
                                        </Text>
                                        <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.text }}>
                                            {selectedRecord.date}
                                        </Text>
                                    </View>

                                    <View style={{ marginBottom: 12 }}>
                                        <Text style={{ fontSize: 14, color: theme.colors.subtext, marginBottom: 4 }}>
                                            Location
                                        </Text>
                                        <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.text }}>
                                            {selectedRecord.location}
                                        </Text>
                                    </View>

                                    <View style={{ marginBottom: 12 }}>
                                        <Text style={{ fontSize: 14, color: theme.colors.subtext, marginBottom: 4 }}>
                                            Administrator
                                        </Text>
                                        <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.text }}>
                                            {selectedRecord.administrator}
                                        </Text>
                                    </View>

                                    <View style={{ marginBottom: 12 }}>
                                        <Text style={{ fontSize: 14, color: theme.colors.subtext, marginBottom: 4 }}>
                                            Batch Number
                                        </Text>
                                        <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.text }}>
                                            {selectedRecord.batchNumber}
                                        </Text>
                                    </View>

                                    <View style={{
                                        borderTopWidth: 1,
                                        borderTopColor: '#F3F4F6',
                                        paddingTop: 16,
                                        marginTop: 16
                                    }}>
                                        <Text style={{
                                            fontSize: 12,
                                            color: theme.colors.subtext,
                                            textAlign: 'center'
                                        }}>
                                            This certificate is digitally verified and valid for official use.
                                        </Text>
                                    </View>
                                </View>

                                <TouchableOpacity
                                    onPress={() => handleDownloadCertificate(selectedRecord)}
                                    style={{
                                        backgroundColor: theme.colors.primary,
                                        paddingVertical: 12,
                                        paddingHorizontal: 24,
                                        borderRadius: 8,
                                        alignItems: 'center'
                                    }}
                                >
                                    <Text style={{
                                        color: '#FFFFFF',
                                        fontWeight: '600',
                                        fontSize: 16
                                    }}>
                                        Download Certificate
                                    </Text>
                                </TouchableOpacity>
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default VaccinationRecordsPage;