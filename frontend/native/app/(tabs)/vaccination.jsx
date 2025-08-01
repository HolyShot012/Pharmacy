import { LinearGradient } from 'expo-linear-gradient';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { styles } from '../../components/ui/Styles';
import { theme } from '../../components/ui/Theme';

const VaccinationPage = () =>{
  const vaccinations = [
    { id: 1, name: 'COVID-19 Booster', price: 45.00, duration: '30 min', nextAvailable: 'Today 2:00 PM' },
    { id: 2, name: 'Flu Shot', price: 35.00, duration: '15 min', nextAvailable: 'Tomorrow 10:00 AM' },
    { id: 3, name: 'Hepatitis B', price: 65.00, duration: '20 min', nextAvailable: 'Jul 5, 9:00 AM' }
  ];

  return(
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <FlatList
        data={vaccinations}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={
          <>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: theme.spacing.md, paddingTop: theme.spacing.lg }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: theme.colors.text }}>Vaccination Services</Text>
              <TouchableOpacity style={{ backgroundColor: '#8B5CF6', padding: 8, borderRadius: 8 }}>
                <MaterialIcons name="calendar-today" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            <LinearGradient colors={["#8B5CF6", "#EC4899"]} style={{ borderRadius: 20, padding: 24, margin: 16 }}>
              <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>Book Your Vaccination</Text>
              <Text style={{ color: '#fff', opacity: 0.9, marginBottom: 16 }}>Stay protected with our vaccination services</Text>
              <TouchableOpacity style={{ backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, alignSelf: 'flex-start' }}>
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
              <TouchableOpacity style={{ backgroundColor: '#8B5CF6', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 }}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Book Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListFooterComponent={
          <View style={[styles.productCard, { backgroundColor: '#EFF6FF', borderColor: '#DBEAFE', borderWidth: 1 }]}>
            <Text style={{ fontWeight: 'bold', color: '#1E40AF', marginBottom: 8 }}>Vaccination Records</Text>
            <Text style={{ color: '#2563EB', marginBottom: 12 }}>Keep track of your immunization history</Text>
            <TouchableOpacity style={{ backgroundColor: '#3B82F6', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 }}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>View Records</Text>
            </TouchableOpacity>
          </View>
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 0 }}
      />
    </View>
  );
}

export default VaccinationPage;
