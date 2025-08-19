-- Migration: Add platform_search_results table
-- Created: 2025-08-19
-- Purpose: Store search results from platform integrations

-- Create platform_search_results table to store search results from each platform
CREATE TABLE IF NOT EXISTS "public"."platform_search_results" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "platform_name" "text" NOT NULL,
    "search_query" "text" NOT NULL,
    "platform_business_id" "text" NOT NULL,
    "business_name" "text" NOT NULL,
    "address" "text",
    "phone" "text",
    "website" "text",
    "rating" "int2",
    "review_count" "int8",
    "category" "text",
    "latitude" "numeric",
    "longitude" "numeric",
    "opening_hours" "jsonb",
    "raw_data" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

-- Add primary key
ALTER TABLE ONLY "public"."platform_search_results"
    ADD CONSTRAINT "platform_search_results_pkey" PRIMARY KEY ("id");

-- Add unique constraint to prevent duplicate results
ALTER TABLE ONLY "public"."platform_search_results"
    ADD CONSTRAINT "platform_search_results_unique" UNIQUE ("user_id", "platform_name", "platform_business_id");

-- Add foreign key constraint
ALTER TABLE ONLY "public"."platform_search_results"
    ADD CONSTRAINT "platform_search_results_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

-- Add indexes for performance
CREATE INDEX "platform_search_results_user_id_idx" ON "public"."platform_search_results" USING "btree" ("user_id");
CREATE INDEX "platform_search_results_platform_name_idx" ON "public"."platform_search_results" USING "btree" ("platform_name");
CREATE INDEX "platform_search_results_search_query_idx" ON "public"."platform_search_results" USING "btree" ("search_query");
CREATE INDEX "platform_search_results_created_at_idx" ON "public"."platform_search_results" USING "btree" ("created_at");

-- Add updated_at trigger
CREATE OR REPLACE TRIGGER "update_platform_search_results_updated_at"
    BEFORE UPDATE ON "public"."platform_search_results"
    FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();

-- Set table owner
ALTER TABLE "public"."platform_search_results" OWNER TO "postgres";

-- Enable Row Level Security
ALTER TABLE "public"."platform_search_results" ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their own platform search results"
    ON "public"."platform_search_results"
    TO "authenticated"
    USING ("auth"."uid"() = "user_id");

CREATE POLICY "Service role can manage platform search results"
    ON "public"."platform_search_results"
    TO "service_role"
    USING (true);

-- Grant permissions
GRANT ALL ON TABLE "public"."platform_search_results" TO "anon";
GRANT ALL ON TABLE "public"."platform_search_results" TO "authenticated";
GRANT ALL ON TABLE "public"."platform_search_results" TO "service_role";

-- Add comment
COMMENT ON TABLE "public"."platform_search_results" IS 'Stores business search results from various platforms (Google, Yelp, Facebook, etc.)';

ALTER TABLE public.platform_registry DROP COLUMN auth_endpoint;
ALTER TABLE public.platform_registry DROP COLUMN sync_endpoint;
ALTER TABLE public.platform_registry DROP COLUMN config_schema;
ALTER TABLE public.platform_registry DROP COLUMN required_scopes;
ALTER TABLE public.platform_registry ADD access_token varchar(255);
