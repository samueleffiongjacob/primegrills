# PRIGRILL MICROSERVICE App Setup

this application is wrritten on ubuntu Ubuntu 20.04.6 LTS  do well to confirm your os version to avoid compactabilty issues

```bash
# below are commands to do so , use any one of choice:
$ cat /etc/issue
$ hostnamectl
$ cat /etc/os-release
$ lsb_release -a
```

## To install PostgreSQL on Ubuntu, follow these steps

```bash
# see below
$ sudo apt update
$ sudo apt install postgresql postgresql-contrib
$ psql --version
$ sudo systemctl start postgresql
$ sudo vi /etc/postgresql/<version>/main/postgresql.conf # allow remote access by adding this line : listen_addresses = '*'
$ sudo vi /etc/postgresql/<version>/main/pg_hba.conf # still on remote access: host    all             all             0.0.0.0/0            md5
$ sudo systemctl restart postgresql
$ ping 172.23.64.164
```

## CREATE LOCAL DB

```bash
# create db
$ sudo -i -u postgres
$ psql # us should see postgres=#
$ CREATE USER prime_grills WITH PASSWORD 'prime';
$ CREATE DATABASE primegrillsauth; # for Auth
$ CREATE DATABASE primegrillsaccount
$ CREATE DATABASE primegrillsmanager
$ CREATE DATABASE primegrillsevents
$ GRANT ALL PRIVILEGES ON DATABASE primegrillsauth TO prime_grills; # do for db created
```

## connect to table plus or any tool

```bash
# Find Internal (Local) IP Address
$ hostname -I
$ user:  prime_grills 
$ pasword: prime
```

cd Backend/auth_service
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip freeze > requirements.txt # only whenu are done for the days developmet sothat others can use it.
pip install -r requirements.txt # git pull before running to have access to all dependency
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 8000
deactivate  # Exit the virtual environment

cd  Backend/MANAGER
python -m venv venv
source venv/bin/activate
pip freeze > requirements.txt # only whenu are done for the days developmet sothat others can use it.
pip install -r requirements.txt # git pull before running to have access to all dependency
python manage.py makemigrations
python manage.py migrate
python manage.py runserver 8001
deactivate

cd Backend/ACCOUNTANT
python -m venv venv
source venv/bin/activate
pip freeze > requirements.txt # only whenu are done for the days developmet sothat others can use it.
pip install -r requirements.txt # git pull before running to have access to all dependency
python manage.py makemigrations
python manage.py migrate
python manage.py runserver 8002
deactivate

 
cd Backend/EVENTS
python -m venv venv
source venv/bin/activate
pip freeze > requirements.txt # only when u are done for the days developmet sothat others can use it.
pip install -r requirements.txt # git pull before running to have access to all dependency
cd Backend/EVENTS/event_service
python manage.py makemigrations
python manage.py migrate
python manage.py consume_auth_events
deactivate