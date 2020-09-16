Kolorob Sub System
-----------------

Easy Installation
-----------------
**Requirements**
- [docker](https://www.docker.com/get-started)

**Steps**
- Clone this repository: `$ git clone https://github.com/alvibd/kolorob_subsystem.git`
- cd to project directory: `$ cd kolorob_subsystem`
- checkout to dev branch: `$ git checkout -b dev`
- pull latest dev: `$ git pull origin dev`
- create _.env_: `$ cp .env.example .env`
- set database configurations in _.env_ found in _docker-compose.yml_
- run `$ docker-compose up -d`
- enter the database command line `$ docker-compose exec db bash`
- enter postgres command line `$ psql -U app_user -W` and enter the password _9l+-Upr@br4_
- create database `$ CREATE DATABASE kolorob;`
- grant privileges `$ GRANT ALL PRIVILEGES ON DATABASE kolorob TO app_user;`
- exit from postgres command line `$ exit;`
- exit from db container `$ exit`
- enter application command line interface `$ docker-compose exec app bash`
- install all the requirements: `$ composer install`
- generate key: `$ php artisan key:generate`
- create all the tables: `$ php artisan migrate`
- run database seed: `$ php artisan db:seed`
- run database: `$ php artisan jwt:secret`
- create local storage : `$ php artisan storage:link`
- exit from application command line interface `$ exit`
- close image `$ docker-compose down --remove-orphans`
