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
var masacrearray;
var nidsarray;
var descripcionShare;
var urlShare;
var imageShare;
//

function abrirBaseDatos()
{
	var db;
	db = window.openDatabase("masacres","1.0","Masacres App",10000000);
	db.transaction(crearRegistros,errorDB,leerBaseDatos);	
	db = null;
}

function crearRegistros(tx)
{
	tx.executeSql('DROP TABLE IF EXISTS MASACRES');
	tx.executeSql('CREATE TABLE IF NOT EXISTS MASACRES (id INTEGER PRIMARY KEY AUTOINCREMENT,nid INTEGER NULL, nombre TEXT  NULL, ubicacion TEXT  NULL,descripcion TEXT  NULL,departamento TEXT  NULL,municipio TEXT  NULL,grupoarmado TEXT  NULL,numvictimas TEXT  NULL,palabras_clave  TEXT  NULL,imagen TEXT  NULL,fechainicio TEXT NULL,fecha_creacion DATETIME NULL,fecha_actualizacion DATETIME NULL)')	;
	tx = null;
	
}
/*Noticias*/
function leerBaseDatos()
{
	var db = window.openDatabase("masacres","1.0","Masacres App",10000000);
	db.transaction(leerBD,errorDB);
	db = null;
}

function leerBD(tx)
{
	
	if(searchvalue=="" && searchdepto=="")
		tx.executeSql('SELECT * FROM MASACRES ORDER BY id DESC',[],mostrarResultados,errorDB);
	else if(searchvalue!="" && searchdepto=="")
		tx.executeSql('SELECT * FROM MASACRES WHERE nombre LIKE ? or descripcion like ? or palabras_clave like ? ORDER BY id DESC',["%"+searchvalue+"%","%"+searchvalue+"%","%"+searchvalue+"%"],mostrarResultados,errorDB);
	else if(searchvalue=="" && searchdepto!="")
		tx.executeSql('SELECT * FROM MASACRES WHERE departamento LIKE ?  ORDER BY id DESC',["%"+searchdepto+"%"],mostrarResultados,errorDB);
	else if(searchvalue!="" && searchdepto!="")
		tx.executeSql('SELECT * FROM MASACRES WHERE (nombre LIKE ? or descripcion like ? or palabras_clave like ?) and departamento like ? ORDER BY id DESC',["%"+searchvalue+"%","%"+searchvalue+"%","%"+searchdepto+"%","%"+searchdepto+"%"],mostrarResultados,errorDB);
		
	tx = null;
}	


function mostrarResultados(tx,resultados)
{
	var lista = "";
	//var contenedor = document.getElementById('scroller');
	//var ancho = contenedor.offsetWidth;
	
	masacresarray = null;
	masacresarray = new Array() ;
	//
	if(resultados.rows.length==0)
	{
		alert("No hay registros de masacres");
	}else{
		
		for(i=0;i<resultados.rows.length;i++)
		{
			
			//alert("item"+resultados.rows.item(i).nid)
			var masacre = new Array();
            var idmasacre = resultados.rows.item(i).nid;
            var nombre = resultados.rows.item(i).nombre;
            var ubicacion = resultados.rows.item(i).ubicacion;
            var descripcion = resultados.rows.item(i).descripcion;
			var imagen = resultados.rows.item(i).imagen;
			var departamento = resultados.rows.item(i).departamento;
			var municipio = resultados.rows.item(i).municipio;
			var grupoarmado = resultados.rows.item(i).grupoarmado;
			var numvictimas = resultados.rows.item(i).numvictimas;
            masacre[0] = idmasacre;
            masacre[1] = nombre;
            masacre[2] = ubicacion;
            masacre[3] = descripcion;
			masacre[4] = imagen;
			masacre[5] = departamento;
			masacre[6] = municipio;
			masacre[7] = grupoarmado;
			masacre[8] = numvictimas;
            masacresarray.push(masacre);
			
			masacre = null;
		}
	}
	//alert("numArray:"+masacresarray.length);
	//document.getElementById("thelist").innerHTML=lista;
	creacionPuntosMasacres();
	//document.getElementById("lista1").innerHTML=lista;
	//pullDownAction();
	//myScroll.refresh();
}

var masacreshow = "";
function updateImage(idmasacre)
{
	masacreshow = idmasacre;
	var db = window.openDatabase("masacres","1.0","Masacres App",10000000);
	db.transaction(buscaImagen,errorDB);
	db = null;
}

function buscaImagen(tx)
{
		tx.executeSql('SELECT * FROM MASACRES WHERE nid = ? ',[masacreshow],cargaImagen,errorDB);	
		tx = null;
}	


function cargaImagen(tx,resultados)
{
	var cadena = "";
	//
	if(resultados.rows.length==0)
	{
		//alert("No hay registros de masacres");
	}else{
		var idmasacre = resultados.rows.item(0).nid;
        var nombre = resultados.rows.item(0).nombre;
        var descripcion = resultados.rows.item(0).descripcion;
		var imagen = resultados.rows.item(0).imagen;
		var departamento = resultados.rows.item(0).departamento;
		var municipio = resultados.rows.item(0).municipio;
		var grupoarmado = resultados.rows.item(0).grupoarmado;
		var numvictimas = resultados.rows.item(0).numvictimas;
		cadenaNoticia='<div id="content_'+idmasacre+'" >'+
								'<h2 class="link">'+nombre+'</h2>'+
								'<center><img src="'+imagen+'" width="80%" style="max-width:80%;margin:10px" ></center>'+
								'<br /><b>Departamento:</b> '+departamento+
								'<br /><b>Municipio:</b> '+municipio+
								'<br /><b>Número Víctimas:</b> '+numvictimas+
								'<br /><b>Grupo Armado:</b> '+grupoarmado+
								'<br />'+descripcion+
								'</div>';
		descripcionShare = "Rutas del Conflicto - Fundación Ideas para la Paz \nhttp://rutasdelconflicto.com  \nMasacre: "+nombre+"\n"+departamento+"\n"+municipio;
		urlShare="http://www.rutasdelconflicto.com";
		imageShare="Icon-40.png";
		
	}
}
function generarDepartamentos()
{
	var db = window.openDatabase("masacres","1.0","Masacres App",10000000);
	db.transaction(generaDeptoDB,errorDB);
	db = null;
}

