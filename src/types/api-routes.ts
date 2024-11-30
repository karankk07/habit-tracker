import { Database } from './database'

export type HabitResponse = Database['public']['Tables']['habits']['Row']
export type HabitLogResponse = Database['public']['Tables']['habit_logs']['Row']

export interface ApiEndpoints {
  '/api/habits': {
    GET: {
      response: HabitResponse[]
    }
    POST: {
      body: Omit<HabitResponse, 'id' | 'created_at' | 'updated_at'>
      response: HabitResponse
    }
  }
  // Add other API endpoints here
} 