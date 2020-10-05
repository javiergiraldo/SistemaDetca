//Validaciones del registro usuario
function validar() {
    var Nombre, Apellido, Telefono, Correo, Contraseña, expresion;
    Nombre = document.getElementById("Nombre").value;
    Apellido = document.getElementById("Apellido").value;
    Telefono = document.getElementById("Telefono").value;
    Correo = document.getElementById("Correo").value;
    Contraseña = document.getElementById("Contraseña").value;
    expresion = /\w+@\w+\.+[a-z]/; //Expresion apra validar los correos
    const expresion2 = new RegExp('^[A-Z]+$', 'i'); //Expresion apra validar textos

    if (Nombre === "" || Apellido === "" || Telefono === "" || Correo === "" || Contraseña === "") {
        swal ("Error", "Todos Los campos son obligatorios", "error");
        return false;
    }
    else if (Nombre.length > 20) {
        swal("Error", "El campo Nombre es demasiado largo", "error");
        return false;
    }
    else if (Apellido.length > 20) {
        swal("Error", "El campo Apellido es demasiado largo", "error");
        return false;
    }
    else if (!expresion2.test(Nombre)) {
        swal("Error", "El campo Nombre solo se permite texto", "error");
        return false;
    }
        
    else if (!expresion2.test(Apellido)) {
        swal("Error", "El campo Apellido solo se permite texto", "error");
        return false;
    }
    else if (Correo.length > 30) {
        swal("Error", "El campo Correo es demasiado largo", "error");
        return false;
    }
    else if (!expresion.test(Correo)) {
        swal("Error", "El campo Correo no es valido", "error");
        return false;
    }
    else if (Contraseña.length > 12) {
        swal("Error", "El campo Contraseña es demasiado largo", "error");
        return false;
    }
        
    else if (Contraseña.length <5) {
         swal("Error", "El campo Contraseña es demasiado corto", "error");
         return false;
    }
    else if (Telefono.length > 15 && Telefono.length <=7 ) {
        swal("Error", "El campo Telefono es demasiado largo o demasiado corto", "error");
        return false;
    }
    else if (Telefono.length <7) {
        swal("Error", "El campo Telefono es demasiado corto", "error");
        return false;
    }
    else if (isNaN(Telefono)) {
        swal("Error", "El campo Telefono solo debe tener numeros", "error");
        return false;
    }
    else {
        swal("Confirmado","Usuario Registrado Correctamente")
    }
}