//Validaciones del 1er modulo recuperar contraseña
function validarC() {
    var CorreoL
    CorreoL = document.getElementById("CorreoL").value;
    if (CorreoL === "") {
        swal("Error", "Correo  no ingresado.", "error");
        return false;
    }
}

