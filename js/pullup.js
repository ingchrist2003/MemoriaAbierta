// JavaScript Document


var myScroll,myScroll2,myScroll3,myScroll4,myScroll5,myScroll6,
	pullDownEl, pullDownOffset,
	pullUpEl, pullUpOffset,
	generatedCount = 0;


function pullDownAction () {
	setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
		var el, li, i;
		el = document.getElementById('thelist');

		
		myScroll.refresh();		// Remember to refresh when contents are loaded (ie: on ajax completion)
	}, 1000);	// <-- Simulate network congestion, remove setTimeout from production!
}


function loaded() {
	pullDownEl = document.getElementById('pullDown');
	pullDownOffset = pullDownEl.offsetHeight;
	
	
	myScroll = new iScroll('wrapper', {
		useTransition: true,
		topOffset: pullDownOffset,
		onRefresh: function () {
			if (pullDownEl.className.match('loading')) {
				pullDownEl.className = '';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Desliza para actualizar...';
			} 
		},
		onScrollMove: function () {
			if (this.y > 5 && !pullDownEl.className.match('flip')) {
				pullDownEl.className = 'flip';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Suelta para actualizar...';
				this.minScrollY = 0;
			} else if (this.y < 5 && pullDownEl.className.match('flip')) {
				pullDownEl.className = '';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Desliza para actualizar...';
				this.minScrollY = -pullDownOffset;
			} 
		},
		onScrollEnd: function () {
			if (pullDownEl.className.match('flip')) {
				pullDownEl.className = 'loading';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Loading...';				
				pullDownAction();	// Execute custom function (ajax call?)
				
				refrescarApp();
				//cargaXMLNoticias();
				/*
				if(idseccion==1)
					actualizarNoticias();//obtiene la ultima fecha de actualizacion
				else if(idseccion==2)
					actualizarInformacion();//obtiene la ultima fecha de actualizacion
				else if(idseccion==3)
					actualizarCronograma();//obtiene la ultima fecha de actualizacion
				else if(idseccion==4)
					actualizarPosiciones();//obtiene la ultima fecha de actualizacion
				else if(idseccion==5)
					actualizarGaleria();//obtiene la ultima fecha de actualizacion
				else
					actualizarNoticias();//obtiene la ultima fecha de actualizacion
					*/
			}
		}
	});
	
	setTimeout(function () { document.getElementById('wrapper').style.left = '0'; }, 800);
	
	//activar los demas scrollers
	myScroll2 = new iScroll('wrapper2',{ snap: true,momentum: false,hScrollbar: true,hScroll: true });
	
}






document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
document.addEventListener('DOMContentLoaded', function () { setTimeout(loaded, 200); }, false);