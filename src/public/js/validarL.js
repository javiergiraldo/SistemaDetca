//Validaciones de login inicio sesion
function validarL() {
    var CorreoL, ContraseñaL
    CorreoL = document.getElementById("CorreoL").value;
    ContraseñaL = document.getElementById("ContraseñaL").value;
    if (ContraseñaL === "" && CorreoL === "") {
        swal("Error", "Por favor ingresar todos los campos. ", "error");
        return false;
    }
    else if (CorreoL === "") {
        swal("Error", "Correo  no ingresado.", "error");
        return false;
    }
    else if (ContraseñaL === "") {
        swal("Error", " Contraseña no ingresada.", "error");
        return false;
    }
}