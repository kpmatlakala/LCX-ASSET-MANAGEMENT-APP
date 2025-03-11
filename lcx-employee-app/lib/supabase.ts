import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://wtzmbpceponirzjgocbe.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0em1icGNlcG9uaXJ6amdvY2JlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1OTE3MzAsImV4cCI6MjA1NzE2NzczMH0.wL2KBj9xTSADbIrWaVYye1KUEWBcOnR2jPv3OUYoCoQ"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})