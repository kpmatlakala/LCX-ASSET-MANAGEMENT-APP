import { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { Button, Input } from '@rneui/themed';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

const Profile = () => {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // User info state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session) getProfile(session);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        getProfile(session);
      } else {
        router.replace("/(auth)/Auth"); // Redirect if signed out
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function getProfile(session: Session) {
    try {
      setLoading(true);
      const { user } = session;
      if (!user) throw new Error("No user found!");

      const { data, error } = await supabase
        .from("users")
        .select("first_name, last_name, phone, role")
        .eq("userId", user.id)
        .single();

      if (error) throw error;
      if (data) {
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setPhone(data.phone);
        setRole(data.role); // Read-only
      }
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  const updateProfile = async () => {
    try {
      setLoading(true);
      const { user } = session!;
      if (!user) throw new Error("No user found!");

      const { error } = await supabase
        .from("users")
        .update({
          first_name: firstName,
          last_name: lastName,
          phone: phone,
        })
        .eq("userId", user.id);

      if (error) throw error;
      Alert.alert("Profile updated successfully!");
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/(auth)/Auth");
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to your Account!</Text>
      <Input label="Email" value={session?.user?.email || ''} disabled />
      <Input label="First Name" value={firstName} onChangeText={setFirstName} />
      <Input label="Last Name" value={lastName} onChangeText={setLastName} />
      <Input label="Phone" value={phone} onChangeText={setPhone} />
      <Input label="Role" value={role} disabled />

      <Button title="Update Profile" onPress={updateProfile} disabled={loading} />

      <View style={styles.divider} />

      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 20,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
