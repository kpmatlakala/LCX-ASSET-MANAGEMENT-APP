import React, { useState, useCallback } from 'react'
import { Alert, StyleSheet, View, AppState } from 'react-native'
import { supabase } from '../../lib/supabase'
import { Button, Input } from '@rneui/themed'

// Automatically refresh the session if the app is in the foreground
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

const Auth = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // Generalized sign-in/signup handler
  const handleAuth = useCallback(
    async (action: 'signIn' | 'signUp') => {
      setLoading(true)

      let response;
      let errorMessage = '';

      if (action === 'signIn') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) errorMessage = error.message
      } else if (action === 'signUp') {
        const { data: { user, session }, error } = await supabase.auth.signUp({ email, password })
        
        if (error) {
          errorMessage = error.message
        } else if (user) {
          // Insert user data into the 'users' table
          const { error: dbError } = await supabase.from('users').insert([
            {
              userId: user.id,
              email: user.email,
              first_name: '',
              last_name: '',
              phone: '',
              role: 'employee', // Default role
              created_at: new Date().toISOString(),
            },
          ])

          if (dbError) {
            errorMessage = dbError.message
          } else if (!session) {
            errorMessage = 'Please check your inbox for email verification!'
          }
        }
      }

      if (errorMessage) {
        Alert.alert(errorMessage)
      }

      setLoading(false)
    },
    [email, password]
  )

  return (
    <View style={styles.container}>
      <InputField label="Email" icon="envelope" value={email} onChange={setEmail} />
      <InputField label="Password" icon="lock" value={password} onChange={setPassword} secureTextEntry />

      <View style={styles.buttonContainer}>
        <Button title="Sign in" disabled={loading} onPress={() => handleAuth('signIn')} />
        <Button title="Sign up" disabled={loading} onPress={() => handleAuth('signUp')} />
      </View>
    </View>
  )
}

// Reusable InputField component
const InputField = ({ label, icon, value, onChange, secureTextEntry = false }) => (
  <View style={styles.verticallySpaced}>
    <Input
      label={label}
      leftIcon={{ type: 'font-awesome', name: icon }}
      onChangeText={onChange}
      value={value}
      placeholder={`${label}@address.com`}
      autoCapitalize="none"
      secureTextEntry={secureTextEntry}
    />
  </View>
)

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  buttonContainer: {
    marginTop: 16,
    gap:16
  },
})

export default Auth
