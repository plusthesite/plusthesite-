export interface Database {
  public: {
    Tables: {
      chat_messages: {
        Row: {
          id: string;
          session_id: string;
          role: 'user' | 'assistant';
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          role: 'user' | 'assistant';
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          role?: 'user' | 'assistant';
          content?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      contacts: {
        Row: {
          id: string;
          name: string;
          email: string;
          company: string | null;
          message: string;
          status: 'new' | 'read' | 'replied';
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          company?: string | null;
          message: string;
          status?: 'new' | 'read' | 'replied';
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          company?: string | null;
          message?: string;
          status?: 'new' | 'read' | 'replied';
          created_at?: string;
        };
        Relationships: [];
      };
      kol_database: {
        Row: {
          id: string;
          name: string;
          handle: string;
          category: string;
          followers: string;
          engagement_rate: string;
          price: number;
          tags: string[];
          verified: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          handle: string;
          category: string;
          followers: string;
          engagement_rate: string;
          price: number;
          tags?: string[];
          verified?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          handle?: string;
          category?: string;
          followers?: string;
          engagement_rate?: string;
          price?: number;
          tags?: string[];
          verified?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      analytics_events: {
        Row: {
          id: string;
          event_type: string;
          page: string;
          metadata: Record<string, unknown> | null;
          session_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_type: string;
          page: string;
          metadata?: Record<string, unknown> | null;
          session_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_type?: string;
          page?: string;
          metadata?: Record<string, unknown> | null;
          session_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
