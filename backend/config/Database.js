import {Sequelize} from "sequelize"

const db = new Sequelize('mern-auth','root','',{
    host: 'localhost',
    dialect: 'mysql',
})

export default db;