function generaDeptoDB(tx)
{
		tx.executeSql('SELECT DISTINCT departamento FROM MASACRES ORDER BY departamento ASC',[],mostrarDepartamentos,errorDB);	
		tx = null;
}	


function mostrarDepartamentos(tx,resultados)
{
	var cadena = "";
	//
	if(resultados.rows.length==0)
	{
		//alert("No hay registros de masacres");
	}else{
		cadena = '<option value="">Todos</option>';
		for(i=0;i<resultados.rows.length;i++)
		{
			var deptoactual = resultados.rows.item(i).departamento;
			if(deptoactual!="")
			{
				if(searchdepto==deptoactual)
					cadena += '<option value="'+deptoactual+'" selected>'+deptoactual+'</option>';
				else
					cadena += '<option value="'+deptoactual+'">'+deptoactual+'</option>';
			}
		}
		document.getElementById("departamento").innerHTML=cadena;
	}
}



function borrarRepetidas(tx)
{
	
	tx.executeSql('DELETE FROM MASACRES WHERE nid in ('+listado+') ')
	tx = null;
}
function agregarMasacres()
{
	var db = window.openDatabase("masacres","1.0","Masacres App",10000000);
	db.transaction(agregarMasacresSQL,errorDB,leerBaseDatos);
	db=null;
}
function agregarMasacresSQL(tx)
{
	var nume = masacrearray.length;
	var elemactual = new Array();
	for(i = 0; i < nume ; i++)
	{
		
		var elemactual = masacrearray[i];
		var cadtexto = elemactual[2];
		var nidact = elemactual[0];
		var nombreact = elemactual[1];
		var descripcionact =  cadtexto;
		var imagenact = elemactual[3];
		var fechainicioact = elemactual[4];
		var ubicacionact = elemactual[5];
		var fechacre = elemactual[6];
		var fechaact = elemactual[7];
		var departamento = elemactual[8];
		var municipio = elemactual[9];
		var grupoarmado = elemactual[10];
		var numvictimas = elemactual[11];
		var palabrasclave = elemactual[12];
		
		tx.executeSql('INSERT INTO MASACRES (nombre,nid,descripcion,ubicacion,imagen,fechainicio,fecha_creacion,fecha_actualizacion,departamento,municipio,grupoarmado,numvictimas,palabras_clave)  VALUES ("'+nombreact+'","'+nidact+'","'+descripcionact+'","'+ubicacionact+'","'+imagenact+'","'+fechainicioact+'","'+fechacre+'","'+fechaact+'","'+departamento+'","'+municipio+'","'+grupoarmado+'","'+numvictimas+'","'+palabrasclave+'")');
		
		
	
	}
	nume = null;
	elemactual = null;
	tx = null;
}

function actualizarMasacres()
{
	var db = window.openDatabase("masacres","1.0","Masacres App",10000000);
	db.transaction(actualizarMasacreBD,errorDB,cargaXMLMasacres);
	db = null;
}
function actualizarMasacreBD(tx)
{
	tx.executeSql('SELECT * FROM MASACRES ORDER BY fecha_actualizacion DESC LIMIT 0,1',[],resultLastUpdate,errorDB)
	tx = null;
}	
function resultLastUpdate(tx,resultados)
{
	if(resultados.rows.length>0)
	fechaupd = resultados.rows.item(0).fecha_actualizacion;
	
}
function cargaXMLMasacres() {
	masacrearray = null;
	nidsarray = null;
	masacrearray = new Array() ;
	nidsarray = new Array() ;
	$.ajax({
    	type: "GET",
        url: "http://rutasdelconflicto.com/masacres.php?fechaupd="+fechaupd,
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
				var grupoarmado = $(this).find('grupoarmado').text();
				var numvictimas = $(this).find('numero_victimas').text();
				var fechainicio = $(this).find('fechainicio').text();
				var fechacre = $(this).find('fecha_creacion').text();
				var fechaupd = $(this).find('fecha_actualizacion').text();
				var palabrasclave = $(this).find('palabras_clave').text();
				
				masacre[0] = nid;
                masacre[1] = nombre;
                masacre[2] = descripcion;
                masacre[3] = imagen;
				masacre[4] = fechainicio;
				masacre[5] = ubicacion;
				masacre[6] = fechacre;
				masacre[7] = fechaupd;
				masacre[8] = departamento;
				masacre[9] = municipio;
				masacre[10] = grupoarmado;
				masacre[11] = numvictimas;
				masacre[12] = palabrasclave;
				
				
                
				masacrearray.push(masacre);
				nidsarray.push(nid);
				masacre = null;
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
	
	var db = window.openDatabase("masacres","1.0","Masacres App",10000000);
	db.transaction(borrarRepetidas,errorDB,agregarMasacres);	
	db = null;
}

// Transaction error callback
function errorDB(err) {
	alert("Error Code:"+err.code+"  - Error Message"+err.message)
	console.log("Error processing SQL: "+err.code);
}