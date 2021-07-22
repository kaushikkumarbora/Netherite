# D2C Asset Monitoring

Proof of Concept for Asset Monitoring tool.

## Installation

Use the package manager [npm](https://nodejs.org/en/download/) to install dependencies listed in `package.json` and [pip]() to install dependencies for server-python listed in `server-python\requirements.txt`.

### Download Repository
```bash
git clone https://github.com/kaushikkumarbora/D2C_Asset_Mon.git
```
### Install Dependencies
#### Client (Frontend)
```bash
cd .\D2C_Asset_Mon\server-js
npm i
```
#### Server (Backend - Node.js)
```bash
cd .\D2C_Asset_Mon\server-js
npm i
```
#### Server (Backend - Python) - Optional
```bash
cd .\D2C_Asset_Mon\server-python
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

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## Credits
> Discord-
> 1. *radwolfsdragon#5966* - Helped understand the problem statement and a life-saver.


## License
[MIT](https://choosealicense.com/licenses/mit/)