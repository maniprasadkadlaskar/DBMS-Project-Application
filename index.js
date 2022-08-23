require('dotenv').config()
const express = require('express')
const mysql = require('mysql')

const app = express()

app.set('view engine' , 'ejs')
app.use(express.urlencoded({extended : "true"}));

const conn = mysql.createConnection({
    host : "localhost",
    user : process.env.USER_NAME,
    password : process.env.USER_PASSWORD,
    database : "college_database"
})

let errorStatus = {
    isError : false,
    msg : ''
}

conn.connect((err) => {
    if (err)
        throw err

    console.log('Connected to database')
})

app.get('/department' , (req , res) => {

    const sqlQuery = "SELECT * FROM DEPARTMENT"
    
    conn.query(sqlQuery , (err , result) => {
        if (err)
            throw err

        res.render('showdept' , {deptData : result})
    })
})

app.get('/add-department' , (req , res) => {
    res.render('adddept')
})

app.post('/add-department' , (req , res) => {

    const data = req.body
    const sqlQuery = `INSERT INTO DEPARTMENT VALUES(${data.dno} , '${data.dname}' , ${data.hod} , '${data.loc}')`

    const msg = conn.query(sqlQuery , (err) => {
        if (err) {
            handleError(err.sqlMessage)
        }
    })

    setTimeout(() => {
        if (errorStatus.isError) {
            errorStatus.isError = false
            res.send(`<h2>Error</h2> <br> <h4>${errorStatus.msg}</h4>`)
        }
        else {
            res.redirect('/department')
        }
    } , 2000)
    
})

app.get('/delete-department' , (req , res) => {
    res.render('deletedept')
})

app.post('/delete-department' , (req , res) => {
    deptId = req.body.dno

    const sqlQuery = `DELETE FROM DEPARTMENT WHERE DNO = ${deptId}`

    conn.query(sqlQuery , (err) => {
        if (err) {
            handleError(err.sqlMessage)
        }
    })

    setTimeout(() => {
        if (errorStatus.isError) {
            errorStatus.isError = false
            res.send(`<h2>Error</h2> <br> <h4>${errorStatus.msg}</h4>`)
        }
        else {
            res.redirect('/department')
        }
    } , 2000)
})

app.get('/update-department' , (req , res) => {
    res.render('updatedept')
})

app.post('/update-department' , (req , res) => {
    
    newData = req.body

    dno = Object.values(newData)[0]

    for(const key in newData) {
        let sqlQuery = ''

        if(key != 'dno' && newData[key] != '') {

            if(key != "hodid")
                sqlQuery = `UPDATE DEPARTMENT SET ${key} = '${newData[key]}' WHERE DNO = ${dno}`
            else
                sqlQuery = `UPDATE DEPARTMENT SET ${key} = ${newData[key]} WHERE DNO = ${dno}`

            conn.query(sqlQuery , (err) => {
                if (err) {
                    handleError(err.sqlMessage)
                }
            })
        }        
    }

    setTimeout(() => {
        if (errorStatus.isError) {
            errorStatus.isError = false
            res.send(`<h2>Error</h2> <br> <h4>${errorStatus.msg}</h4>`)
        }
        else {
            res.redirect('/department')
        }
    } , 2000)
})

function handleError (msg) {
    errorStatus.isError = true
    errorStatus.msg = msg
}

app.listen(8000 , () => {
    console.log('Server is started')
})