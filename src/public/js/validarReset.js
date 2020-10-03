//Validaciones del 1er modulo recuperar contraseña
function validarReset() {
    var Contraseña , Contraseña_confirm; 
    Contraseña = document.getElementById("Contraseña").value;
    Contraseña_confirm = document.getElementById("Contraseña_confirm").value;
    if (Contraseña === "" && Contraseña_confirm === "") {
        swal("Error", "Campos obligatorios.", "error");
        return false;
    }

    if (Contraseña === "") {
        swal("Error", "Campo nueva Contraseña no ingresada.", "error");
        return false;
    }

    if (Contraseña_confirm === "") {
        swal("Error", "Campo confirmar Contraseña no ingresada.", "error");
        return false;
    }

    else if (Contraseña.length < 5) {
        swal("Error", "El campo Contraseña es muy corto", "error");
        return false;
    }
}