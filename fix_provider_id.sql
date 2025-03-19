-- Check which tables are missing the provider_id column
DO $$
DECLARE
  services_has_provider_id BOOLEAN;
  bookings_has_provider_id BOOLEAN;
BEGIN
  -- Check if services table has provider_id
  SELECT EXISTS (
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'services' AND column_name = 'provider_id'
  ) INTO services_has_provider_id;
  
  -- Check if bookings table has provider_id
  SELECT EXISTS (
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'provider_id'
  ) INTO bookings_has_provider_id;
  
  -- If services table is missing provider_id, add it
  IF NOT services_has_provider_id THEN
    RAISE NOTICE 'Adding provider_id column to services table';
    ALTER TABLE services ADD COLUMN provider_id UUID REFERENCES provider_profiles(id) ON DELETE CASCADE;
  ELSE
    RAISE NOTICE 'services table already has provider_id column';
  END IF;
  
  -- If bookings table is missing provider_id, add it
  IF NOT bookings_has_provider_id THEN
    RAISE NOTICE 'Adding provider_id column to bookings table';
    ALTER TABLE bookings ADD COLUMN provider_id UUID REFERENCES provider_profiles(id) ON DELETE SET NULL;
  ELSE
    RAISE NOTICE 'bookings table already has provider_id column';
  END IF;
END $$;

-- Verify the columns now exist
SELECT table_name, column_name 
FROM information_schema.columns 
WHERE table_name IN ('services', 'bookings') AND column_name = 'provider_id'; 