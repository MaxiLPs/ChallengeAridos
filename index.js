const express = require("express");
const cors = require('cors')
var mysql = require("mysql");
const app = express();

app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: false,
  })
);

const DB_PASS = 'Ingrese contraseña de root de la DB';

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: DB_PASS,
  database: "aridos",
}); 

con.connect();


//ALTA DE USUARIO
// Solo se recibe alias y pass. Luego se agrega la fecha en formato yyyy/mm/dd hh:mm:ss

app.post("/usuarios", function (req, res, next) {
  const alias = req.body["alias"];
  const password = req.body["password"];

  if (!alias && !password){
    res.status(409).send({
      status: 409,
      messenge: "El password o Alias no puede quedar vacío",
    });
    return
  }

  const ahora = new Date();

  const ano = ahora.getFullYear().toString();
  const mes = (ahora.getMonth() + 1) > 9? (ahora.getMonth() + 1).toString() : "0" + (ahora.getMonth() + 1).toString();
  const dia = (ahora.getDate() + 1) > 9? (ahora.getDate() + 1).toString() : "0" + (ahora.getDate() + 1).toString();
  
  const hora = (ahora.getHours() + 1) > 9? (ahora.getHours() + 1).toString() : "0" + (ahora.getHours() + 1).toString();
  const minutos = (ahora.getMinutes() + 1) > 9? (ahora.getMinutes() + 1).toString() : "0" + (ahora.getMinutes() + 1).toString();
  const segundos = (ahora.getSeconds() + 1) > 9? (ahora.getSeconds() + 1).toString() : "0" + (ahora.getSeconds() + 1).toString();

  const fecha = ano + "/" + mes + "/" + dia + " " + hora + ":" + minutos + ":" + segundos;


  const sql_query= "INSERT INTO `user_base` (`alias`,`password`,`date_creation`,`state`) VALUES (?,?,?,?);";
  const valores = [alias, password, fecha, 1];
  
  let query = mysql.format(sql_query, valores);


  result= con.query("SELECT * FROM user_base")

  con.query(query, function(err, result){
    if (err){
      if(err.code == 'ER_DUP_ENTRY' || err.errno == 1062)
      {
        res.status(409).send({
          status: 409,
          messenge: "El usuario ya existe",
        });
      }
      else{
        res.status(500).send({
          status: 500,
          messenge: "Error de servidor",
        });
      }
    } else {
      res.status(201).send({
        status: 201,
        messenge: "Se agregó al usuario ID: " + result.insertId ,
      });
    }
  });
});

//BUSCA Y DEVUELVE TODOS LOS USUARIOR 
app.get("/usuarios", function (req, res) {
  const query = "SELECT idusuario as 'ID', alias as 'Usuario', password as 'Contraseña',"+
  " date_creation as 'Fecha de Creación', state as 'Estado' FROM `user_base`";

    con.query(query, function (err, result, fields) {
      if (err) throw err;
      res.status(200).send(JSON.stringify(result));
    });
});

//BUSCA Y UN USUARIO SEGÚN ALIAS

app.get("/usuarios/:alias", function (req, res) {
  const alias = req.params.alias;
  const sql_query= "SELECT * FROM `user_base` WHERE alias = ? ;";
  const valores = [alias];
  
  const query = mysql.format(sql_query, valores);

  con.query(query, function (err, result, fields) {
    if (err) throw err;
    const consulta = JSON.stringify(result[0]);

    if (consulta){
      res.status(200).send({
        usuario: JSON.parse(consulta),
      });
    }else{
      res.status(400).send({
        status: 400,
        messenge: "Alias no válido"
      });
    }
  });
});

app.get("/grupos", function (req, res) {
  const alias = req.query.alias;
  const sql_query= "SELECT alias as 'Usuario', nombre as 'Grupo de Seguridad' FROM user_security us, user_base ub, security_groups sg " + 
  "WHERE us.user_base_id = ub.idusuario AND us.security_groups_id = sg.id AND alias =?";
  const valores = [alias];

  const query = mysql.format(sql_query, valores);

  con.query(query, function (err, result, fields) {
    if (err) throw err;
    res.send(JSON.stringify(result));
  });

});


app.listen(3000, () => {
  console.log("El servidor está inicializado en el puerto 3000");
});
