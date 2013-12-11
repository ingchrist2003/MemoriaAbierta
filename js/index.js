/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 				var iden = 0;
				
                
				//lectura RSS
				
				//hasta aca lectura RSS
				//google maps//
				
                var map;
				var radiokm = 50; //radio de n km a la redonda de la posicion actual del usuario
				
                var latlng;
				var longitud;
				var latitud;
				var markers = [];
				
				var masacresarray  ;
				var listadoshow = true;
				var header_height="";
				var footer_height="";
				var window_height="";
				var pantallaheight="";
				var heightvar="";
				var topvar="";
				
				var searchvalue = "";
				var searchdepto = "";
				
				function callItem(numero)
				{
					//alert("Numero "+numero);
					if(listadoshow==false)
					{
						$('#go2').css({ display: "none"});
						$( "#wrapper" ).animate({
								opacity: 0.8,
								marginBottom: "0.6in",
								borderWidth: "10px",
								top: "-="+heightvar+"px"
						}, 1500,"linear",function(){
							myScroll.scrollToElement('li:nth-child('+numero+')', 100)
						});
						$('#currenttitle').css({ top: "-="+heightvar+"px"});
						listadoshow = true;
						$('#go1').css({ display: "block"});
						
						
					}else{
						myScroll.scrollToElement('li:nth-child('+numero+')', 100)
					}
				}
				//posicionamiento en google maps
				function makeInfoWindowEvent(map, infowindow, contentString, marker)
				{
                    google.maps.event.addListener(marker, 'click', function() {
                                                  infowindow.setContent(contentString);
                                                  infowindow.open(map, marker);
                                                  });
					return 0;
				}
				
				function borrarMarcadores() {
				  for (var i = 0; i < markers.length; i++) {
					markers[i].setMap(null);
				  }
				}
				
				function creacionMapa()
				{
					
					latlng = new google.maps.LatLng(latitud,longitud);
					
					var mapOptions = {
                        zoom: 8,
                        center: latlng,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                    map = new google.maps.Map(document.getElementById('map_canvas'),
                                              mapOptions);
					 //creamos un nuevo marcador en el mapa
                    
					//mapa
					//creación de los registros de la base de datos
					var db = window.openDatabase("masacres","1.0","Masacres App",10000000);
					db.transaction(crearRegistros,errorDB,cargaXMLMasacres);
					return 0;
				}
				
				function creacionMapaActualiza()
				{
					
					
					latlng = new google.maps.LatLng(latitud,longitud);
                    //creación de los registros de la base de datos
					actualizarMasacres();
					return 0;
				}
				
				function creacionPuntosMasacres()
				{
					
					var num = masacresarray.length;
					var infowindow = new google.maps.InfoWindow();
					var elemactual = new Array();
					//mapa
					borrarMarcadores();
                   
					var marcador = new google.maps.Marker({
                                                      position: latlng,
                                                      map:map
                                                      })
					makeInfoWindowEvent(map, infowindow, "Mi posión actual", marcador);
					markers.push(marcador);
					
					var stringvar2 = "";
					var j=1;
					setcentro = false;	
					for(i = 0; (i < num ) && (j < 50); i++)
					{
						
						var elemactual = masacresarray[i];
						var posiactual=elemactual[2].split(",");
						var idmasacre = elemactual[0];
						var nombremasacre = elemactual[1];
						var descactual = elemactual[3];
						var imaactual = elemactual[4];
						var depaactual = elemactual[5];
						var abstractual = descactual.substring(0,200);
						var muniactual = elemactual[6];
						var grupoarmado = elemactual[7];
						var numvictimas = elemactual[8];
						
						var latiactual = posiactual[0];
						var lngactual = posiactual[1];
						//ahora buscamos la distancia entre la posicion actual y la de cada masacre
						
						var locationlatlng = new google.maps.LatLng(latiactual,lngactual);
						//distancia en kilometros por eso se divide en mil
						
						
							
						var distance = (google.maps.geometry.spherical.computeDistanceBetween(latlng, locationlatlng)/1000).toFixed(2);
						
						//if(i>num-5)
							//alert("puntos masacres lat:"+latiactual+" long"+lngactual);
							
						if(document.getElementById("activaradio1").checked==true && document.getElementById('departamento').value=="" && document.getElementById('search-header').value=="" )
						{
							if(setcentro == false) //defino el centro con el marcador de mi posicion actual
							{
									map.setCenter(marcador.getPosition());
									setcentro = true;	
							}
							if(distance < radiokm)
							{
								
								//si cumple con la distancia agregamos un marcador al mapa
								//1. Agregando el marcador al mapa
								stringvar = '<table border="0" cellspacing="2" cellpadding="2">'+
								'<tr>'+
								'<td valign="top" style="font-size:18px">'+
								'<b><a href="#" onclick="callItem('+j+')"  class="link" >'+nombremasacre+'</a></b>'+
								'<br><a href="#" onclick="callItem('+j+')"  class="link" >Haga clic aquí y seleccione el registro en la parte inferior para ver el detalle</a>'+
								'</td>'+
								'</tr>'+
								'</table>';
								
								var marker = new google.maps.Marker({
																	position: locationlatlng,
																	map:map,
																	icon: "images/icono.png"
																	});
								makeInfoWindowEvent(map, infowindow, stringvar, marker);
								markers.push(marker);
								
								
								
								//2.Agregando al listado
								stringvar2 += '<li ><table width="100%" border="0" cellspacing="2" cellpadding="2">'+
								'<tr>'+
								'<td valign="top">'+
								'<img  src="images/icono.png" onclick="ampliar('+idmasacre+')"/>'+
								'</td>'+
								'<td valign="top"><a name="masacre_'+idmasacre+'" href="#detail" class="link"  >'+
								'<div id="abstract_'+idmasacre+'" style="display:block" class="abstracts" onclick="ampliar('+idmasacre+')">'+
								'<b>'+nombremasacre+'</b><br /><span onclick="ampliar('+idmasacre+')">'+abstractual+'...</span>'+
								'</div></a>'+
								'</td>'+
								'</tr>'+
								'</table></li>';
								j++;
								marker = null;
								stringvar = null;
								
							}
							//
						}else{
								
								//1. Agregando el marcador al mapa
								stringvar = '<table border="0" cellspacing="2" cellpadding="2">'+
								'<tr>'+
								'<td valign="top" style="font-size:18px">'+
								'<b><a href="#" onclick="callItem('+j+')"  class="link" >'+nombremasacre+'</a></b>'+
								'<br><a href="#" onclick="callItem('+j+')"  class="link" >Haga clic aquí y seleccione el registro en la parte inferior para ver el detalle</a>'+
								'</td>'+
								'</tr>'+
								'</table>';
								
								var marker = new google.maps.Marker({
																	position: locationlatlng,
																	map:map,
																	icon: "images/icono.png"
																	});
								makeInfoWindowEvent(map, infowindow, stringvar, marker);
								markers.push(marker);
								if(setcentro == false)//defino el centro con el primer marcador de la busqueda
								{
									map.setCenter(marker.getPosition());
									setcentro = true;	
								}
								//2.Agregando al listado
								stringvar2 += '<li ><table width="100%" border="0" cellspacing="2" cellpadding="2">'+
								'<tr>'+
								'<td valign="top">'+
								'<img  src="images/icono.png" onclick="ampliar('+idmasacre+')"/>'+
								'</td>'+
								'<td valign="top"><a name="masacre_'+idmasacre+'" href="#detail" class="link"  >'+
								'<div id="abstract_'+idmasacre+'" style="display:block" class="abstracts" onclick="ampliar('+idmasacre+')">'+
								'<b>'+nombremasacre+'</b><br /><span onclick="ampliar('+idmasacre+')">'+abstractual+'...</span>'+
								'</div></a>'+
								'</td>'+
								'</tr>'+
								'</table></li>';
								j++;
								marker = null;
								stringvar = null;
								
							
						}
						
					}
					if(i==0)
						stringvar2 = "<li >No hay registros de masacres</li>";
					document.getElementById("thelist").innerHTML=stringvar2;
					var alto = $("#thelist").height();
					
					$("#scroller").height(alto+200);
					pullDownAction();
					myScroll.refresh();
					document.getElementById("pullDown").innerHTML='<span class="pullDownIcon"></span><span class="pullDownLabel">Desliza para actualizar o Pulsa aquí</span>';
					
					$("#pullDown").removeClass("loading");
					stringvar2 = null;
					
					marcador = null;
					masacrearray = null;
					nidsarray = null;
					masacresarray = null;
					distance = null;
					generarDepartamentos();
				}
				//
				function ampliar(idmasacre)
				{
					updateImage(idmasacre);
				}
                function initialize() {
					//obtengo la posicion actual del gps
					var arrayposition = navigator.geolocation.getCurrentPosition(lecturaGPS,errorGPS,{
						enableHighAccuracy: true
					});//
					
                }
				function validateEmail(email) 
				{
					var re = /\S+@\S+\.\S+/;
					return re.test(email);
				}
				function onSuccess(data, status)
				{
					data = $.trim(data);
					//alert("Su información fue enviada satisfactoriamente ");
					//$.mobile.changePage('#dialog', 'pop', true, true);
					$( "#lnkdialogo" ).trigger( "click" );
					//borrar los campos
					document.formusend.nombre.value="";
					document.formusend.email.value="";
					document.formusend.comentario.value="";
					
				}
		  
				function onError(data, status)
				{
					// handle an error
					alert("Su información no pudo ser enviada, intentelo mas adelante");
				}  
				function validaEnvia(form){
					if(form.nombre.value=="")
					{
						alert("Ingrese su nombre");
						return 0;	
					}
					if(form.email.value=="")
					{
						alert("Ingrese su correo electrónico");
						return 0;	
					}
					if(validateEmail(form.email.value) ==false){
						alert("Ingrese un correo electrónico valido");
						return 0;	
					}
					if(form.comentario.value=="")
					{
						alert("Ingrese su comentario");
						return 0;	
					}
					
					$.ajax({
						type: "POST",
						url: "http://rutasdelconflicto.com/formulario.php",
						cache: false,
						data: { nombre : form.nombre.value , email : form.email.value , comentario : form.comentario.value},
						success: onSuccess,
						error: onError
					});
				}
                function refrescarApp() {
					//obtengo la posicion actual del gps
					//alert("refrescando 1");
					navigator.geolocation.getCurrentPosition(lecturaGPSActualiza2,errorGPS,{enableHighAccuracy:true});
					//
					document.getElementById("thelist").innerHTML="<li >Espere un momento por favor</li>";
                }
				function refrescarAppSinGPS() {
					//obtengo la posicion actual del gps
					//alert("refrescando 1");
					//navigator.geolocation.getCurrentPosition(lecturaGPSActualiza,errorGPS,{enableHighAccuracy:true});
					leerBaseDatos();
					//
					document.getElementById("thelist").innerHTML="<li >Espere un momento por favor</li>";
                }
				
				//generar busqueda
				function searchUpdate(valor) {
					//obtengo la posicion actual del gps
					searchvalue=valor;
					//navigator.geolocation.getCurrentPosition(lecturaGPSActualiza,errorGPS,{enableHighAccuracy:true});
					leerBaseDatos();
					//
					document.getElementById("thelist").innerHTML="<li >Espere un momento por favor</li>";
                }
				//
				//generar busqueda por departamento
				function searchDepto(valor) {
					//obtengo la posicion actual del gps
					searchdepto=valor;
					//navigator.geolocation.getCurrentPosition(lecturaGPSActualiza,errorGPS,{enableHighAccuracy:true});
					leerBaseDatos();
					//
					document.getElementById("thelist").innerHTML="<li >Espere un momento por favor</li>";
                }
				
				//
				//lectura gps
				function lecturaGPS(position)
                {
                    latitud = position.coords.latitude;
					longitud = position.coords.longitude;
					creacionMapa();
					
                }
				function lecturaGPSActualiza2(position)
                {
					latitud = position.coords.latitude;
					longitud = position.coords.longitude;
                    creacionMapaActualiza(); 
                }
				function lecturaGPSActualiza()
                {
					
                   creacionMapaActualiza(); 
                }
                function errorGPS(error)
                {
                    alert("Gps no disponible");
                }
                
				function activaRadio()
				{
					if(document.getElementById("activaradio2").checked==true)
						$('#slider-mini').slider('disable');
					else
						$('#slider-mini').slider('enable');
					refrescarAppSinGPS();
				}	
                
				//hasta aca lectura gps
				$(document).on("swiperight", function(event, ui) {
                	$( "#myPanel").panel("open", {display: "reveal", position: "left"} );
					
					$( "#mypanel" ).trigger( "create" );
                });
				
				 
				
				

				$(function () {
					$( "#detail" ).on( "pageshow", function( event, ui ) {
					  //$("#detallemasacre").html(cadenaNoticia);
					  //alert(cadenaNoticia)
						document.getElementById('detallemasacre').innerHTML=cadenaNoticia;
						$("#wrapper2").height(window_height-100);
						myScroll2.refresh(); 
						myScroll2.scrollTo(0,0);
					});
                  header_height  = $('[data-role="header"]').height();
				  width_height  = $('[data-role="header"]').width();
                  footer_height  = $('[data-role="footer"]').height();
                  window_height  = ($(this).height())-header_height-footer_height-30;
                  $('[data-role="content"]').css('height', window_height);
				  //ajusta tamaño layer google maps
				  $('#map_canvas').height(window_height);
				  $('#map_canvas').width($('[data-role="header"]').width());
				  $('#map_canvas').css({ top: (header_height+20)+"px" });
				 
				  
				  pantallaheight = $(this).height();
				  heightvar = ( pantallaheight * 0.4)+100;
				  topvar = pantallaheight - heightvar - 10;
				  $('#wrapper').css({ top: topvar+"px" });
				  $('#wrapper').height(heightvar);
				  $('#currenttitle').css({ top: (topvar-60)+"px" });
				  //inicializa google maps
				  initialize();
				  //inicializa el call del slider de radio de distancia
				  $( "#slider-mini").on('slidestop', function( event ) {
					   radiokm = $("#slider-mini").slider().val();
					   //alert(radiokm);
					   radiokm = radiokm*1/1;
					   refrescarApp();
					   
				  });
				  //hasta aca call del slider de radio de distancia
				  
				  $("#compartir").click(function() {
					window.plugins.socialsharing.share(descripcionShare);
				  });
				  $( "#pullDown" ).click(function() {
					  if(listadoshow == true)
					  {
						  $( "#wrapper" ).animate({
							opacity: 0.8,
							marginBottom: "0.6in",
							borderWidth: "10px",
							top: "+="+(heightvar-140)+"px"
						  }, 100 ); 
						  listadoshow = false;
					  }else{
						  $( "#wrapper" ).animate({
							opacity: 0.8,
							marginBottom: "0.6in",
							borderWidth: "10px",
							top: "-="+(heightvar-140)+"px"
						  }, 100 );
						  listadoshow = true;
					  }
					 
				  });
                });

				
				window.plugins.socialsharing.available(function(isAvailable) {
  if (isAvailable) {
    
    window.plugins.socialsharing.share('My text');
   
  }else{
	alert("paila");  
  }
});