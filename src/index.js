const app =  require('./app');

app.listen(app.get('port'), () =>{
    console.log("conexion exitosa", app.get("port"));
});