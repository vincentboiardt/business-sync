-- Rename column from platform_id to platform_name
ALTER TABLE platform_connections
RENAME COLUMN platform_id TO platform_name;

-- Add foreign key constraint
ALTER TABLE platform_connections
ADD CONSTRAINT fk_platform_name
FOREIGN KEY (platform_name)
REFERENCES platform_registry(platform_name);

INSERT INTO platform_registry (platform_name, display_name)
VALUES
    ('google', 'Google'),
    ('facebook', 'Facebook'),
    ('yelp', 'Yelp'),
    ('tripadvisor', 'Tripadvisor'),
    ('apple_maps', 'Apple Maps'),
    ('bing', 'Bing');
