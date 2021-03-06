<div align="center" class="row">
  <img src="https://i.imgur.com/94ryGD9.png" width="200"/>
</div>
<h3 align="center">Discover Your Network</h3>
<br>

## Problem Statement

In an increasingly mobile world, asset monitoring is an important activity. In cases such as asset loss or even otherwise, appropriate asset monitoring is crucial in ensuring information security at all times. As part of this challenge, teams are expected to build a tool that will be able to monitor assets and be able to tell users all key information pertaining to the same.

## Installation

Use the package manager [npm](https://nodejs.org/en/download/) to install dependencies listed in `package.json` and [pip]() to install dependencies for server-python listed in `server-python\requirements.txt`.

### Download Repository
```bash
git clone https://github.com/kaushikkumarbora/Netherite.git
```
### Install Dependencies
#### Client (Frontend)
```bash
cd .\Netherite\client
npm i
```
#### Server (Backend - Node.js)
```bash
cd .\Netherite\server-js
npm i
```
#### Server (Backend - Python) - Optional
```bash
cd .\Netherite\server-python
pip install requirements.txt
```
#### Install PostgreSQL
[Download](https://www.postgresql.org/download/)

## Usage

### First Time
For the first time we need to build out React.js application in `.\client` folder, setup the database schema in PostgreSQL. Make sure PostgreSQL is running and you can login to the database via PgAdmin.

> Build React.js Application.
```bash
cd .\client\
npm run build
```

>Fill in details about the database in `server-js\database\config.js`.
> 1. Fill in the hostname in `HOST`.
> 2. `USER`
> 3. `PORT`
> 4. `PASSWORD`

> Rest of the fields can be left as is.
```javascript
module.exports = {
    HOST: "localhost",
    USER: "postgres",
    PORT: 5432,
    PASSWORD: "kaushik",
    DB: "Asset_Monitoring",
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};
```
> Set the Force argument of `sequelize.sync()` method in `server-js\server.js`
```javascript
//Create Express object and connect to database
const app = express();
database.sequelize.sync(force = true);
```
> Run the node.js server once and close it (`Ctrl + C`) once it loads.
```bash
cd ..\server-js\
npm start
```
> Remove the force argument.
```javascript
//Create Express object and connect to database
const app = express();
database.sequelize.sync();
```
### Subsequent Use
After you have done the first time setup, you can run the application directly from `.\server-js` folder and visit `http:\\localhost:4000\` to use the application.
```bash
cd .\server-js
npm start
```

## Video
### Ping Sweep
https://user-images.githubusercontent.com/16841301/127455078-9eb855ca-dd1f-4ea0-9b62-999dd53a78be.mp4

### DC Query
https://user-images.githubusercontent.com/16841301/127546195-9a937f1b-d0b6-4e88-aa93-e3ddeeb5fecf.mp4

## Screenshots
![Frontend](https://user-images.githubusercontent.com/16841301/127456189-fd372cc7-0ab5-4204-b601-7f360fec59fd.png)

## Authors

##### [Kaushik Kumar Bora](https://github.com/kaushikkumarbora)
##### [Rabijit Singh](https://github.com/rabijitsingh)
##### [Subhasish Goswami](https://github.com/subhasishgoswami)


## Credits
> Discord-
> 1. *radwolfsdragon#5966* - Helped understand the problem statement and a life-saver.


## License
[MIT](https://choosealicense.com/licenses/mit/)
