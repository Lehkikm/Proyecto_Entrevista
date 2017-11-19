asistenteFirebase.detectaUsuario(despliegaLibroCalificaciones);

    var ref = asistenteFirebase.getRaizRef(),
        estudiantesRef = ref.child("Estudiantes");

    var idEstudiante = null,
        nombreEstudiante,
        matriculaEstudiante,
        asignaturaSeleccionada,
        mesSeleccionado,
        comentario_septiembre,
        comentario_octubre,
        comentario_noviembre;

    function despliegaLibroCalificaciones(){

        // "Encendiendo" la búsqueda de estudiantes
        estudiantesRef.on('value', (snapshot) => {
            var tbody_libroCalificaciones = $("#tbl_libroCalificaciones tbody"),
                tr = "",
                estudiantes = snapshot.val();

            tbody_libroCalificaciones.empty();

            for(estudiante in estudiantes){
                tr += '<tr id="' + estudiante + '" data-matricula="' + estudiantes[estudiante].matricula + '" data-comentario="' + estudiantes[estudiante].matricula + '">'
                        +'<td>' 
                            + '<input class="txt_estudiante" readonly="readonly" type="text" value="'+estudiantes[estudiante].nombre+'"/>'
                        +'</td>'

                        +'<td>' 
                            + '<input type="text" class="input-calificacion" readonly="readonly" name="txt_septiembre" data-toggle="modal" data-target="#myModal" onclick="muestraDatosDelEstudianteEnModal(this)" data-mes="septiembre">'
                        +'</td>' 

                        +'<td>'
                            + '<input type="text" class="input-calificacion" readonly="readonly" name="txt_octubre" data-toggle="modal" data-target="#myModal" onclick="muestraDatosDelEstudianteEnModal(this)" data-mes="octubre">'
                        +'</td>'

                        +'<td>' 
                            + '<input type="text" class="input-calificacion" readonly="readonly" name="txt_noviembre" data-toggle="modal" data-target="#myModal" onclick="muestraDatosDelEstudianteEnModal(this)" data-mes="noviembre">'
                        +'</td>' 
                    + '</tr>';
            }

            tbody_libroCalificaciones.append(tr);
            console.log(estudiantes);
            fila = "";
        });
        
    }

    function cambiaNombreBotonAsignaturas(penlace) { //Ejecutado cuando le das a un enlace del dropdown
        asignaturaSeleccionada = $(penlace).text();
        $("#btn_listaAsignaturas").text(asignaturaSeleccionada);
        asignaturaSeleccionada = asignaturaSeleccionada.toLowerCase();
        console.log(asignaturaSeleccionada);
    }

    function muestraDatosDelEstudianteEnModal(ptxt){
        $("#txt_calificacion").val("");
        $("#text_comentario").val("");

        idEstudiante = $(ptxt).closest('tr').attr('id'); // Obteniendo el id del estudiante del tr mas cercano.
        mesSeleccionado = $(ptxt).data("mes");
        nombreEstudiante = $('#' + idEstudiante).find(".txt_estudiante").attr('value');
        matriculaEstudiante = $('#' + idEstudiante).data('matricula');
        // asignaturaSeleccionada ya fue inicializada en cambiaNombreBotonAsignaturas.

        $("#txt_nombreEstudiante").val(nombreEstudiante);
        $("#txt_matriculaEstudiante").val(matriculaEstudiante);

        console.log(asignaturaSeleccionada);
        estudiantesRef.on('value', snapshot => {
            var estudiantes = snapshot.val(),
            // TODO: Tengo que resolver el problema del "undefined".
            // comentario = JSON.parse(JSON.stringify(estudiantes, function(comentario, nota) {
            //     if (comentario === undefined || nota == undefined) 
            //         return null;

            //     return comentario;
            // }));
            comentario = estudiantes[idEstudiante].calificacion[asignaturaSeleccionada].comentario[mesSeleccionado],
            calificacion = estudiantes[idEstudiante].calificacion[asignaturaSeleccionada].nota[mesSeleccionado];
            
            if (comentario!=undefined)
                $("#text_comentario").val(comentario);
            if (calificacion!=undefined)
                $("#txt_calificacion").val(calificacion);
        });
    }

    $("#btn_guardarCambios").click(function(){
        var nota = $("#txt_calificacion").val(),
            comentario = $("#text_comentario").val();

        console.log(nota, comentario);
        console.log(asignaturaSeleccionada);
        // Guardando comentario.
        estudiantesRef.child(idEstudiante+"/calificacion/"+asignaturaSeleccionada+"/comentario/"+mesSeleccionado).set(comentario);
        // Guardando nota.
        estudiantesRef.child(idEstudiante+"/calificacion/"+asignaturaSeleccionada+"/nota/"+mesSeleccionado).set(nota);
        //estudiantesRef.child(idEstudiante+"/calificacion/" + asignaturaSeleccionada).set(calificacion)
        //estudiantesRef.child(idEstudiante).update({calificacion : calificacion}); 
    });
