//verificamos que la pantalla alla cargado
window.onload = function() {
    //creamos una funcion para hoter la hora completa
    function printTime() 
    {
        //creamos un objeto tipo date
        var d = new Date();
        //obtenemos la hora invocando el metodo getHours
        var hours = d.getHours();
        //obtenemos los minutos invocando el metodo getMinutes
        var mins = d.getMinutes();
        //obtenemos los segundos invocando el metodo getSeconds
        var secs = d.getSeconds();
        //concatenamos la hora, minutos y segundos
        //obtenemos el elemento con id hour y le insertamos la concatenacion 
        document.getElementById("hour").innerHTML = hours + ":" + mins + ":" + secs;
        document.getElementById("hours").innerHTML = hours + ":" + mins + ":" + secs;
    };
    //invocamos la funcion printTime cada 1000 milisegundos == 1 segundo
    setInterval(printTime, 1000);
    //Creamos una función llamada meslyrics.
    function meslyrics() 
    {
        //Creamos un objeto de tipo date.
        var d = new Date();
        //Creamos un arreglo con los días del año, el arreglo se llama days.
        var days = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        //Creamos otro arreglo con los meses del año, llamado months.
        var months = ["January","February","March","April","May","June","July","August","September",
        "October","November","December"];
        /*Se concatena el día en letra que está en el arreglo days con el día en número, luego se concatena el mes
        que está en el arreglo months, después se concatena el año papu.
        */
        document.getElementById("date").innerHTML = days[d.getDay()] + ", " + d.getDate() +" of "+
            months[d.getMonth()] + " - " + d.getFullYear();
        document.getElementById("dates").innerHTML = days[d.getDay()] + ", " + d.getDate() + " of " +
            months[d.getMonth()] + " - " + d.getFullYear();
    }
    //invocamos la funcion meslyrics cada 1000 milisegundos == 1 segundo
    setInterval(meslyrics, 1000);
};

