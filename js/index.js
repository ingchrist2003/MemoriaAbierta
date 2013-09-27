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
				var radiokm = 200; //radio de n km a la redonda de la posicion actual del usuario
				var latlng;
                var marcador;
				var longitud;
				var latitud;
				var infowindow = new google.maps.InfoWindow();
				var masacresarray = new Array() ;
				var listadoshow = true;
				var header_height="";
				var footer_height="";
				var window_height="";
				var pantallaheight="";
				var heightvar="";
				var topvar="";
				
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
				}
				function creacionMapa()
				{
					latlng = new google.maps.LatLng(latitud,longitud);
					//alert(latitud);
					//alert(longitud);
                    var mapOptions = {
                        zoom: 8,
                        center: latlng,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                    map = new google.maps.Map(document.getElementById('map_canvas'),
                                              mapOptions);
                    //creamos un nuevo marcador en el mapa
                    marcador = new google.maps.Marker({
                                                      position: latlng,
                                                      map:map
                                                      })
					makeInfoWindowEvent(map, infowindow, "Mi posión actual", marcador);
					
					
					//ahora obtenemos la info de las masacres
					markers.push(marcador);
					//
				}
				
				function creacionPuntosMasacres()
				{
					var num = masacresarray.length;
					
					alert("array desde creacion: \n"+masacresarray.join('\n'));
					var elemactual = new Array();
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
						var latiactual = posiactual[0];
						var lngactual = posiactual[1]; 
						
						alert(idmasacre);
						//ahora buscamos la distancia entre la posicion actual y la de cada masacre
						var locationlatlng = new google.maps.LatLng(latiactual,lngactual);
						//distancia en kilometros por eso se divide en mil
						distance = (google.maps.geometry.spherical.computeDistanceBetween(latlng, locationlatlng)/1000).toFixed(2);
						
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
							
							
							//2.Agregando al listado
							stringvar2 += '<li  ><table width="100%" border="0" cellspacing="2" cellpadding="2">'+
                            '<tr>'+
							'<td valign="top">'+
                            '<img  src="images/icono.png"/>'+
                            '</td>'+
                            '<td valign="top">'+
                            '<b><a name="masacre_'+idmasacre+'">'+nombremasacre+'</a></b><br />'+descactual+
                            '</td>'+
                            '</tr>'+
                            '</table></li>';
							j++;
						}
						//
					}
					alert(stringvar2);
					document.getElementById("thelist").innerHTML=stringvar2;
					pullDownAction();
					myScroll.refresh();
				}
				//
				
                function initialize() {
					//obtengo la posicion actual del gps
					navigator.geolocation.getCurrentPosition(lecturaGPS,errorGPS,{enableHighAccuracy:true});
					//
					//obtengo ahora la informacion de masacres
					//var db;
					db = window.openDatabase("masacres","1.0","Masacres App",200000);
					db.transaction(crearRegistros,errorDB,cargaXMLMasacres);
					
					leerBaseDatos();
                }
				
                function refrescarApp() {
					//obtengo la posicion actual del gps
					navigator.geolocation.getCurrentPosition(lecturaGPS,errorGPS,{enableHighAccuracy:true});
					//
					actualizarMasacres()
					leerBaseDatos();
                }
				//lectura gps
				function lecturaGPS(position)
                {
                    latitud = position.coords.latitude;
					longitud = position.coords.longitude;
					
					creacionMapa();
					
                }
                function errorGPS(error)
                {
                    alert("Gps no disponible");
                }
                
				//hasta aca lectura gps
				$(document).on("swiperight", function(event, ui) {
                	$( "#myPanel").panel("open", {display: "overlay", position: "left"} );
                });
				
				$(function () {
                  header_height  = $('[data-role="header"]').height();
                  footer_height  = $('[data-role="footer"]').height();
                  window_height  = ($(this).height())-header_height-footer_height-30;
                  $('[data-role="content"]').css('height', window_height);
				  //ajusta tamaño layer google maps
				  $('#map_canvas').height(window_height);
				  $('#map_canvas').width($('[data-role="header"]').width());
				  
				  pantallaheight = $(this).height();
				  heightvar = ( pantallaheight * 0.4);
				  topvar = pantallaheight - heightvar - 10;
				  $('#wrapper').css({ top: topvar+"px" });
				  $('#wrapper').height(heightvar);
				  $('#currenttitle').css({ top: (topvar-40)+"px" });
				  //inicializa google maps
				  initialize();
				  
				  
				  $( ".go" ).click(function() {
					  if(listadoshow == true)
					  {
						  $('#go1').css({ display: "none"});
						  $( "#wrapper" ).animate({
							opacity: 0.8,
							marginBottom: "0.6in",
							borderWidth: "10px",
							top: "+="+heightvar+"px"
						  }, 1500 ); 
						  $('#currenttitle').css({ top: "+="+heightvar+"px"});
						  listadoshow = false;
						  $('#go2').css({ display: "block"});
					  }else{
						  $('#go2').css({ display: "none"});
						  $( "#wrapper" ).animate({
							opacity: 0.8,
							marginBottom: "0.6in",
							borderWidth: "10px",
							top: "-="+heightvar+"px"
						  }, 1500 );
						  $('#currenttitle').css({ top: "-="+heightvar+"px"});
						  listadoshow = true;
						  $('#go1').css({ display: "block"});
					  }
					 
				  });
                });
				
