window.onload = function () {

    var limit = 24000;
    var y = 190;    
    var data = [];
    var dataSeries = { type: "line" };
    var dataPoints = [];
    
    for (var i = 1; i <= limit; i += 5) {
        y += Math.round(Math.random()*10 - 5);
        dataPoints.push({
            x: i,
            y: y
        });
    }
    dataSeries.dataPoints = dataPoints;
    data.push(dataSeries);
    
    //Better to construct options first and then pass it as a parameter
    var options = {
        zoomEnabled: true,
        animationEnabled: true,
        title: {
            text: "PPM En el Aire"
        },
        axisY: {
            includeZero: false,
            lineThickness: 1
        },
        data: data  // random data
    };
    
    var chart = new CanvasJS.Chart("chartContainer", options);
    var startTime = new Date();
    chart.render();
    var endTime = new Date();
    document.getElementById("timeToRender").innerHTML = "Tiempo de Carga: " + (endTime - startTime) + "ms";
    
   }

  
   /*var d = new Date();
   document.write('Fecha: '+d.getDate(),'<br>Dia de la semana: '+d.getDay(),
   '<br>Mes: '+d.getMonth(),'<br>Año: '+d.getFullYear(),'<br>Hora: '+d.getHours(),
   '<br>Minutos: '+d.getMinutes(),'<br>Segundos: '+d.getSeconds());
   */

   