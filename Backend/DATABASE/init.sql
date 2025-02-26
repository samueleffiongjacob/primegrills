-- use this when user already exist
-- CREATE DATABASE primegrillsauth_db IF NOT EXISTS;
-- CREATE DATABASE primegrillsmanager_db IF NOT EXISTS;
-- CREATE DATABASE primegrillsaccount_db IF NOT EXISTS;

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
SELECT 'CREATE DATABASE primegrillsmanager_db OWNER primegrills'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'primegrillsmanager_db')\gexec

-- Create `primegrillsaccount_db` only if it does not exist
SELECT 'CREATE DATABASE primegrillsaccount_db OWNER primegrills'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'primegrillsaccount_db')\gexec

-- Grant privileges on `primegrillsauth_db` to `primegrills`
GRANT ALL PRIVILEGES ON DATABASE primegrillsauth_db TO primegrills;
GRANT ALL PRIVILEGES ON DATABASE primegrillsmanager_db TO primegrills;

-- Grant privileges on `primegrillsccount_db` to `primegrills`
GRANT ALL PRIVILEGES ON DATABASE primegrillsaccount_db TO primegrills;
