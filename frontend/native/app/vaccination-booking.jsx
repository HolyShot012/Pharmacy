import { AntDesign } from '@expo/vector-icons';
import { ScrollView, Text, TextInput, TouchableOpacity, View, Modal } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../components/ui/Theme';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useAuth } from '../components/AuthContext';

const VaccinationBookingPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedVaccine, setSelectedVaccine] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const vaccines = [
    { id: 1, name: 'COVID-19 Booster', price: 45.00 },
    { id: 2, name: 'Flu Shot', price: 35.00 },
    { id: 3, name: 'Hepatitis B', price: 65.00 },
    { id: 4, name: 'Pneumonia', price: 55.00 },
    { id: 5, name: 'Shingles', price: 70.00 }
  ];

  const availableDates = [
    'Today - Aug 4, 2025',
    'Tomorrow - Aug 5, 2025',
    'Aug 6, 2025',
    'Aug 7, 2025',
    'Aug 8, 2025'
  ];

  const availableTimes = [
    '9:00 AM',
    '10:00 AM',
    '11:00 AM',
    '2:00 PM',
    '3:00 PM',
    '4:00 PM'
  ];

  const handleBooking = () => {
    if (!selectedVaccine || !selectedDate || !selectedTime) {
      alert('Please fill in all required fields');
      return;
    }
    setShowSuccessModal(true);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    router.push('/(tabs)/vaccination');
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView style={{ flex: 1 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: theme.spacing.md, paddingTop: theme.spacing.lg }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: theme.spacing.md }}>
            <AntDesign name="arrowleft" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: theme.colors.text }}>Book Vaccination</Text>
        </View>

        {/* Personal Information */}
        <View style={{ margin: theme.spacing.md, backgroundColor: theme.colors.white, borderRadius: 12, padding: theme.spacing.md }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.text, marginBottom: theme.spacing.md }}>
            Personal Information
          </Text>
          
          <View style={{ marginBottom: theme.spacing.md }}>
            <Text style={{ color: theme.colors.subtext, marginBottom: 4 }}>Full Name</Text>
            <Text style={{ fontSize: 16, color: theme.colors.text, backgroundColor: '#F9FAFB', padding: 12, borderRadius: 8 }}>
              {user?.first_name} {user?.last_name}
            </Text>
          </View>

          <View style={{ marginBottom: theme.spacing.md }}>
            <Text style={{ color: theme.colors.subtext, marginBottom: 4 }}>Phone Number</Text>
            <Text style={{ fontSize: 16, color: theme.colors.text, backgroundColor: '#F9FAFB', padding: 12, borderRadius: 8 }}>
              {user?.phone_number || 'Not provided'}
            </Text>
          </View>

          <View style={{ marginBottom: theme.spacing.md }}>
            <Text style={{ color: theme.colors.subtext, marginBottom: 4 }}>Address</Text>
            <Text style={{ fontSize: 16, color: theme.colors.text, backgroundColor: '#F9FAFB', padding: 12, borderRadius: 8 }}>
              {user?.current_address || 'Not provided'}
              {user?.city && `, ${user.city}`}
              {user?.province && `, ${user.province}`}
            </Text>
          </View>
        </View>

        {/* Vaccine Selection */}
        <View style={{ margin: theme.spacing.md, backgroundColor: theme.colors.white, borderRadius: 12, padding: theme.spacing.md }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.text, marginBottom: theme.spacing.md }}>
            Select Vaccine *
          </Text>
          
          {vaccines.map((vaccine) => (
            <TouchableOpacity
              key={vaccine.id}
              onPress={() => setSelectedVaccine(vaccine.name)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: theme.spacing.sm,
                borderWidth: 2,
                borderColor: selectedVaccine === vaccine.name ? '#8B5CF6' : '#E5E7EB',
                borderRadius: 8,
                marginBottom: theme.spacing.sm,
                backgroundColor: selectedVaccine === vaccine.name ? '#F3F0FF' : 'transparent'
              }}
            >
              <View>
                <Text style={{ fontWeight: 'bold', color: theme.colors.text }}>{vaccine.name}</Text>
                <Text style={{ color: '#16A34A', fontWeight: 'bold' }}>${vaccine.price.toFixed(2)}</Text>
              </View>
              <View style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: selectedVaccine === vaccine.name ? '#8B5CF6' : '#D1D5DB',
                backgroundColor: selectedVaccine === vaccine.name ? '#8B5CF6' : 'transparent',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {selectedVaccine === vaccine.name && (
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.white }} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Date Selection */}
        <View style={{ margin: theme.spacing.md, backgroundColor: theme.colors.white, borderRadius: 12, padding: theme.spacing.md }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.text, marginBottom: theme.spacing.md }}>
            Select Date *
          </Text>
          
          {availableDates.map((date) => (
            <TouchableOpacity
              key={date}
              onPress={() => setSelectedDate(date)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: theme.spacing.sm,
                borderWidth: 2,
                borderColor: selectedDate === date ? '#8B5CF6' : '#E5E7EB',
                borderRadius: 8,
                marginBottom: theme.spacing.sm,
                backgroundColor: selectedDate === date ? '#F3F0FF' : 'transparent'
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialIcons name="calendar-today" size={20} color="#8B5CF6" style={{ marginRight: 8 }} />
                <Text style={{ color: theme.colors.text }}>{date}</Text>
              </View>
              <View style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: selectedDate === date ? '#8B5CF6' : '#D1D5DB',
                backgroundColor: selectedDate === date ? '#8B5CF6' : 'transparent',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {selectedDate === date && (
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.white }} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Time Selection */}
        <View style={{ margin: theme.spacing.md, backgroundColor: theme.colors.white, borderRadius: 12, padding: theme.spacing.md }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.text, marginBottom: theme.spacing.md }}>
            Select Time *
          </Text>
          
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {availableTimes.map((time) => (
              <TouchableOpacity
                key={time}
                onPress={() => setSelectedTime(time)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderWidth: 2,
                  borderColor: selectedTime === time ? '#8B5CF6' : '#E5E7EB',
                  borderRadius: 8,
                  backgroundColor: selectedTime === time ? '#F3F0FF' : 'transparent',
                  marginBottom: 8
                }}
              >
                <Text style={{ 
                  color: selectedTime === time ? '#8B5CF6' : theme.colors.text,
                  fontWeight: selectedTime === time ? 'bold' : 'normal'
                }}>
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Additional Notes */}
        <View style={{ margin: theme.spacing.md, backgroundColor: theme.colors.white, borderRadius: 12, padding: theme.spacing.md }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.text, marginBottom: theme.spacing.md }}>
            Additional Notes (Optional)
          </Text>
          
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#E5E7EB',
              borderRadius: 8,
              padding: 12,
              height: 100,
              textAlignVertical: 'top',
              color: theme.colors.text
            }}
            placeholder="Any allergies, medical conditions, or special requirements..."
            placeholderTextColor={theme.colors.subtext}
            multiline
            value={notes}
            onChangeText={setNotes}
          />
        </View>
      </ScrollView>

      {/* Book Button */}
      <View style={{ padding: theme.spacing.md, backgroundColor: theme.colors.white, borderTopWidth: 1, borderTopColor: '#E5E7EB' }}>
        <TouchableOpacity
          onPress={handleBooking}
          style={{
            backgroundColor: '#8B5CF6',
            paddingVertical: 16,
            borderRadius: 8,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <MaterialIcons name="event" size={20} color={theme.colors.white} style={{ marginRight: 8 }} />
          <Text style={{ color: theme.colors.white, fontWeight: 'bold', fontSize: 16 }}>
            Book Appointment
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
              Booking Confirmed!
            </Text>
            
            <Text style={{
              fontSize: 16,
              color: theme.colors.subtext,
              textAlign: 'center',
              marginBottom: theme.spacing.md,
              lineHeight: 24
            }}>
              Your vaccination appointment has been successfully booked.
            </Text>

            {selectedVaccine && (
              <Text style={{
                fontSize: 14,
                color: theme.colors.subtext,
                textAlign: 'center',
                marginBottom: theme.spacing.sm
              }}>
                Vaccine: {selectedVaccine}
              </Text>
            )}

            {selectedDate && (
              <Text style={{
                fontSize: 14,
                color: theme.colors.subtext,
                textAlign: 'center',
                marginBottom: theme.spacing.sm
              }}>
                Date: {selectedDate}
              </Text>
            )}

            {selectedTime && (
              <Text style={{
                fontSize: 14,
                color: theme.colors.subtext,
                textAlign: 'center',
                marginBottom: theme.spacing.lg
              }}>
                Time: {selectedTime}
              </Text>
            )}
            
            <TouchableOpacity
              onPress={handleSuccessModalClose}
              style={{
                backgroundColor: '#8B5CF6',
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
                Done
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default VaccinationBookingPage;
