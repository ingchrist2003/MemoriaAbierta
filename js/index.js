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
					var db = window.openDatabase("masacres","1.0","Masacres App",1000000);
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
					for(i = 0; i < num ; i++)
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
							
						if(document.getElementById("activaradio1").checked==true && document.getElementById('departamento').value=="" )
						{
							if(distance < radiokm)
							{
								
								//si cumple con la distancia agregamos un marcador al mapa
								//1. Agregando el marcador al mapa
								stringvar = '<table width="100%" border="0" cellspacing="2" cellpadding="2">'+
								'<tr>'+
								'<td valign="top" >'+
								'<b><a href="#" onclick="callItem('+j+')">'+nombremasacre+'</a></b>'+
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
								stringvar2 += '<li  ><table width="100%" border="0" cellspacing="2" cellpadding="2">'+
								'<tr>'+
								'<td valign="top">'+
								'<img  src="images/icono.png"/>'+
								'</td>'+
								'<td valign="top">'+
								'<div id="abstract_'+idmasacre+'" style="display:block" class="abstracts" onclick="ampliar('+idmasacre+')">'+
								'<b><a name="masacre_'+idmasacre+'" href="#detail" data-transition="none" >'+nombremasacre+'</a></b><br />'+abstractual+
								'</div>'+
								'<div id="content_'+idmasacre+'" style="display:none" class="contenidos" >'+
								'<b><a name="masacre_'+idmasacre+'">'+nombremasacre+'</a></b>'+
								'<br /><b>Departamento:</b> '+depaactual+
								'<br /><b>Municipio:</b> '+muniactual+
								'<br /><b>Número Víctimas:</b> '+numvictimas+
								'<br /><b>Grupo Armado:</b> '+grupoarmado+
								'<br />'+descactual+
								'</div>'+
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
								stringvar = '<table width="100%" border="0" cellspacing="2" cellpadding="2">'+
								'<tr>'+
								'<td valign="top" >'+
								'<b><a href="#" onclick="callItem('+j+')">'+nombremasacre+'</a></b>'+
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
								stringvar2 += '<li  ><table width="100%" border="0" cellspacing="2" cellpadding="2">'+
								'<tr>'+
								'<td valign="top">'+
								'<img  src="images/icono.png"/>'+
								'</td>'+
								'<td valign="top">'+
								'<div id="abstract_'+idmasacre+'" style="display:block" class="abstracts" onclick="ampliar('+idmasacre+')">'+
								'<b><a name="masacre_'+idmasacre+'" href="#detail" >'+nombremasacre+'</a></b><br />'+abstractual+
								'</div>'+
								'<div id="content_'+idmasacre+'" style="display:none" class="contenidos" >'+
								'<b><a name="masacre_'+idmasacre+'">'+nombremasacre+'</a></b>'+
								'<br /><b>Departamento:</b> '+depaactual+
								'<br /><b>Municipio:</b> '+muniactual+
								'<br /><b>Número Víctimas:</b> '+numvictimas+
								'<br /><b>Grupo Armado:</b> '+grupoarmado+
								'<br />'+descactual+
								'</div>'+
								'</td>'+
								'</tr>'+
								'</table></li>';
								j++;
								marker = null;
								stringvar = null;
								
							
						}
						
					}
					document.getElementById("thelist").innerHTML=stringvar2;
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
					var cadenaNoticia=document.getElementById("content_"+idmasacre).innerHTML;
					
					$("#detallemasacre").html(cadenaNoticia);
					
					//myScroll2 = new iScroll('wrapper2',{ hScrollbar: false,hScroll: false });//detalle masacre
					setTimeout(function () { myScroll2.refresh(); myScroll2.scrollTo(0, 0);}, 800);
	
					
					
				}
                function initialize() {
					//obtengo la posicion actual del gps
					var arrayposition = navigator.geolocation.getCurrentPosition(lecturaGPS,errorGPS,{
						enableHighAccuracy: true
					});//
					
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
                  header_height  = $('[data-role="header"]').height();
                  footer_height  = $('[data-role="footer"]').height();
                  window_height  = ($(this).height())-header_height-footer_height-30;
                  $('[data-role="content"]').css('height', window_height);
				  //ajusta tamaño layer google maps
				  $('#map_canvas').height(window_height);
				  $('#map_canvas').width($('[data-role="header"]').width());
				  $('#map_canvas').css({ top: (header_height+20)+"px" });
				  
				  pantallaheight = $(this).height();
				  heightvar = ( pantallaheight * 0.4);
				  topvar = pantallaheight - heightvar - 10;
				  $('#wrapper').css({ top: topvar+"px" });
				  $('#wrapper').height(heightvar);
				  $('#currenttitle').css({ top: (topvar-40)+"px" });
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
				  
				  $( "#pullDown" ).click(function() {
					  if(listadoshow == true)
					  {
						  $( "#wrapper" ).animate({
							opacity: 0.8,
							marginBottom: "0.6in",
							borderWidth: "10px",
							top: "+="+(heightvar-120)+"px"
						  }, 100 ); 
						  listadoshow = false;
					  }else{
						  $( "#wrapper" ).animate({
							opacity: 0.8,
							marginBottom: "0.6in",
							borderWidth: "10px",
							top: "-="+(heightvar-120)+"px"
						  }, 100 );
						  listadoshow = true;
					  }
					 
				  });
                });
				
				
				