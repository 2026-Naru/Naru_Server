/**
 * Supabase DB에서 자동 생성된 타입 파일
 *
 * ⚠️  직접 수정하지 마세요. 스키마가 바뀌면 아래 명령어로 재생성하세요:
 *     npm run gen:types
 *
 * 재생성을 위해 .env 에 SUPABASE_ACCESS_TOKEN 설정이 필요합니다.
 * 토큰 발급: https://supabase.com/dashboard/account/tokens
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: number;
          name: string | null;
          email: string | null;
          password_hash: string | null;
          phone: string | null;
          profile_image_url: string | null;
          country_id: number | null;
          balance_krw: number | null;
          balance_usd: number | null;
          created_at: string | null;
        };
        Insert: {
          name?: string | null;
          email?: string | null;
          password_hash?: string | null;
          phone?: string | null;
          profile_image_url?: string | null;
          country_id?: number | null;
          balance_krw?: number | null;
          balance_usd?: number | null;
        };
        Update: {
          name?: string | null;
          email?: string | null;
          password_hash?: string | null;
          phone?: string | null;
          profile_image_url?: string | null;
          balance_krw?: number | null;
          balance_usd?: number | null;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: number;
          name: string | null;
          image_url: string | null;
        };
        Insert: {
          name?: string | null;
          image_url?: string | null;
        };
        Update: {
          name?: string | null;
          image_url?: string | null;
        };
        Relationships: [];
      };
      stores: {
        Row: {
          id: number;
          category_id: number | null;
          name: string | null;
          description: string | null;
          address: string | null;
          latitude: number | null;
          longitude: number | null;
          image_url: string | null;
          rating: number | null;
          review_count: number | null;
        };
        Insert: {
          category_id?: number | null;
          name?: string | null;
          description?: string | null;
          address?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          image_url?: string | null;
          rating?: number | null;
          review_count?: number | null;
        };
        Update: {
          category_id?: number | null;
          name?: string | null;
          description?: string | null;
          address?: string | null;
          image_url?: string | null;
          rating?: number | null;
          review_count?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'stores_category_id_fkey';
            columns: ['category_id'];
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
        ];
      };
      menus: {
        Row: {
          id: number;
          store_id: number | null;
          name: string | null;
          description: string | null;
          price: number;
          image_url: string | null;
          allergy_notice: string | null;
        };
        Insert: {
          store_id?: number | null;
          name?: string | null;
          description?: string | null;
          price: number;
          image_url?: string | null;
          allergy_notice?: string | null;
        };
        Update: {
          store_id?: number | null;
          name?: string | null;
          description?: string | null;
          price?: number;
          image_url?: string | null;
          allergy_notice?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'menus_store_id_fkey';
            columns: ['store_id'];
            referencedRelation: 'stores';
            referencedColumns: ['id'];
          },
        ];
      };
      carts: {
        Row: {
          id: number;
          user_id: number | null;
          created_at: string | null;
        };
        Insert: {
          user_id?: number | null;
        };
        Update: {
          user_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'carts_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      cart_items: {
        Row: {
          id: number;
          cart_id: number | null;
          menu_id: number | null;
          quantity: number | null;
        };
        Insert: {
          cart_id?: number | null;
          menu_id?: number | null;
          quantity?: number | null;
        };
        Update: {
          cart_id?: number | null;
          menu_id?: number | null;
          quantity?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'cart_items_cart_id_fkey';
            columns: ['cart_id'];
            referencedRelation: 'carts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'cart_items_menu_id_fkey';
            columns: ['menu_id'];
            referencedRelation: 'menus';
            referencedColumns: ['id'];
          },
        ];
      };
      orders: {
        Row: {
          id: number;
          user_id: number | null;
          store_id: number | null;
          store_name: string | null;
          store_image: string | null;
          delivery_address: string | null;
          total_amount: number | null;
          status: string | null;
          ordered_at: string | null;
          completed_at: string | null;
        };
        Insert: {
          user_id?: number | null;
          store_id?: number | null;
          store_name?: string | null;
          store_image?: string | null;
          delivery_address?: string | null;
          total_amount?: number | null;
          status?: string | null;
        };
        Update: {
          status?: string | null;
          store_id?: number | null;
          store_name?: string | null;
          store_image?: string | null;
          delivery_address?: string | null;
          total_amount?: number | null;
          completed_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'orders_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'orders_store_id_fkey';
            columns: ['store_id'];
            referencedRelation: 'stores';
            referencedColumns: ['id'];
          },
        ];
      };
      order_items: {
        Row: {
          id: number;
          order_id: number | null;
          menu_id: number | null;
          quantity: number | null;
          price: number | null;
        };
        Insert: {
          order_id?: number | null;
          menu_id?: number | null;
          quantity?: number | null;
          price?: number | null;
        };
        Update: {
          quantity?: number | null;
          price?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'order_items_order_id_fkey';
            columns: ['order_id'];
            referencedRelation: 'orders';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'order_items_menu_id_fkey';
            columns: ['menu_id'];
            referencedRelation: 'menus';
            referencedColumns: ['id'];
          },
        ];
      };
      reviews: {
        Row: {
          id: number;
          store_id: number | null;
          user_id: number | null;
          rating: number | null;
          content: string | null;
          country: string | null;
          image_url: string | null;
          created_at: string | null;
        };
        Insert: {
          store_id?: number | null;
          user_id?: number | null;
          rating?: number | null;
          content?: string | null;
          country?: string | null;
          image_url?: string | null;
        };
        Update: {
          rating?: number | null;
          content?: string | null;
          country?: string | null;
          image_url?: string | null;
        };
        Relationships: [];
      };
      balances: {
        Row: {
          user_id: number;
          balance_krw: number | null;
          balance_usd: number | null;
          updated_at: string | null;
        };
        Insert: {
          user_id: number;
          balance_krw?: number | null;
          balance_usd?: number | null;
        };
        Update: {
          balance_krw?: number | null;
          balance_usd?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'balances_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      exchanges: {
        Row: {
          id: number;
          user_id: number | null;
          type: string | null;
          amount: number | null;
          currency: string | null;
          balance_after: number | null;
          created_at: string | null;
        };
        Insert: {
          user_id?: number | null;
          type?: string | null;
          amount?: number | null;
          currency?: string | null;
          balance_after?: number | null;
        };
        Update: {
          type?: string | null;
          amount?: number | null;
        };
        Relationships: [];
      };
      exchange_rates: {
        Row: {
          id: number;
          from_currency: string | null;
          to_currency: string | null;
          rate: number | null;
          fetched_at: string | null;
        };
        Insert: {
          from_currency?: string | null;
          to_currency?: string | null;
          rate?: number | null;
        };
        Update: {
          rate?: number | null;
          fetched_at?: string | null;
        };
        Relationships: [];
      };
      exchange_transactions: {
        Row: {
          id: number;
          user_id: number | null;
          from_currency: string | null;
          to_currency: string | null;
          amount_from: number | null;
          amount_to: number | null;
          exchange_rate: number | null;
          created_at: string | null;
        };
        Insert: {
          user_id?: number | null;
          from_currency?: string | null;
          to_currency?: string | null;
          amount_from?: number | null;
          amount_to?: number | null;
          exchange_rate?: number | null;
        };
        Update: {
          amount_from?: number | null;
          amount_to?: number | null;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          id: number;
          user_id: number | null;
          order_id: number | null;
          title: string | null;
          message: string | null;
          is_read: boolean | null;
          created_at: string | null;
          expires_at: string | null;
        };
        Insert: {
          user_id?: number | null;
          order_id?: number | null;
          title?: string | null;
          message?: string | null;
          is_read?: boolean | null;
          expires_at?: string | null;
        };
        Update: {
          is_read?: boolean | null;
          expires_at?: string | null;
        };
        Relationships: [];
      };
      payments: {
        Row: {
          id: number;
          order_id: number | null;
          amount: number | null;
          card_company: string | null;
          paid_at: string | null;
          status: string | null;
        };
        Insert: {
          order_id?: number | null;
          amount?: number | null;
          card_company?: string | null;
          status?: string | null;
        };
        Update: {
          status?: string | null;
          paid_at?: string | null;
        };
        Relationships: [];
      };
      countries: {
        Row: {
          id: number;
          name: string;
          currency_code: string | null;
          currency_symbol: string | null;
        };
        Insert: {
          name: string;
          currency_code?: string | null;
          currency_symbol?: string | null;
        };
        Update: {
          name?: string;
          currency_code?: string | null;
          currency_symbol?: string | null;
        };
        Relationships: [];
      };
      allergies: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          name: string;
        };
        Update: {
          name?: string;
        };
        Relationships: [];
      };
      menu_allergies: {
        Row: {
          menu_id: number;
          allergy_id: number;
        };
        Insert: {
          menu_id: number;
          allergy_id: number;
        };
        Update: {
          menu_id?: number;
          allergy_id?: number;
        };
        Relationships: [];
      };
      user_allergies: {
        Row: {
          user_id: number;
          allergy_id: number;
        };
        Insert: {
          user_id: number;
          allergy_id: number;
        };
        Update: {
          user_id?: number;
          allergy_id?: number;
        };
        Relationships: [];
      };
      coupons: {
        Row: {
          id: number;
          name: string | null;
          discount_amount: number | null;
          expires_at: string | null;
        };
        Insert: {
          name?: string | null;
          discount_amount?: number | null;
          expires_at?: string | null;
        };
        Update: {
          name?: string | null;
          discount_amount?: number | null;
          expires_at?: string | null;
        };
        Relationships: [];
      };
      user_coupons: {
        Row: {
          id: number;
          user_id: number | null;
          coupon_id: number | null;
          is_used: boolean | null;
          used_at: string | null;
        };
        Insert: {
          user_id?: number | null;
          coupon_id?: number | null;
          is_used?: boolean | null;
        };
        Update: {
          is_used?: boolean | null;
          used_at?: string | null;
        };
        Relationships: [];
      };
      user_favorites: {
        Row: {
          id: number;
          user_id: number | null;
          store_id: number | null;
          created_at: string | null;
        };
        Insert: {
          user_id?: number | null;
          store_id?: number | null;
        };
        Update: {
          user_id?: number | null;
          store_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'user_favorites_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_favorites_store_id_fkey';
            columns: ['store_id'];
            referencedRelation: 'stores';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
