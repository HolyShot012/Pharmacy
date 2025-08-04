import { LinearGradient } from 'expo-linear-gradient';
import { FlatList, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Calendar } from 'react-native-calendars';
import { styles } from '../../components/ui/Styles';
import { theme } from '../../components/ui/Theme';
import { useRouter } from 'expo-router';
import { useState } from 'react';

const VaccinationPage = () =>{
  const router = useRouter();
  const [showCalendar, setShowCalendar] = useState(false);
  
  const vaccinations = [
    { id: 1, name: 'COVID-19 Booster', price: 45.00, duration: '30 min', nextAvailable: 'Today 2:00 PM' },
    { id: 2, name: 'Flu Shot', price: 35.00, duration: '15 min', nextAvailable: 'Tomorrow 10:00 AM' },
    { id: 3, name: 'Hepatitis B', price: 65.00, duration: '20 min', nextAvailable: 'Jul 5, 9:00 AM' }
  ];

  // Sample vaccination records with dates
  const vaccinationRecords = [
    { date: '2024-01-15', name: 'COVID-19 Booster', status: 'completed' },
    { date: '2024-03-22', name: 'Flu Shot', status: 'completed' },
    { date: '2024-08-10', name: 'Hepatitis B', status: 'scheduled' },
    { date: '2024-12-15', name: 'Annual Flu Shot', status: 'scheduled' }
  ];

  // Create marked dates object for react-native-calendars
  const getMarkedDates = () => {
    const marked = {};
    
    vaccinationRecords.forEach(record => {
      marked[record.date] = {
        marked: true,
        dotColor: record.status === 'completed' ? '#4CAF50' : '#FF9800',
        selectedColor: record.status === 'completed' ? '#4CAF50' : '#FF9800',
        selectedTextColor: '#FFFFFF'
      };
    });

    // Mark today's date
    const today = new Date().toISOString().split('T')[0];
    if (!marked[today]) {
      marked[today] = {
        marked: true,
        dotColor: theme.colors.primary,
        selectedColor: theme.colors.primary,
        selectedTextColor: '#FFFFFF'
      };
    } else {
      // If today also has a vaccination, combine the markings
      marked[today] = {
        ...marked[today],
        selected: true,
        selectedColor: marked[today].dotColor,
        selectedTextColor: '#FFFFFF'
      };
    }

    return marked;
  };

  const onDayPress = (day) => {
    const vaccination = vaccinationRecords.find(record => record.date === day.dateString);
    if (vaccination) {
      alert(`${vaccination.name} - ${vaccination.status === 'completed' ? 'Completed' : 'Scheduled'}`);
    }
  };

  return(
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <FlatList
        data={vaccinations}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={
          <>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: theme.spacing.md, paddingTop: theme.spacing.lg }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: theme.colors.text }}>Vaccination Services</Text>
              <TouchableOpacity 
                style={{ backgroundColor: '#8B5CF6', padding: 8, borderRadius: 8 }}
                onPress={() => setShowCalendar(true)}
              >
                <MaterialIcons name="calendar-today" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            <LinearGradient colors={["#8B5CF6", "#EC4899"]} style={{ borderRadius: 20, padding: 24, margin: 16 }}>
              <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>Book Your Vaccination</Text>
              <Text style={{ color: '#fff', opacity: 0.9, marginBottom: 16 }}>Stay protected with our vaccination services</Text>
              <TouchableOpacity 
                style={{ backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, alignSelf: 'flex-start' }}
                onPress={() => router.push('/vaccination-booking')}
              >
                <Text style={{ color: '#8B5CF6', fontWeight: 'bold' }}>Book Appointment</Text>
              </TouchableOpacity>
            </LinearGradient>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <View style={{ width: 48, height: 48, backgroundColor: '#EDE9FE', borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                <MaterialIcons name="vaccines" size={28} color="#8B5CF6" />
              </View>
              <View>
                <Text style={{ fontWeight: 'bold', color: theme.colors.text }}>{item.name}</Text>
                <Text style={{ color: theme.colors.subtext }}>Duration: {item.duration}</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <Text style={{ color: '#16A34A', fontWeight: 'bold', fontSize: 16 }}>${item.price}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Text style={{ color: theme.colors.subtext }}>Next Available:</Text>
                <Text style={{ color: '#8B5CF6', fontWeight: 'bold' }}>{item.nextAvailable}</Text>
              </View>
              <TouchableOpacity 
                style={{ backgroundColor: '#8B5CF6', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 }}
                onPress={() => router.push('/vaccination-booking')}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Book Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListFooterComponent={
          <View style={[styles.productCard, { backgroundColor: '#EFF6FF', borderColor: '#DBEAFE', borderWidth: 1 }]}>
            <Text style={{ fontWeight: 'bold', color: '#1E40AF', marginBottom: 8 }}>Vaccination Records</Text>
            <Text style={{ color: '#2563EB', marginBottom: 12 }}>Keep track of your immunization history</Text>
            <TouchableOpacity 
              style={{ backgroundColor: '#3B82F6', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 }}
              onPress={() => router.push('/vaccination-records')}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>View Records</Text>
            </TouchableOpacity>
          </View>
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 0 }}
      />

      {/* Calendar Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showCalendar}
        onRequestClose={() => setShowCalendar(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{
            backgroundColor: theme.colors.white,
            borderRadius: 16,
            width: '90%',
            maxHeight: '80%'
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 20,
              borderBottomWidth: 1,
              borderBottomColor: '#E5E7EB'
            }}>
              <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: theme.colors.text
              }}>
                Vaccination Calendar
              </Text>
              <TouchableOpacity
                onPress={() => setShowCalendar(false)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: '#F3F4F6',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <MaterialIcons name="close" size={20} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            
            <View style={{ padding: 16 }}>
              <Calendar
                markedDates={getMarkedDates()}
                onDayPress={onDayPress}
                theme={{
                  backgroundColor: '#ffffff',
                  calendarBackground: '#ffffff',
                  textSectionTitleColor: theme.colors.subtext,
                  selectedDayBackgroundColor: theme.colors.primary,
                  selectedDayTextColor: '#ffffff',
                  todayTextColor: theme.colors.primary,
                  dayTextColor: theme.colors.text,
                  textDisabledColor: '#d9e1e8',
                  dotColor: theme.colors.primary,
                  selectedDotColor: '#ffffff',
                  arrowColor: theme.colors.primary,
                  monthTextColor: theme.colors.text,
                  indicatorColor: theme.colors.primary,
                  textDayFontFamily: 'System',
                  textMonthFontFamily: 'System',
                  textDayHeaderFontFamily: 'System',
                  textDayFontWeight: '400',
                  textMonthFontWeight: 'bold',
                  textDayHeaderFontWeight: '600',
                  textDayFontSize: 16,
                  textMonthFontSize: 18,
                  textDayHeaderFontSize: 14
                }}
                enableSwipeMonths={true}
              />
              
              {/* Legend */}
              <View style={{ marginTop: 20, backgroundColor: '#F9FAFB', borderRadius: 8, padding: 16 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 12, color: theme.colors.text }}>
                  Legend:
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <View style={{ width: 16, height: 16, backgroundColor: '#4CAF50', borderRadius: 8, marginRight: 12 }} />
                  <Text style={{ color: theme.colors.text, fontSize: 14 }}>Completed Vaccination</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <View style={{ width: 16, height: 16, backgroundColor: '#FF9800', borderRadius: 8, marginRight: 12 }} />
                  <Text style={{ color: theme.colors.text, fontSize: 14 }}>Scheduled Vaccination</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 16, height: 16, backgroundColor: theme.colors.primary, borderRadius: 8, marginRight: 12 }} />
                  <Text style={{ color: theme.colors.text, fontSize: 14 }}>Today</Text>
                </View>
                <Text style={{ color: theme.colors.subtext, fontSize: 12, marginTop: 8, fontStyle: 'italic' }}>
                  Tap on a marked date to see vaccination details
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default VaccinationPage;
