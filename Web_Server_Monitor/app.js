const express = require('express')
const app = express()
var mysql = require('mysql')
const expressIP = require('express-ip')

app.set('view engine','ejs')
app.use(express.static('public'));
// Utilizzo del middleware per ottenere l'indirizzo IP
app.use(expressIP().getIpInfoMiddleware);

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "database"
});

con.connect(function(err){
    if(err) throw err;
    console.log("Connesso al database")
})

//funzione per la pulizia dell'IP in IPv4
function cleanIPv4(ip) {
    return ip.includes(':') ? ip.split(':').pop() : ip;
}

app.get('/', function(req,res){
    const IP = cleanIPv4(req.ipInfo.ip)
    var sql =  "INSERT INTO tabella (IP, Data, Pagina) VALUES ('"+IP+"',NOW(),'Home')";
    con.query(sql,function(err,result){
        if(err) throw err;
        console.log("1 Record Inserted")
    })
    res.render('homepage')
})

app.get('/info', function(req,res){
    const IP = cleanIPv4(req.ipInfo.ip)
    var sql =  "INSERT INTO tabella (IP, Data, Pagina) VALUES ('"+IP+"',NOW(),'Info')";
    con.query(sql,function(err,result){
        if(err) throw err;
        console.log("1 Record Inserted")
    })
    res.render('info')
})

app.get('/contatti', function(req,res){
    const IP = cleanIPv4(req.ipInfo.ip)
    var sql =  "INSERT INTO tabella (IP, Data, Pagina) VALUES ('"+IP+"',NOW(),'Contatti')";
    con.query(sql,function(err,result){
        if(err) throw err;
        console.log("1 Record Inserted")
    })
    res.render('contatti')
})

app.get('/statistiche', function(req,res){
    con.query("SELECT * FROM tabella WHERE Pagina = 'Home'", function(err,homepageData){
        if(err) throw err;
        con.query("SELECT * FROM tabella WHERE Pagina = 'Info'", function(err,infoData){
            if(err) throw err;
            con.query("SELECT * FROM tabella WHERE Pagina = 'Contatti'", function(err,contattiData){
                if(err) throw err;
                //Raccolgo i dati della varie query e li passo tutti al file "statistiche.ejs"
                res.render('statistiche',{
                    homepageData: homepageData,
                    infoData: infoData,
                    contattiData: contattiData
                })
            })
        })
    })
})

app.all('*', function(req,res){
    res.render('error404')
})

process.on('SIGINT', () => {
    console.log('Ricevuto segnale di interruzione. Chiusura del server e del database...');
    // Chiusura della connessione al database
    con.end();
    // Chiusura del server
    server.close();
    // Uscita dal processo
    process.exit();
});

app.listen(3000)