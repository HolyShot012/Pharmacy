import DateTimePicker from '@react-native-community/datetimepicker';
import { useHeaderHeight } from '@react-navigation/elements';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { register } from './api';

export default function SignupScreen() {
  const router = useRouter();
  const [fields, setFields] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    province: '',
    city: '',
  });
  const [error, setError] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const headerHeight = useHeaderHeight();

  const handleChange = (key, value) => {
    setFields({ ...fields, [key]: value });
  };

  const validate = () => {
    if (!fields.firstName || !fields.lastName || !fields.dob || !fields.email || !fields.username || !fields.password || !fields.confirmPassword || !fields.address || !fields.province || !fields.city) {
      return 'All fields are required.';
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(fields.email)) {
      return 'Invalid email address.';
    }
    if (fields.password.length < 8) {
      return 'Password must be at least 8 characters.';
    }
    if (fields.password !== fields.confirmPassword) {
      return 'Passwords do not match.';
    }
    return '';
  };

  const handleSignup = async () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    try {
      const response = await register(
        fields.username,
        fields.email,
        fields.password,
        fields.firstName,
        fields.lastName,
        fields.phone,
        fields.address,
        fields.province,
        fields.city,
        null, // avatar_url
        null, // preferred_theme
        "patient", // role defaults to 'user'
        fields.dob
      );
      setError('');
      router.replace('/'); // Navigate to home or protected route
    } catch (error) {
      const errorMessage = error.error || JSON.stringify(error);
      setError(errorMessage);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const iso = selectedDate.toISOString().slice(0, 10);
      setFields({ ...fields, dob: iso });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={headerHeight}
      >
        <ScrollView
          contentContainerStyle={[styles.container, { flexGrow: 1, paddingBottom: 16 }]}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Sign Up</Text>
          <TextInput style={styles.input} placeholder="First Name" value={fields.firstName} onChangeText={v => handleChange('firstName', v)} autoCapitalize="words" />
          <TextInput style={styles.input} placeholder="Last Name" value={fields.lastName} onChangeText={v => handleChange('lastName', v)} autoCapitalize="words" />
          <TouchableOpacity style={[styles.input, { justifyContent: 'center' }]} onPress={() => setShowDatePicker(true)} activeOpacity={0.7}>
            <Text style={{ color: fields.dob ? '#222' : '#888', fontSize: 16 }}>
              {fields.dob ? fields.dob : 'Date of Birth'}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={fields.dob ? new Date(fields.dob) : new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}
          <TextInput style={styles.input} placeholder="Email" value={fields.email} onChangeText={v => handleChange('email', v)} autoCapitalize="none" keyboardType="email-address" />
          <TextInput style={styles.input} placeholder="Username" value={fields.username} onChangeText={v => handleChange('username', v)} autoCapitalize="none" autoCorrect={false} />
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              placeholder="Password"
              value={fields.password}
              onChangeText={v => handleChange('password', v)}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(v => !v)} style={styles.eyeIcon}>
              <Icon name={showPassword ? 'eye-off' : 'eye'} size={22} color="#888" />
            </TouchableOpacity>
          </View>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              placeholder="Confirm Password"
              value={fields.confirmPassword}
              onChangeText={v => handleChange('confirmPassword', v)}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(v => !v)} style={styles.eyeIcon}>
              <Icon name={showConfirmPassword ? 'eye-off' : 'eye'} size={22} color="#888" />
            </TouchableOpacity>
          </View>
          <TextInput style={styles.input} placeholder="Phone Number" value={fields.phone} onChangeText={v => handleChange('phone', v)} keyboardType="phone-pad" />
          <TextInput style={[styles.input, { minHeight: 48 }]} placeholder="Address" value={fields.address} onChangeText={v => handleChange('address', v)} multiline numberOfLines={2} />
          <TextInput style={styles.input} placeholder="Province" value={fields.province} onChangeText={v => handleChange('province', v)} />
          <TextInput style={styles.input} placeholder="City" value={fields.city} onChangeText={v => handleChange('city', v)} />
          {error ? <Text style={error.startsWith('Signup successful') ? styles.success : styles.error}>{error}</Text> : null}
          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.replace('login')} style={styles.linkContainer}>
            <Text style={styles.linkText}>Already have an account? Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => router.replace('/') /* bypass */}>
            <Text style={styles.secondaryButtonText}>Proceed to App</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    color: '#222',
  },
  input: {
    width: '100%',
    maxWidth: 350,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 14,
    marginBottom: 18,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    maxWidth: 350,
    marginBottom: 18,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    padding: 8,
    zIndex: 2,
  },
  button: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: '#10B981',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  error: {
    color: '#EF4444',
    marginBottom: 8,
    fontSize: 15,
    fontWeight: 'bold',
  },
  success: {
    color: '#10B981',
    marginBottom: 8,
    fontSize: 15,
    fontWeight: 'bold',
  },
  linkContainer: {
    marginTop: 18,
  },
  linkText: {
    color: '#3B82F6',
    fontSize: 15,
  },
  secondaryButton: {
    marginTop: 32,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#10B981',
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#10B981',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
