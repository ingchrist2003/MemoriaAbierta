// JavaScript Document
// seccion noticias

//variables noticia
var nombre;
var idmasacre;
var ubicacion;
var descripcion;
var fechainicio;
var imagen;
var listado = "";
var fechacre = "";
var fechaupd = ""; //fecha de la última actualización 
var masacrearray = new Array() ;
var nidsarray = new Array() ;
//

function abrirBaseDatos()
{
	var db;
	db = window.openDatabase("masacres","1.0","Masacres App",200000);
	db.transaction(crearRegistros,errorDB,leerBaseDatos);	
}

function crearRegistros(tx)
{
	tx.executeSql('DROP TABLE IF EXISTS MASACRES');
	tx.executeSql('CREATE TABLE IF NOT EXISTS MASACRES (nid INTEGER PRIMARY KEY NOT NULL, nombre TEXT  NULL, ubicacion TEXT  NULL,descripcion TEXT  NULL,departamento TEXT  NULL,municipio TEXT  NULLimagen TEXT  NULL,fechainicio TEXT NULL,fecha_creacion DATETIME NULL,fecha_actualizacion DATETIME NULL)')	;
	
}
/*Noticias*/
function leerBaseDatos()
{
	var db;
	db = window.openDatabase("masacres","1.0","Masacres App",200000);
	db.transaction(leerBD,errorDB);
}

function leerBD(tx)
{
	if(searchvalue=="")
		tx.executeSql('SELECT * FROM MASACRES ORDER BY id DESC',[],mostrarResultados,errorDB);
	else
		tx.executeSql('SELECT * FROM MASACRES WHERE nombre LIKE ? or descripcion like ?  ORDER BY id DESC',["%"+searchvalue+"%","%"+searchvalue+"%"],mostrarResultados,errorDB);
}	


function mostrarResultados(tx,resultados)
{
	var lista = "";
	//var contenedor = document.getElementById('scroller');
	//var ancho = contenedor.offsetWidth;
	masacresarray.length = 0;
	//
	if(resultados.rows.length==0)
	{
		//alert("No hay registros de masacres");
	}else{
		for(i=0;i<resultados.rows.length;i++)
		{
			var abstract = resultados.rows.item(i).descripcion;
			//alert("item"+resultados.rows.item(i).nid)
			var masacre = new Array();
            var idmasacre = resultados.rows.item(i).nid;
            var nombre = resultados.rows.item(i).nombre;
            var ubicacion = resultados.rows.item(i).ubicacion;
            var descripcion = abstract.substring(0,200);
			var imagen = resultados.rows.item(i).imagen;
			var departamento = resultados.rows.item(i).departamento;
			var municipio = resultados.rows.item(i).municipio;
            masacre[0] = idmasacre;
            masacre[1] = nombre;
            masacre[2] = ubicacion;
            masacre[3] = descripcion;
			masacre[4] = imagen;
			masacre[5] = departamento;
			masacre[6] = municipio;
            masacresarray.push(masacre);
			
			
		}
	}
	creacionPuntosMasacres();
}



function borrarRepetidas(tx)
{
	
	tx.executeSql('DELETE FROM MASACRES WHERE nid in ('+listado+') ')
}
function agregarMasacres()
{
	var db;
	db = window.openDatabase("masacres","1.0","Masacres App",200000);
	db.transaction(agregarMasacresSQL,errorDB,leerBaseDatos);
}

var nidact = "";
var nombreact = "";
var descripcionact =  "";
var imagenact = "";
var fechainicioact = "";
var ubicacionact = "";
var fechacre = "";
var fechaact = "";

function agregarMasacresSQL(tx)
{
	var nume = masacrearray.length;
	var elemactual = new Array();
	for(i = 0; i < nume ; i++)
	{
		var cadtexto = elemactual[2];
		elemactual = masacrearray[i];
		nidact = elemactual[0];
		nombreact = elemactual[1];
		descripcionact =  cadtexto;
		imagenact = elemactual[3];
		fechainicioact = elemactual[4];
		ubicacionact = elemactual[5];
		fechacre = elemactual[6];
		fechaact = elemactual[7];
		
		tx.executeSql('INSERT OR REPLACE INTO MASACRES (nid,nombre,descripcion,ubicacion,imagen,fechainicio,fecha_creacion,fecha_actualizacion)  VALUES (?,?,?,?,?,?,?,?)',[nidact,nombreact,descripcionact,ubicacionact,imagenact,fechainicioact,fechacre,fechaact]);
		
	}
	
}


function actualizarMasacres()
{
	db.transaction(actualizarMasacreBD,errorDB,cargaXMLMasacres);
}
function actualizarMasacreBD(tx)
{
	tx.executeSql('SELECT * FROM MASACRES ORDER BY fecha_actualizacion DESC LIMIT 0,1',[],resultLastUpdate,errorDB)
}	
function resultLastUpdate(tx,resultados)
{
	if(resultados.rows.length>0)
	fechaupd = resultados.rows.item(0).fecha_actualizacion;
}
function cargaXMLMasacres() {
	
	masacrearray = [];
	nidsarray = [];
	$.ajax({
    	type: "GET",
        url: "http://www.thethinkercloud.com/christian/masacres/masacres.php?fechaupd="+fechaupd,
		data: 'fechaupd='+fechaupd,
        dataType: "xml",
        success: function(xml) {
			$(xml).find('masacre').each(function(){
				var masacre = new Array();
				var nid = $(this).find('idmasacre').text();
				var nombre = $(this).find('nombre').text();
				var descripcion = $(this).find('descripcion').text();
				var departamento = $(this).find('departamento').text();
				var municipio = $(this).find('municipio').text();
				var ubicacion = $(this).find('ubicacion').text();
				var imagen = $(this).find('imagen').text();
				var fechainicio = $(this).find('fechainicio').text();
				var fechacre = $(this).find('fecha_creacion').text();
				var fechaupd = $(this).find('fecha_actualizacion').text();
				
				masacre[0] = nid;
                masacre[1] = nombre;
                masacre[2] = descripcion;
                masacre[3] = imagen;
				masacre[4] = fechainicio;
				masacre[5] = ubicacion;
				masacre[6] = fechacre;
				masacre[7] = fechaupd;
				
				
                
				masacrearray.push(masacre);
				nidsarray.push(nid);
			});
			
			creacionMasacres();
			
        },
		error: function(xhr, error){
			leerBaseDatos();
		}
	});
}

function creacionMasacres()
{
	listado = nidsarray.join(",");
	db = window.openDatabase("masacres","1.0","Masacres App",200000);
	db.transaction(borrarRepetidas,errorDB,agregarMasacres);	
}

// Transaction error callback
function errorDB(err) {
	alert("Error Code:"+err.code+"  - Error Message"+err.message)
	console.log("Error processing SQL: "+err.code);
}