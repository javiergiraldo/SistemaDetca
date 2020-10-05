const socket = io();

socket.on('Alcohol', function (data) {
    console.log(data);
   let Alcohol = document.getElementById('Alcohol');
   Alcohol.innerHTML = `${data}`;
});
