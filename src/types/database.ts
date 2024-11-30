export interface Database {
  public: {
    Tables: {
      habits: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          frequency: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Tables['habits']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Tables['habits']['Insert']>
      }
      habit_logs: {
        Row: {
          id: string
          habit_id: string
          user_id: string
          date: string
          status: 'completed' | 'partial' | 'skipped'
          created_at: string
          updated_at: string
        }
        Insert: Omit<Tables['habit_logs']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Tables['habit_logs']['Insert']>
      }
    }
  }
}

export type Tables = Database['public']['Tables'] 