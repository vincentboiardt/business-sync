-- Migration: Drop profiles table and restructure platform_connections
-- Created: 2025-08-19
-- Purpose: Simplify schema by removing profiles table and restructuring platform_connections

-- Drop existing policies and triggers for profiles table
DROP POLICY IF EXISTS "Users can view their own profile" ON "public"."profiles";
DROP POLICY IF EXISTS "Users can update their own profile" ON "public"."profiles";
DROP POLICY IF EXISTS "Users can insert their own profile" ON "public"."profiles";

-- Drop trigger for profiles
DROP TRIGGER IF EXISTS "update_profiles_updated_at" ON "public"."profiles";

-- Drop the profiles table
DROP TABLE IF EXISTS "public"."profiles";

-- Drop existing policies for platform_connections table
DROP POLICY IF EXISTS "Users can manage their own platform connections" ON "public"."platform_connections";
DROP POLICY IF EXISTS "Service role can manage platform connections" ON "public"."platform_connections";

-- Store existing data temporarily if needed
CREATE TEMP TABLE temp_platform_connections AS
SELECT id, user_id, platform_id
FROM "public"."platform_connections"
WHERE platform_id IS NOT NULL;

-- Drop and recreate platform_connections table with new structure
DROP TABLE IF EXISTS "public"."platform_connections";

CREATE TABLE "public"."platform_connections" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "platform_id" "text" NOT NULL,
    "is_claimed" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

-- Add primary key
ALTER TABLE ONLY "public"."platform_connections"
    ADD CONSTRAINT "platform_connections_pkey" PRIMARY KEY ("id");

-- Add unique constraint to prevent duplicate user-platform combinations
ALTER TABLE ONLY "public"."platform_connections"
    ADD CONSTRAINT "platform_connections_user_platform_unique" UNIQUE ("user_id", "platform_id");

-- Add foreign key constraint
ALTER TABLE ONLY "public"."platform_connections"
    ADD CONSTRAINT "platform_connections_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

-- Add indexes for performance
CREATE INDEX "platform_connections_user_id_idx" ON "public"."platform_connections" USING "btree" ("user_id");
CREATE INDEX "platform_connections_platform_id_idx" ON "public"."platform_connections" USING "btree" ("platform_id");
CREATE INDEX "platform_connections_is_claimed_idx" ON "public"."platform_connections" USING "btree" ("is_claimed");

-- Add updated_at trigger
CREATE OR REPLACE TRIGGER "update_platform_connections_updated_at"
    BEFORE UPDATE ON "public"."platform_connections"
    FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();

-- Set table owner
ALTER TABLE "public"."platform_connections" OWNER TO "postgres";

-- Enable Row Level Security
ALTER TABLE "public"."platform_connections" ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their own platform connections"
    ON "public"."platform_connections"
    TO "authenticated"
    USING ("auth"."uid"() = "user_id");

CREATE POLICY "Service role can manage platform connections"
    ON "public"."platform_connections"
    TO "service_role"
    USING (true);

-- Grant permissions
GRANT ALL ON TABLE "public"."platform_connections" TO "anon";
GRANT ALL ON TABLE "public"."platform_connections" TO "authenticated";
GRANT ALL ON TABLE "public"."platform_connections" TO "service_role";

-- Restore existing data with default is_claimed = false
INSERT INTO "public"."platform_connections" (id, user_id, platform_id, is_claimed)
SELECT id, user_id, platform_id, false
FROM temp_platform_connections
ON CONFLICT (user_id, platform_id) DO NOTHING;

-- Clean up temporary table
DROP TABLE temp_platform_connections;

-- Add comment
COMMENT ON TABLE "public"."platform_connections" IS 'Stores user platform connections and claim status';
