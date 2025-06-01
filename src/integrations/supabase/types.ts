export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      animal_activities: {
        Row: {
          activity_date: string
          activity_type: string
          animal_id: string
          auto_type: string | null
          breeding_date: string | null
          breeding_notes: string | null
          created_at: string | null
          description: string | null
          details: Json | null
          id: string
          is_automatic: boolean
          notes: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          activity_date: string
          activity_type: string
          animal_id: string
          auto_type?: string | null
          breeding_date?: string | null
          breeding_notes?: string | null
          created_at?: string | null
          description?: string | null
          details?: Json | null
          id: string
          is_automatic?: boolean
          notes?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          activity_date?: string
          activity_type?: string
          animal_id?: string
          auto_type?: string | null
          breeding_date?: string | null
          breeding_notes?: string | null
          created_at?: string | null
          description?: string | null
          details?: Json | null
          id?: string
          is_automatic?: boolean
          notes?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "animal_activities_animal_id_foreign"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animal_activities_user_id_foreign"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      animal_attribute_changes: {
        Row: {
          additional_data: Json | null
          animal_id: string
          attribute_name: string
          change_date: string
          changed_by: number | null
          created_at: string | null
          id: string
          new_value: number | null
          notes: string | null
          old_value: number | null
          unit: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          additional_data?: Json | null
          animal_id: string
          attribute_name: string
          change_date: string
          changed_by?: number | null
          created_at?: string | null
          id: string
          new_value?: number | null
          notes?: string | null
          old_value?: number | null
          unit?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          additional_data?: Json | null
          animal_id?: string
          attribute_name?: string
          change_date?: string
          changed_by?: number | null
          created_at?: string | null
          id?: string
          new_value?: number | null
          notes?: string | null
          old_value?: number | null
          unit?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "animal_attribute_changes_animal_id_foreign"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animal_attribute_changes_user_id_foreign"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      animal_birth_details: {
        Row: {
          animal_id: string
          birth_order: number | null
          birth_photos: Json | null
          birth_status: string
          birth_time: string | null
          birth_weight: number | null
          breeder_info: string | null
          colostrum_intake: number | null
          created_at: string | null
          gestation_length: number | null
          health_at_birth: string
          id: string
          milk_feeding: string | null
          multiple_birth: boolean
          raised_purchased: string
          updated_at: string | null
          vaccinations: Json | null
          weight_unit: string | null
        }
        Insert: {
          animal_id: string
          birth_order?: number | null
          birth_photos?: Json | null
          birth_status: string
          birth_time?: string | null
          birth_weight?: number | null
          breeder_info?: string | null
          colostrum_intake?: number | null
          created_at?: string | null
          gestation_length?: number | null
          health_at_birth: string
          id: string
          milk_feeding?: string | null
          multiple_birth?: boolean
          raised_purchased?: string
          updated_at?: string | null
          vaccinations?: Json | null
          weight_unit?: string | null
        }
        Update: {
          animal_id?: string
          birth_order?: number | null
          birth_photos?: Json | null
          birth_status?: string
          birth_time?: string | null
          birth_weight?: number | null
          breeder_info?: string | null
          colostrum_intake?: number | null
          created_at?: string | null
          gestation_length?: number | null
          health_at_birth?: string
          id?: string
          milk_feeding?: string | null
          multiple_birth?: boolean
          raised_purchased?: string
          updated_at?: string | null
          vaccinations?: Json | null
          weight_unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "animal_birth_details_animal_id_foreign"
            columns: ["animal_id"]
            isOneToOne: true
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
        ]
      }
      animal_locations: {
        Row: {
          animal_id: string
          created_at: string | null
          geofence_details: Json | null
          id: string
          latitude: number | null
          location_description: string | null
          longitude: number | null
          recorded_at: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          animal_id: string
          created_at?: string | null
          geofence_details?: Json | null
          id: string
          latitude?: number | null
          location_description?: string | null
          longitude?: number | null
          recorded_at?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          animal_id?: string
          created_at?: string | null
          geofence_details?: Json | null
          id?: string
          latitude?: number | null
          location_description?: string | null
          longitude?: number | null
          recorded_at?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "animal_locations_animal_id_foreign"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animal_locations_user_id_foreign"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      animal_relationships: {
        Row: {
          animal_id: string
          breeding_date: string | null
          breeding_notes: string | null
          created_at: string | null
          id: string
          related_animal_id: string
          relationship_type: string
          updated_at: string | null
        }
        Insert: {
          animal_id: string
          breeding_date?: string | null
          breeding_notes?: string | null
          created_at?: string | null
          id: string
          related_animal_id: string
          relationship_type: string
          updated_at?: string | null
        }
        Update: {
          animal_id?: string
          breeding_date?: string | null
          breeding_notes?: string | null
          created_at?: string | null
          id?: string
          related_animal_id?: string
          relationship_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "animal_relationships_animal_id_foreign"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animal_relationships_related_animal_id_foreign"
            columns: ["related_animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
        ]
      }
      animal_supplier: {
        Row: {
          animal_id: string
          created_at: string | null
          deleted_at: string | null
          end_date: string | null
          id: string
          notes: string | null
          relationship_type: string | null
          start_date: string | null
          supplier_id: string
          updated_at: string | null
        }
        Insert: {
          animal_id: string
          created_at?: string | null
          deleted_at?: string | null
          end_date?: string | null
          id: string
          notes?: string | null
          relationship_type?: string | null
          start_date?: string | null
          supplier_id: string
          updated_at?: string | null
        }
        Update: {
          animal_id?: string
          created_at?: string | null
          deleted_at?: string | null
          end_date?: string | null
          id?: string
          notes?: string | null
          relationship_type?: string | null
          start_date?: string | null
          supplier_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "animal_supplier_animal_id_foreign"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animal_supplier_supplier_id_foreign"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      animals: {
        Row: {
          birth_date: string | null
          body_condition_score: number | null
          breed: string | null
          coloring: string | null
          created_at: string | null
          death_date: string | null
          deceased_reason: string | null
          deleted_at: string | null
          gender: string | null
          height: number | null
          horn_length: number | null
          id: string
          identification_details: Json | null
          internal_id: string
          is_breeding_stock: boolean
          is_neutered: boolean
          keywords: Json | null
          name: string
          physical_traits: Json | null
          retention_score: number | null
          status: string
          tag_number: string | null
          type: string
          updated_at: string | null
          user_id: string
          weight: number | null
        }
        Insert: {
          birth_date?: string | null
          body_condition_score?: number | null
          breed?: string | null
          coloring?: string | null
          created_at?: string | null
          death_date?: string | null
          deceased_reason?: string | null
          deleted_at?: string | null
          gender?: string | null
          height?: number | null
          horn_length?: number | null
          id: string
          identification_details?: Json | null
          internal_id: string
          is_breeding_stock?: boolean
          is_neutered?: boolean
          keywords?: Json | null
          name: string
          physical_traits?: Json | null
          retention_score?: number | null
          status?: string
          tag_number?: string | null
          type: string
          updated_at?: string | null
          user_id: string
          weight?: number | null
        }
        Update: {
          birth_date?: string | null
          body_condition_score?: number | null
          breed?: string | null
          coloring?: string | null
          created_at?: string | null
          death_date?: string | null
          deceased_reason?: string | null
          deleted_at?: string | null
          gender?: string | null
          height?: number | null
          horn_length?: number | null
          id?: string
          identification_details?: Json | null
          internal_id?: string
          is_breeding_stock?: boolean
          is_neutered?: boolean
          keywords?: Json | null
          name?: string
          physical_traits?: Json | null
          retention_score?: number | null
          status?: string
          tag_number?: string | null
          type?: string
          updated_at?: string | null
          user_id?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "animals_user_id_foreign"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      breedings: {
        Row: {
          animal_id: string
          breeding_date: string | null
          breeding_status: string
          created_at: string | null
          deleted_at: string | null
          due_date: string | null
          health_notes: Json | null
          heat_date: string | null
          id: string
          mate_id: string
          offspring_count: number | null
          offspring_details: Json | null
          pregnancy_status: string
          remarks: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          animal_id: string
          breeding_date?: string | null
          breeding_status?: string
          created_at?: string | null
          deleted_at?: string | null
          due_date?: string | null
          health_notes?: Json | null
          heat_date?: string | null
          id: string
          mate_id: string
          offspring_count?: number | null
          offspring_details?: Json | null
          pregnancy_status?: string
          remarks?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          animal_id?: string
          breeding_date?: string | null
          breeding_status?: string
          created_at?: string | null
          deleted_at?: string | null
          due_date?: string | null
          health_notes?: Json | null
          heat_date?: string | null
          id?: string
          mate_id?: string
          offspring_count?: number | null
          offspring_details?: Json | null
          pregnancy_status?: string
          remarks?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "breedings_animal_id_foreign"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "breedings_mate_id_foreign"
            columns: ["mate_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "breedings_user_id_foreign"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      cache: {
        Row: {
          expiration: number
          key: string
          value: string
        }
        Insert: {
          expiration: number
          key: string
          value: string
        }
        Update: {
          expiration?: number
          key?: string
          value?: string
        }
        Relationships: []
      }
      cache_locks: {
        Row: {
          expiration: number
          key: string
          owner: string
        }
        Insert: {
          expiration: number
          key: string
          owner: string
        }
        Update: {
          expiration?: number
          key?: string
          owner?: string
        }
        Relationships: []
      }
      calendar_event_categories: {
        Row: {
          color: string | null
          created_at: string | null
          icon: string | null
          id: string
          is_system: boolean
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          icon?: string | null
          id: string
          is_system?: boolean
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          is_system?: boolean
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      calendar_event_participants: {
        Row: {
          created_at: string | null
          event_id: string
          id: string
          role: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_id: string
          id: string
          role?: string
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_id?: string
          id?: string
          role?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_event_participants_event_id_foreign"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "calendar_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_event_participants_user_id_foreign"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_event_reminders: {
        Row: {
          created_at: string | null
          custom_message: string | null
          event_id: string
          id: string
          is_sent: boolean
          notification_channels: Json
          remind_before_minutes: number
          scheduled_at: string
          sent_at: string | null
          template_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          custom_message?: string | null
          event_id: string
          id: string
          is_sent?: boolean
          notification_channels: Json
          remind_before_minutes: number
          scheduled_at: string
          sent_at?: string | null
          template_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          custom_message?: string | null
          event_id?: string
          id?: string
          is_sent?: boolean
          notification_channels?: Json
          remind_before_minutes?: number
          scheduled_at?: string
          sent_at?: string | null
          template_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calendar_event_reminders_event_id_foreign"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "calendar_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_event_reminders_template_id_foreign"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "calendar_reminder_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_event_types: {
        Row: {
          allows_attachments: boolean
          category_id: string
          created_at: string | null
          description: string | null
          id: string
          name: string
          required_fields: Json | null
          requires_outcome: boolean
          slug: string
          tracks_cost: boolean
          updated_at: string | null
          validation_rules: Json | null
        }
        Insert: {
          allows_attachments?: boolean
          category_id: string
          created_at?: string | null
          description?: string | null
          id: string
          name: string
          required_fields?: Json | null
          requires_outcome?: boolean
          slug: string
          tracks_cost?: boolean
          updated_at?: string | null
          validation_rules?: Json | null
        }
        Update: {
          allows_attachments?: boolean
          category_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          required_fields?: Json | null
          requires_outcome?: boolean
          slug?: string
          tracks_cost?: boolean
          updated_at?: string | null
          validation_rules?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "calendar_event_types_category_id_foreign"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "calendar_event_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_events: {
        Row: {
          address: string | null
          animal_id: string
          attachments: Json | null
          breeding_id: string | null
          completed_at: string | null
          completed_by: string | null
          cost: number | null
          created_at: string | null
          created_by: string
          deleted_at: string | null
          description: string | null
          end_time: string
          event_type_id: string
          feed_record_id: string | null
          feed_schedule_id: string | null
          id: string
          latitude: number | null
          location_name: string | null
          longitude: number | null
          metadata: Json | null
          outcome_notes: string | null
          parent_event_id: string | null
          priority: string
          recurrence_pattern_id: string | null
          start_time: string
          status: string
          supplier_id: string | null
          task_id: string | null
          title: string
          updated_at: string | null
          updated_by: string
          yield_record_id: string | null
        }
        Insert: {
          address?: string | null
          animal_id: string
          attachments?: Json | null
          breeding_id?: string | null
          completed_at?: string | null
          completed_by?: string | null
          cost?: number | null
          created_at?: string | null
          created_by: string
          deleted_at?: string | null
          description?: string | null
          end_time: string
          event_type_id: string
          feed_record_id?: string | null
          feed_schedule_id?: string | null
          id: string
          latitude?: number | null
          location_name?: string | null
          longitude?: number | null
          metadata?: Json | null
          outcome_notes?: string | null
          parent_event_id?: string | null
          priority?: string
          recurrence_pattern_id?: string | null
          start_time: string
          status?: string
          supplier_id?: string | null
          task_id?: string | null
          title: string
          updated_at?: string | null
          updated_by: string
          yield_record_id?: string | null
        }
        Update: {
          address?: string | null
          animal_id?: string
          attachments?: Json | null
          breeding_id?: string | null
          completed_at?: string | null
          completed_by?: string | null
          cost?: number | null
          created_at?: string | null
          created_by?: string
          deleted_at?: string | null
          description?: string | null
          end_time?: string
          event_type_id?: string
          feed_record_id?: string | null
          feed_schedule_id?: string | null
          id?: string
          latitude?: number | null
          location_name?: string | null
          longitude?: number | null
          metadata?: Json | null
          outcome_notes?: string | null
          parent_event_id?: string | null
          priority?: string
          recurrence_pattern_id?: string | null
          start_time?: string
          status?: string
          supplier_id?: string | null
          task_id?: string | null
          title?: string
          updated_at?: string | null
          updated_by?: string
          yield_record_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_animal_id_foreign"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_breeding_id_foreign"
            columns: ["breeding_id"]
            isOneToOne: false
            referencedRelation: "breedings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_completed_by_foreign"
            columns: ["completed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_created_by_foreign"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_event_type_id_foreign"
            columns: ["event_type_id"]
            isOneToOne: false
            referencedRelation: "calendar_event_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_feed_record_id_foreign"
            columns: ["feed_record_id"]
            isOneToOne: false
            referencedRelation: "feeding_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_feed_schedule_id_foreign"
            columns: ["feed_schedule_id"]
            isOneToOne: false
            referencedRelation: "feeding_schedules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_parent_event_id_foreign"
            columns: ["parent_event_id"]
            isOneToOne: false
            referencedRelation: "calendar_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_recurrence_pattern_id_foreign"
            columns: ["recurrence_pattern_id"]
            isOneToOne: false
            referencedRelation: "calendar_recurrence_patterns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_supplier_id_foreign"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_task_id_foreign"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_updated_by_foreign"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_yield_record_id_foreign"
            columns: ["yield_record_id"]
            isOneToOne: false
            referencedRelation: "yield_records"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_recurrence_patterns: {
        Row: {
          created_at: string | null
          day_of_month: number | null
          days_of_week: Json | null
          end_date: string | null
          exclusion_dates: Json | null
          frequency: string
          id: string
          interval: number
          occurrence_count: number | null
          start_date: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          day_of_month?: number | null
          days_of_week?: Json | null
          end_date?: string | null
          exclusion_dates?: Json | null
          frequency: string
          id: string
          interval?: number
          occurrence_count?: number | null
          start_date: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          day_of_month?: number | null
          days_of_week?: Json | null
          end_date?: string | null
          exclusion_dates?: Json | null
          frequency?: string
          id?: string
          interval?: number
          occurrence_count?: number | null
          start_date?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      calendar_reminder_templates: {
        Row: {
          created_at: string | null
          event_type_id: string
          id: string
          message_template: string
          name: string
          notification_channels: Json
          timing_rules: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          event_type_id: string
          id: string
          message_template: string
          name: string
          notification_channels: Json
          timing_rules: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          event_type_id?: string
          id?: string
          message_template?: string
          name?: string
          notification_channels?: Json
          timing_rules?: Json
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calendar_reminder_templates_event_type_id_foreign"
            columns: ["event_type_id"]
            isOneToOne: false
            referencedRelation: "calendar_event_types"
            referencedColumns: ["id"]
          },
        ]
      }
      collectors: {
        Row: {
          certification_number: string | null
          contact_number: string | null
          created_at: string | null
          employee_id: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string | null
        }
        Insert: {
          certification_number?: string | null
          contact_number?: string | null
          created_at?: string | null
          employee_id?: string | null
          id: string
          is_active?: boolean
          name: string
          updated_at?: string | null
        }
        Update: {
          certification_number?: string | null
          contact_number?: string | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      employees: {
        Row: {
          address: string | null
          animal_id: string
          city: string | null
          country: string | null
          created_at: string | null
          email: string | null
          employment_type: string | null
          first_name: string
          hire_date: string | null
          id: string
          job_title: string | null
          last_name: string
          notes: string | null
          phone: string | null
          salary: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          animal_id: string
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          employment_type?: string | null
          first_name: string
          hire_date?: string | null
          id: string
          job_title?: string | null
          last_name: string
          notes?: string | null
          phone?: string | null
          salary?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          animal_id?: string
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          employment_type?: string | null
          first_name?: string
          hire_date?: string | null
          id?: string
          job_title?: string | null
          last_name?: string
          notes?: string | null
          phone?: string | null
          salary?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_animal_id_foreign"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_user_id_foreign"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      failed_jobs: {
        Row: {
          connection: string
          exception: string
          failed_at: string
          id: number
          payload: string
          queue: string
          uuid: string
        }
        Insert: {
          connection: string
          exception: string
          failed_at?: string
          id?: number
          payload: string
          queue: string
          uuid: string
        }
        Update: {
          connection?: string
          exception?: string
          failed_at?: string
          id?: number
          payload?: string
          queue?: string
          uuid?: string
        }
        Relationships: []
      }
      feed_analytics: {
        Row: {
          analysis_date: string
          animal_id: string
          consumption_patterns: Json | null
          consumption_unit: string
          created_at: string | null
          currency: string
          daily_consumption: number
          daily_cost: number
          feed_type_id: string
          id: string
          updated_at: string | null
          user_id: string
          waste_percentage: number | null
        }
        Insert: {
          analysis_date: string
          animal_id: string
          consumption_patterns?: Json | null
          consumption_unit: string
          created_at?: string | null
          currency?: string
          daily_consumption: number
          daily_cost: number
          feed_type_id: string
          id: string
          updated_at?: string | null
          user_id: string
          waste_percentage?: number | null
        }
        Update: {
          analysis_date?: string
          animal_id?: string
          consumption_patterns?: Json | null
          consumption_unit?: string
          created_at?: string | null
          currency?: string
          daily_consumption?: number
          daily_cost?: number
          feed_type_id?: string
          id?: string
          updated_at?: string | null
          user_id?: string
          waste_percentage?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "feed_analytics_animal_id_foreign"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_analytics_feed_type_id_foreign"
            columns: ["feed_type_id"]
            isOneToOne: false
            referencedRelation: "feed_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_analytics_user_id_foreign"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      feed_inventory: {
        Row: {
          animal_id: string
          batch_number: string | null
          created_at: string | null
          currency: string
          deleted_at: string | null
          expiry_date: string | null
          feed_type_id: string
          id: string
          purchase_date: string
          quantity: number
          supplier: string | null
          unit: string
          unit_price: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          animal_id: string
          batch_number?: string | null
          created_at?: string | null
          currency?: string
          deleted_at?: string | null
          expiry_date?: string | null
          feed_type_id: string
          id: string
          purchase_date: string
          quantity: number
          supplier?: string | null
          unit: string
          unit_price: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          animal_id?: string
          batch_number?: string | null
          created_at?: string | null
          currency?: string
          deleted_at?: string | null
          expiry_date?: string | null
          feed_type_id?: string
          id?: string
          purchase_date?: string
          quantity?: number
          supplier?: string | null
          unit?: string
          unit_price?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feed_inventory_animal_id_foreign"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_inventory_feed_type_id_foreign"
            columns: ["feed_type_id"]
            isOneToOne: false
            referencedRelation: "feed_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_inventory_user_id_foreign"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      feed_types: {
        Row: {
          animal_id: string
          category: string
          created_at: string | null
          deleted_at: string | null
          description: string | null
          id: string
          name: string
          nutritional_info: string | null
          recommended_storage: string | null
          shelf_life_days: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          animal_id: string
          category: string
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id: string
          name: string
          nutritional_info?: string | null
          recommended_storage?: string | null
          shelf_life_days?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          animal_id?: string
          category?: string
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          name?: string
          nutritional_info?: string | null
          recommended_storage?: string | null
          shelf_life_days?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feed_types_animal_id_foreign"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_types_user_id_foreign"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      feeding_records: {
        Row: {
          amount: number
          animal_id: string
          consumption_notes: string | null
          cost: number
          created_at: string | null
          currency: string
          deleted_at: string | null
          fed_at: string
          feed_inventory_id: string
          feed_type_id: string
          feeding_method: string | null
          id: string
          notes: string | null
          schedule_id: string | null
          unit: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          animal_id: string
          consumption_notes?: string | null
          cost: number
          created_at?: string | null
          currency?: string
          deleted_at?: string | null
          fed_at: string
          feed_inventory_id: string
          feed_type_id: string
          feeding_method?: string | null
          id: string
          notes?: string | null
          schedule_id?: string | null
          unit: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          animal_id?: string
          consumption_notes?: string | null
          cost?: number
          created_at?: string | null
          currency?: string
          deleted_at?: string | null
          fed_at?: string
          feed_inventory_id?: string
          feed_type_id?: string
          feeding_method?: string | null
          id?: string
          notes?: string | null
          schedule_id?: string | null
          unit?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feeding_records_animal_id_foreign"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feeding_records_feed_inventory_id_foreign"
            columns: ["feed_inventory_id"]
            isOneToOne: false
            referencedRelation: "feed_inventory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feeding_records_feed_type_id_foreign"
            columns: ["feed_type_id"]
            isOneToOne: false
            referencedRelation: "feed_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feeding_records_schedule_id_foreign"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "feeding_schedules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feeding_records_user_id_foreign"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      feeding_schedules: {
        Row: {
          animal_id: string
          created_at: string | null
          days_of_week: Json | null
          deleted_at: string | null
          feed_type_id: string
          feeding_time: string
          frequency: string
          id: string
          is_active: boolean
          portion_size: number
          portion_unit: string
          special_instructions: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          animal_id: string
          created_at?: string | null
          days_of_week?: Json | null
          deleted_at?: string | null
          feed_type_id: string
          feeding_time: string
          frequency: string
          id: string
          is_active?: boolean
          portion_size: number
          portion_unit: string
          special_instructions?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          animal_id?: string
          created_at?: string | null
          days_of_week?: Json | null
          deleted_at?: string | null
          feed_type_id?: string
          feeding_time?: string
          frequency?: string
          id?: string
          is_active?: boolean
          portion_size?: number
          portion_unit?: string
          special_instructions?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feeding_schedules_animal_id_foreign"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feeding_schedules_feed_type_id_foreign"
            columns: ["feed_type_id"]
            isOneToOne: false
            referencedRelation: "feed_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feeding_schedules_user_id_foreign"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_transactions: {
        Row: {
          amount: number
          animal_id: string
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          related_id: string | null
          related_type: string | null
          transaction_date: string
          transaction_type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          animal_id: string
          category?: string | null
          created_at?: string | null
          description?: string | null
          id: string
          related_id?: string | null
          related_type?: string | null
          transaction_date: string
          transaction_type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          animal_id?: string
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          related_id?: string | null
          related_type?: string | null
          transaction_date?: string
          transaction_type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_transactions_animal_id_foreign"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_user_id_foreign"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      healths: {
        Row: {
          allergies: Json | null
          animal_id: string
          created_at: string | null
          dietary_restrictions: Json | null
          exercise_requirements: Json | null
          health_status: string | null
          id: string
          insurance_details: string | null
          last_vet_visit: string | null
          medical_history: Json | null
          neutered_spayed: boolean | null
          notes: Json | null
          parasite_prevention: Json | null
          regular_medication: Json | null
          updated_at: string | null
          user_id: string
          vaccination_status: string | null
          vaccinations: Json | null
          vet_contact_id: string | null
        }
        Insert: {
          allergies?: Json | null
          animal_id: string
          created_at?: string | null
          dietary_restrictions?: Json | null
          exercise_requirements?: Json | null
          health_status?: string | null
          id: string
          insurance_details?: string | null
          last_vet_visit?: string | null
          medical_history?: Json | null
          neutered_spayed?: boolean | null
          notes?: Json | null
          parasite_prevention?: Json | null
          regular_medication?: Json | null
          updated_at?: string | null
          user_id: string
          vaccination_status?: string | null
          vaccinations?: Json | null
          vet_contact_id?: string | null
        }
        Update: {
          allergies?: Json | null
          animal_id?: string
          created_at?: string | null
          dietary_restrictions?: Json | null
          exercise_requirements?: Json | null
          health_status?: string | null
          id?: string
          insurance_details?: string | null
          last_vet_visit?: string | null
          medical_history?: Json | null
          neutered_spayed?: boolean | null
          notes?: Json | null
          parasite_prevention?: Json | null
          regular_medication?: Json | null
          updated_at?: string | null
          user_id?: string
          vaccination_status?: string | null
          vaccinations?: Json | null
          vet_contact_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "healths_animal_id_foreign"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "healths_user_id_foreign"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      histories: {
        Row: {
          action_type: string
          animal_id: string
          description: string | null
          id: string
          new_data: Json | null
          old_data: Json | null
          recorded_at: string
          related_id: string | null
          related_type: string | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          animal_id: string
          description?: string | null
          id: string
          new_data?: Json | null
          old_data?: Json | null
          recorded_at?: string
          related_id?: string | null
          related_type?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          animal_id?: string
          description?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          recorded_at?: string
          related_id?: string | null
          related_type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "histories_animal_id_foreign"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "histories_user_id_foreign"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_movements: {
        Row: {
          animal_id: string
          created_at: string | null
          id: string
          movement_date: string
          movement_type: string
          notes: string | null
          quantity: number
          supplier: string | null
          total_price: number | null
          unit_price: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          animal_id: string
          created_at?: string | null
          id: string
          movement_date: string
          movement_type: string
          notes?: string | null
          quantity: number
          supplier?: string | null
          total_price?: number | null
          unit_price?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          animal_id?: string
          created_at?: string | null
          id?: string
          movement_date?: string
          movement_type?: string
          notes?: string | null
          quantity?: number
          supplier?: string | null
          total_price?: number | null
          unit_price?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_movements_animal_id_foreign"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_user_id_foreign"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      job_batches: {
        Row: {
          cancelled_at: number | null
          created_at: number
          failed_job_ids: string
          failed_jobs: number
          finished_at: number | null
          id: string
          name: string
          options: string | null
          pending_jobs: number
          total_jobs: number
        }
        Insert: {
          cancelled_at?: number | null
          created_at: number
          failed_job_ids: string
          failed_jobs: number
          finished_at?: number | null
          id: string
          name: string
          options?: string | null
          pending_jobs: number
          total_jobs: number
        }
        Update: {
          cancelled_at?: number | null
          created_at?: number
          failed_job_ids?: string
          failed_jobs?: number
          finished_at?: number | null
          id?: string
          name?: string
          options?: string | null
          pending_jobs?: number
          total_jobs?: number
        }
        Relationships: []
      }
      jobs: {
        Row: {
          attempts: number
          available_at: number
          created_at: number
          id: number
          payload: string
          queue: string
          reserved_at: number | null
        }
        Insert: {
          attempts: number
          available_at: number
          created_at: number
          id?: number
          payload: string
          queue: string
          reserved_at?: number | null
        }
        Update: {
          attempts?: number
          available_at?: number
          created_at?: number
          id?: number
          payload?: string
          queue?: string
          reserved_at?: number | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          batch: number
          id: number
          migration: string
        }
        Insert: {
          batch: number
          id?: number
          migration: string
        }
        Update: {
          batch?: number
          id?: number
          migration?: string
        }
        Relationships: []
      }
      notes: {
        Row: {
          add_to_calendar: boolean
          animal_id: string
          category: string | null
          content: string | null
          created_at: string | null
          deleted_at: string | null
          due_date: string | null
          file_path: string | null
          id: string
          keywords: Json | null
          priority: string
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          add_to_calendar?: boolean
          animal_id: string
          category?: string | null
          content?: string | null
          created_at?: string | null
          deleted_at?: string | null
          due_date?: string | null
          file_path?: string | null
          id: string
          keywords?: Json | null
          priority?: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          add_to_calendar?: boolean
          animal_id?: string
          category?: string | null
          content?: string | null
          created_at?: string | null
          deleted_at?: string | null
          due_date?: string | null
          file_path?: string | null
          id?: string
          keywords?: Json | null
          priority?: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notes_animal_id_foreign"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_user_id_foreign"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          animal_id: string
          id: string
          is_read: boolean
          message: string
          notification_type: string
          read_at: string | null
          related_id: string | null
          related_type: string | null
          sent_at: string
          title: string
          user_id: string | null
        }
        Insert: {
          animal_id: string
          id: string
          is_read?: boolean
          message: string
          notification_type: string
          read_at?: string | null
          related_id?: string | null
          related_type?: string | null
          sent_at?: string
          title: string
          user_id?: string | null
        }
        Update: {
          animal_id?: string
          id?: string
          is_read?: boolean
          message?: string
          notification_type?: string
          read_at?: string | null
          related_id?: string | null
          related_type?: string | null
          sent_at?: string
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_animal_id_foreign"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_foreign"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      password_reset_tokens: {
        Row: {
          created_at: string | null
          email: string
          token: string
        }
        Insert: {
          created_at?: string | null
          email: string
          token: string
        }
        Update: {
          created_at?: string | null
          email?: string
          token?: string
        }
        Relationships: []
      }
      personal_access_tokens: {
        Row: {
          abilities: string | null
          created_at: string | null
          expires_at: string | null
          id: number
          last_used_at: string | null
          name: string
          token: string
          tokenable_id: string
          tokenable_type: string
          updated_at: string | null
        }
        Insert: {
          abilities?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: number
          last_used_at?: string | null
          name: string
          token: string
          tokenable_id: string
          tokenable_type: string
          updated_at?: string | null
        }
        Update: {
          abilities?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: number
          last_used_at?: string | null
          name?: string
          token?: string
          tokenable_id?: string
          tokenable_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      product_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean
          measurement_unit: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id: string
          is_active?: boolean
          measurement_unit: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          measurement_unit?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      product_grades: {
        Row: {
          created_at: string | null
          description: string | null
          grade_name: string
          id: string
          is_active: boolean
          price_modifier: number
          product_category_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          grade_name: string
          id: string
          is_active?: boolean
          price_modifier?: number
          product_category_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          grade_name?: string
          id?: string
          is_active?: boolean
          price_modifier?: number
          product_category_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_grades_product_category_id_foreign"
            columns: ["product_category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      production_methods: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean
          method_name: string
          product_category_id: string
          requires_certification: boolean
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id: string
          is_active?: boolean
          method_name: string
          product_category_id: string
          requires_certification?: boolean
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          method_name?: string
          product_category_id?: string
          requires_certification?: boolean
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "production_methods_product_category_id_foreign"
            columns: ["product_category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          id: string
          ip_address: string | null
          last_activity: number
          payload: string
          user_agent: string | null
          user_id: number | null
        }
        Insert: {
          id: string
          ip_address?: string | null
          last_activity: number
          payload: string
          user_agent?: string | null
          user_id?: number | null
        }
        Update: {
          id?: string
          ip_address?: string | null
          last_activity?: number
          payload?: string
          user_agent?: string | null
          user_id?: number | null
        }
        Relationships: []
      }
      storage_locations: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean
          location_code: string
          name: string
          storage_conditions: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id: string
          is_active?: boolean
          location_code: string
          name: string
          storage_conditions?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          location_code?: string
          name?: string
          storage_conditions?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      supplier_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      supplier_contacts: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          email: string | null
          id: string
          is_primary: boolean
          name: string
          phone: string | null
          position: string | null
          supplier_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          id: string
          is_primary?: boolean
          name: string
          phone?: string | null
          position?: string | null
          supplier_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          id?: string
          is_primary?: boolean
          name?: string
          phone?: string | null
          position?: string | null
          supplier_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "supplier_contacts_supplier_id_foreign"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          account_holder: string | null
          account_number: string | null
          address: string | null
          bank_branch: string | null
          bank_name: string | null
          business_registration_number: string | null
          category_id: string | null
          city: string | null
          contract_end_date: string | null
          contract_start_date: string | null
          country: string | null
          created_at: string | null
          created_by: string | null
          credit_limit: number | null
          currency: string
          delayed_orders: number
          deleted_at: string | null
          email: string | null
          fulfilled_orders: number
          iban: string | null
          id: string
          inventory_level: number
          latitude: number | null
          lead_time_days: number
          longitude: number | null
          meta_data: Json | null
          minimum_order_quantity: number
          name: string
          notes: string | null
          payment_terms: string | null
          phone: string | null
          postal_code: string | null
          product_type: string | null
          quality_incidents: number
          reorder_point: number
          shop_name: string | null
          state: string | null
          status: string
          supplier_importance: string
          supplier_rating: number | null
          swift_code: string | null
          tax_number: string | null
          tax_rate: number
          total_orders: number
          type: string
          updated_at: string | null
          updated_by: string | null
          website: string | null
        }
        Insert: {
          account_holder?: string | null
          account_number?: string | null
          address?: string | null
          bank_branch?: string | null
          bank_name?: string | null
          business_registration_number?: string | null
          category_id?: string | null
          city?: string | null
          contract_end_date?: string | null
          contract_start_date?: string | null
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          credit_limit?: number | null
          currency?: string
          delayed_orders?: number
          deleted_at?: string | null
          email?: string | null
          fulfilled_orders?: number
          iban?: string | null
          id: string
          inventory_level?: number
          latitude?: number | null
          lead_time_days?: number
          longitude?: number | null
          meta_data?: Json | null
          minimum_order_quantity?: number
          name: string
          notes?: string | null
          payment_terms?: string | null
          phone?: string | null
          postal_code?: string | null
          product_type?: string | null
          quality_incidents?: number
          reorder_point?: number
          shop_name?: string | null
          state?: string | null
          status?: string
          supplier_importance?: string
          supplier_rating?: number | null
          swift_code?: string | null
          tax_number?: string | null
          tax_rate?: number
          total_orders?: number
          type: string
          updated_at?: string | null
          updated_by?: string | null
          website?: string | null
        }
        Update: {
          account_holder?: string | null
          account_number?: string | null
          address?: string | null
          bank_branch?: string | null
          bank_name?: string | null
          business_registration_number?: string | null
          category_id?: string | null
          city?: string | null
          contract_end_date?: string | null
          contract_start_date?: string | null
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          credit_limit?: number | null
          currency?: string
          delayed_orders?: number
          deleted_at?: string | null
          email?: string | null
          fulfilled_orders?: number
          iban?: string | null
          id?: string
          inventory_level?: number
          latitude?: number | null
          lead_time_days?: number
          longitude?: number | null
          meta_data?: Json | null
          minimum_order_quantity?: number
          name?: string
          notes?: string | null
          payment_terms?: string | null
          phone?: string | null
          postal_code?: string | null
          product_type?: string | null
          quality_incidents?: number
          reorder_point?: number
          shop_name?: string | null
          state?: string | null
          status?: string
          supplier_importance?: string
          supplier_rating?: number | null
          swift_code?: string | null
          tax_number?: string | null
          tax_rate?: number
          total_orders?: number
          type?: string
          updated_at?: string | null
          updated_by?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "suppliers_category_id_foreign"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "supplier_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          animal_id: string
          created_at: string | null
          description: string | null
          duration: number | null
          end_date: string | null
          end_repeat_date: string | null
          end_time: string | null
          health_notes: string | null
          id: string
          location: string | null
          priority: string
          repeat_frequency: number | null
          repeats: string
          start_date: string | null
          start_time: string | null
          status: string
          task_type: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          animal_id: string
          created_at?: string | null
          description?: string | null
          duration?: number | null
          end_date?: string | null
          end_repeat_date?: string | null
          end_time?: string | null
          health_notes?: string | null
          id: string
          location?: string | null
          priority?: string
          repeat_frequency?: number | null
          repeats?: string
          start_date?: string | null
          start_time?: string | null
          status?: string
          task_type: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          animal_id?: string
          created_at?: string | null
          description?: string | null
          duration?: number | null
          end_date?: string | null
          end_repeat_date?: string | null
          end_time?: string | null
          health_notes?: string | null
          id?: string
          location?: string | null
          priority?: string
          repeat_frequency?: number | null
          repeats?: string
          start_date?: string | null
          start_time?: string | null
          status?: string
          task_type?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_animal_id_foreign"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_user_id_foreign"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      transaction_payments: {
        Row: {
          amount: number
          created_at: string | null
          deleted_at: string | null
          id: string
          notes: string | null
          payment_date: string
          payment_method: string
          payment_reference: string | null
          payment_status: string
          recorded_by: string | null
          transaction_id: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          deleted_at?: string | null
          id: string
          notes?: string | null
          payment_date: string
          payment_method: string
          payment_reference?: string | null
          payment_status: string
          recorded_by?: string | null
          transaction_id: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          notes?: string | null
          payment_date?: string
          payment_method?: string
          payment_reference?: string | null
          payment_status?: string
          recorded_by?: string | null
          transaction_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transaction_payments_recorded_by_foreign"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_payments_transaction_id_foreign"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          animal_id: string
          attached_documents: Json | null
          balance_due: number
          buyer_address: string | null
          buyer_city: string | null
          buyer_company: string | null
          buyer_contact: string | null
          buyer_country: string | null
          buyer_email: string | null
          buyer_id: string | null
          buyer_identification: string | null
          buyer_license_number: string | null
          buyer_name: string | null
          buyer_phone: string | null
          buyer_postal_code: string | null
          buyer_state: string | null
          buyer_tax_id: string | null
          contract_number: string | null
          created_at: string | null
          created_by: string | null
          currency: string
          deleted_at: string | null
          delivery_date: string | null
          delivery_instructions: string | null
          deposit_amount: number
          details: string | null
          health_certificate_number: string | null
          id: string
          insurance_amount: number | null
          insurance_policy_number: string | null
          invoice_number: string | null
          location_of_sale: string | null
          payment_due_date: string | null
          payment_method: string | null
          payment_reference: string | null
          price: number
          seller_address: string | null
          seller_city: string | null
          seller_company: string | null
          seller_contact: string | null
          seller_country: string | null
          seller_email: string | null
          seller_id: string | null
          seller_identification: string | null
          seller_license_number: string | null
          seller_name: string | null
          seller_phone: string | null
          seller_postal_code: string | null
          seller_state: string | null
          seller_tax_id: string | null
          special_conditions: string | null
          tax_amount: number
          terms_accepted: boolean
          terms_accepted_at: string | null
          terms_and_conditions: Json | null
          total_amount: number
          transaction_date: string
          transaction_status: string
          transaction_type: string
          transport_license_number: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          animal_id: string
          attached_documents?: Json | null
          balance_due?: number
          buyer_address?: string | null
          buyer_city?: string | null
          buyer_company?: string | null
          buyer_contact?: string | null
          buyer_country?: string | null
          buyer_email?: string | null
          buyer_id?: string | null
          buyer_identification?: string | null
          buyer_license_number?: string | null
          buyer_name?: string | null
          buyer_phone?: string | null
          buyer_postal_code?: string | null
          buyer_state?: string | null
          buyer_tax_id?: string | null
          contract_number?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string
          deleted_at?: string | null
          delivery_date?: string | null
          delivery_instructions?: string | null
          deposit_amount?: number
          details?: string | null
          health_certificate_number?: string | null
          id: string
          insurance_amount?: number | null
          insurance_policy_number?: string | null
          invoice_number?: string | null
          location_of_sale?: string | null
          payment_due_date?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          price: number
          seller_address?: string | null
          seller_city?: string | null
          seller_company?: string | null
          seller_contact?: string | null
          seller_country?: string | null
          seller_email?: string | null
          seller_id?: string | null
          seller_identification?: string | null
          seller_license_number?: string | null
          seller_name?: string | null
          seller_phone?: string | null
          seller_postal_code?: string | null
          seller_state?: string | null
          seller_tax_id?: string | null
          special_conditions?: string | null
          tax_amount?: number
          terms_accepted?: boolean
          terms_accepted_at?: string | null
          terms_and_conditions?: Json | null
          total_amount: number
          transaction_date: string
          transaction_status?: string
          transaction_type: string
          transport_license_number?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          animal_id?: string
          attached_documents?: Json | null
          balance_due?: number
          buyer_address?: string | null
          buyer_city?: string | null
          buyer_company?: string | null
          buyer_contact?: string | null
          buyer_country?: string | null
          buyer_email?: string | null
          buyer_id?: string | null
          buyer_identification?: string | null
          buyer_license_number?: string | null
          buyer_name?: string | null
          buyer_phone?: string | null
          buyer_postal_code?: string | null
          buyer_state?: string | null
          buyer_tax_id?: string | null
          contract_number?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string
          deleted_at?: string | null
          delivery_date?: string | null
          delivery_instructions?: string | null
          deposit_amount?: number
          details?: string | null
          health_certificate_number?: string | null
          id?: string
          insurance_amount?: number | null
          insurance_policy_number?: string | null
          invoice_number?: string | null
          location_of_sale?: string | null
          payment_due_date?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          price?: number
          seller_address?: string | null
          seller_city?: string | null
          seller_company?: string | null
          seller_contact?: string | null
          seller_country?: string | null
          seller_email?: string | null
          seller_id?: string | null
          seller_identification?: string | null
          seller_license_number?: string | null
          seller_name?: string | null
          seller_phone?: string | null
          seller_postal_code?: string | null
          seller_state?: string | null
          seller_tax_id?: string | null
          special_conditions?: string | null
          tax_amount?: number
          terms_accepted?: boolean
          terms_accepted_at?: string | null
          terms_and_conditions?: Json | null
          total_amount?: number
          transaction_date?: string
          transaction_status?: string
          transaction_type?: string
          transport_license_number?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_animal_id_foreign"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_buyer_id_foreign"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_created_by_foreign"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_seller_id_foreign"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_updated_by_foreign"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      treats: {
        Row: {
          administration_route: string | null
          administration_site: string | null
          animal_id: string
          attachment_path: string | null
          batch_number: string | null
          created_at: string | null
          currency: string
          deleted_at: string | null
          diagnosis: string | null
          dosage: number | null
          expiry_date: string | null
          id: string
          inventory_used: number | null
          is_verified: boolean
          manufacturer: string | null
          next_treatment_date: string | null
          notes: string | null
          outcome: string | null
          product: string | null
          reason: string | null
          record_transaction: boolean
          requires_followup: boolean
          status: string
          tags: Json | null
          technician_id: string | null
          technician_name: string | null
          total_cost: number | null
          treatment_date: string
          treatment_time: string | null
          type: string
          unit: string | null
          unit_cost: number | null
          updated_at: string | null
          user_id: string | null
          verified_at: string | null
          verified_by: string | null
          vital_signs: Json | null
          withdrawal_date: string | null
          withdrawal_days: number | null
        }
        Insert: {
          administration_route?: string | null
          administration_site?: string | null
          animal_id: string
          attachment_path?: string | null
          batch_number?: string | null
          created_at?: string | null
          currency?: string
          deleted_at?: string | null
          diagnosis?: string | null
          dosage?: number | null
          expiry_date?: string | null
          id: string
          inventory_used?: number | null
          is_verified?: boolean
          manufacturer?: string | null
          next_treatment_date?: string | null
          notes?: string | null
          outcome?: string | null
          product?: string | null
          reason?: string | null
          record_transaction?: boolean
          requires_followup?: boolean
          status?: string
          tags?: Json | null
          technician_id?: string | null
          technician_name?: string | null
          total_cost?: number | null
          treatment_date: string
          treatment_time?: string | null
          type: string
          unit?: string | null
          unit_cost?: number | null
          updated_at?: string | null
          user_id?: string | null
          verified_at?: string | null
          verified_by?: string | null
          vital_signs?: Json | null
          withdrawal_date?: string | null
          withdrawal_days?: number | null
        }
        Update: {
          administration_route?: string | null
          administration_site?: string | null
          animal_id?: string
          attachment_path?: string | null
          batch_number?: string | null
          created_at?: string | null
          currency?: string
          deleted_at?: string | null
          diagnosis?: string | null
          dosage?: number | null
          expiry_date?: string | null
          id?: string
          inventory_used?: number | null
          is_verified?: boolean
          manufacturer?: string | null
          next_treatment_date?: string | null
          notes?: string | null
          outcome?: string | null
          product?: string | null
          reason?: string | null
          record_transaction?: boolean
          requires_followup?: boolean
          status?: string
          tags?: Json | null
          technician_id?: string | null
          technician_name?: string | null
          total_cost?: number | null
          treatment_date?: string
          treatment_time?: string | null
          type?: string
          unit?: string | null
          unit_cost?: number | null
          updated_at?: string | null
          user_id?: string | null
          verified_at?: string | null
          verified_by?: string | null
          vital_signs?: Json | null
          withdrawal_date?: string | null
          withdrawal_days?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "treats_animal_id_foreign"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treats_user_id_foreign"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar: string | null
          created_at: string | null
          email: string
          email_verified_at: string | null
          id: string
          name: string
          password: string
          remember_token: string | null
          updated_at: string | null
        }
        Insert: {
          avatar?: string | null
          created_at?: string | null
          email: string
          email_verified_at?: string | null
          id: string
          name: string
          password: string
          remember_token?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar?: string | null
          created_at?: string | null
          email?: string
          email_verified_at?: string | null
          id?: string
          name?: string
          password?: string
          remember_token?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      yield_records: {
        Row: {
          additional_attributes: Json | null
          animal_id: string
          certification_number: string | null
          collector_id: string | null
          created_at: string | null
          deleted_at: string | null
          id: string
          is_organic: boolean
          notes: string | null
          price_per_unit: number
          product_category_id: string
          product_grade_id: string
          production_date: string
          production_method_id: string
          production_time: string
          quality_notes: string | null
          quality_status: string
          quantity: number
          storage_conditions: Json | null
          storage_location_id: string | null
          total_price: number
          trace_number: string | null
          updated_at: string | null
          user_id: string
          weather_conditions: Json | null
        }
        Insert: {
          additional_attributes?: Json | null
          animal_id: string
          certification_number?: string | null
          collector_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id: string
          is_organic?: boolean
          notes?: string | null
          price_per_unit: number
          product_category_id: string
          product_grade_id: string
          production_date: string
          production_method_id: string
          production_time: string
          quality_notes?: string | null
          quality_status: string
          quantity: number
          storage_conditions?: Json | null
          storage_location_id?: string | null
          total_price: number
          trace_number?: string | null
          updated_at?: string | null
          user_id: string
          weather_conditions?: Json | null
        }
        Update: {
          additional_attributes?: Json | null
          animal_id?: string
          certification_number?: string | null
          collector_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          is_organic?: boolean
          notes?: string | null
          price_per_unit?: number
          product_category_id?: string
          product_grade_id?: string
          production_date?: string
          production_method_id?: string
          production_time?: string
          quality_notes?: string | null
          quality_status?: string
          quantity?: number
          storage_conditions?: Json | null
          storage_location_id?: string | null
          total_price?: number
          trace_number?: string | null
          updated_at?: string | null
          user_id?: string
          weather_conditions?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "yield_records_animal_id_foreign"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "yield_records_collector_id_foreign"
            columns: ["collector_id"]
            isOneToOne: false
            referencedRelation: "collectors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "yield_records_product_category_id_foreign"
            columns: ["product_category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "yield_records_product_grade_id_foreign"
            columns: ["product_grade_id"]
            isOneToOne: false
            referencedRelation: "product_grades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "yield_records_production_method_id_foreign"
            columns: ["production_method_id"]
            isOneToOne: false
            referencedRelation: "production_methods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "yield_records_storage_location_id_foreign"
            columns: ["storage_location_id"]
            isOneToOne: false
            referencedRelation: "storage_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "yield_records_user_id_foreign"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
