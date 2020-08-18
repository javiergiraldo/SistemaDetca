//Funcion para eliminar los registros 
(function() {
    $("tr td #alert").click(function () {
        event.preventDefault(); // Prevent the href from redirecting directly
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
        })

        swalWithBootstrapButtons.fire({
            title: 'Deseas Eliminar este Registro??',
            text: "No podras revertir este cambio!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, Eliminarlo!',
            cancelButtonText: 'No, cancelar!',
            reverseButtons: true
        }).then((result) => {
            if (result.value) {
                swalWithBootstrapButtons.fire(
                    'Eliminado!',
                    'Tu Registro ha sido eliminado.',
                    window.location.href = "/delete/{{id_usuario}}"
                    
                )
            } else if (
                /* Read more about handling dismissals below */
                result.dismiss === Swal.DismissReason.cancel
            ) {
                swalWithBootstrapButtons.fire(
                    'Cancelado',
                )
            }
        })
    }); 
})();


//     function deleletconfig() {

//         var del = confirm("Are you sure you want to delete this record?");
//         if (del == true) {
//             alert("record deleted")
//             window.location.href = "/edit/{{id_usuario}}";
//         } else {
//             alert("Record Not Deleted")
//         }
//         return del;
// };
   