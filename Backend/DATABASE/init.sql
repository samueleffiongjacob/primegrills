-- use this when user already exist
-- CREATE DATABASE primegrillsauth_db IF NOT EXISTS;
-- CREATE DATABASE primegrillsmanager_db IF NOT EXISTS;
-- CREATE DATABASE primegrillsaccount_db IF NOT EXISTS;
-- CREATE DATABASE primegrillsevents_db IF NOT EXISTS;
-- CREATE DATABASE primegrillsquery_db IF NOT EXISTS;

-- Create user only if it does not exist
DO
$$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'primegrills') THEN
        CREATE USER primegrills WITH PASSWORD 'primegrills';
    END IF;
END
$$;

-- Create `primegrillsauth_db` only if it does not exist
SELECT 'CREATE DATABASE primegrillsauth_db OWNER primegrills'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'primegrillsauth_db')\gexec

-- Create `primegrillsmanager_db` only if it does not exist (FIXED)
SELECT 'CREATE DATABASE primegrillsorder_db OWNER primegrills'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'primegrillsorder_db')\gexec

-- Create `primegrillsevents_db` only if it does not exist
SELECT 'CREATE DATABASE primegrillsevents_db OWNER primegrills'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'primegrillsevents_db')\gexec

-- Create `primegrillsquery_db` only if it does not exist
SELECT 'CREATE DATABASE primegrillsquery_db OWNER primegrills'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'primegrillsquery_db')\gexec

-- Create `primegrillsquery_db` only if it does not exist
SELECT 'CREATE DATABASE primegrillsquery_db OWNER primegrills'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'primegrillsproduct_db')\gexec

-- Grant privileges on `primegrillsauth_db` to `primegrills`
GRANT ALL PRIVILEGES ON DATABASE primegrillsauth_db TO primegrills;

GRANT ALL PRIVILEGES ON DATABASE primegrillsorder_db TO primegrills;

-- Grant privileges on `primegrillsevents_db` to `primegrills`
GRANT ALL PRIVILEGES ON DATABASE primegrillsevents_db TO primegrills;

-- Grant privileges on `primegrillsquery_db` to `primegrills`
GRANT ALL PRIVILEGES ON DATABASE primegrillsquery_db TO primegrills;

-- Grant privileges on `primegrillsquery_db` to `primegrills`
GRANT ALL PRIVILEGES ON DATABASE primegrillsproduct_db TO primegrills;
