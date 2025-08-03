// This file makes the (tabs) directory the root route for the app
import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/(tabs)/login" />;
}
