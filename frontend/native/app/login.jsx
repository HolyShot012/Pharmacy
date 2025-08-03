import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../components/AuthContext'; // Import AuthContext instead of API

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth(); // Use AuthContext login function
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const result = await login(email, password); // Use AuthContext login

      if (result.success) {
        setError('');
        // No need to manually navigate - AuthContext will handle state change
        // and index.jsx will automatically redirect to /(tabs)
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.replace('signup')} style={styles.linkContainer}>
        <Text style={styles.linkText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
      {/* Remove or comment out the bypass button in production */}
      <TouchableOpacity style={styles.secondaryButton} onPress={() => router.replace('/') /* bypass */}>
        <Text style={styles.secondaryButtonText}>Proceed to App</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  button: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: '#3B82F6',
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
    borderColor: '#3B82F6',
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#3B82F6',
    fontWeight: 'bold',
    fontSize: 15,
  },
});