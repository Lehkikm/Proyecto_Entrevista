asistenteFirebase.detectaUsuario(ofreceListaEstudiantesRegistrados);

    var idEstudiante = null,
        asignaturaSeleccionada,
        comentario_septiembre,
        comentario_octubre,
        comentario_noviembre;

    var ref = asistenteFirebase.getRaizRef();

    function ofreceListaEstudiantesRegistrados() {
        //Obteniendo referencia
        estudiantesRef = ref.child("Estudiantes");

        //Escuchando todos los cambios y almacenando los registros
        estudiantesRef.on("value", function (snapshot) {
            var estudiantes = snapshot.val(),
                ul_listaEstudiantes = $("#ul_listaEstudiantes");

            //Añadiendo propiedades y valores a los elementos creados.
            for (estudiante in estudiantes) {
                var a_estudiante = $("<a>", {
                    role: "menuitem",
                    tabindex: "-1",
                    href: "#",
                    value: estudiantes[estudiante].cedula,
                    onclick: "cambiaNombreBoton(this)",
                    id: estudiante
                });

                /*<li role="presentation"><a role="menuitem" tabindex="-1" href="#">O +</a></li>*/
                var li_estudiante = $("<li>", { role: "presentation" });

                a_estudiante.text(estudiantes[estudiante].nombre + " (" + estudiantes[estudiante].matricula + ")");
                li_estudiante.append(a_estudiante);
                ul_listaEstudiantes.append(li_estudiante);

                console.log(a_estudiante.text());
            }
        });
    }

    function cambiaNombreBoton(penlace) { //Ejecutado cuando le das a un enlace del dropdown
        $("#btn_listaEstudiantes").text($(penlace).text());
        console.log($(penlace).attr('value'));
        cedula = $(penlace).attr('value');
        idEstudiante = $(penlace).attr('id');

        console.log(idEstudiante);
    }

    function cambiaNombreBotonAsignaturas(penlace) { //Ejecutado cuando le das a un enlace del dropdown
        asignaturaSeleccionada = $(penlace).text()

        $("#btn_listaAsignaturas").text(asignaturaSeleccionada);

        /* TODO: Fragmento de código usado para guardar la calificación en dependencia de la materia escogida
            if (asignatura == 'Español')
                asignatura = 'Espanol';

            asignatura = asignatura.toLocaleLowerCase();
            console.log(asignatura);
            $("#txt_septiembre").attr("value",  asignatura + $("#txt_septiembre").attr("id")),
            $("#txt_octubre").attr("value", asignatura + $("#txt_septiembre").attr("id")),
            $("#txt_noviembre").attr("value", asignatura + $("#txt_septiembre").attr("id"))
        */
    }

    // Averiguando cuál es la calificación a la cual se le va a asignar un comentario.
    $("#btn_octubre").click(function(){
        $("#btn_guardarComentario").attr("value", "comentario_" + $("#btn_octubre").attr("id"));
        $("#text_comentario").val(comentario_octubre);
        console.log(comentario_octubre);
    });

    $("#btn_noviembre").click(function () {
        $("#btn_guardarComentario").attr("value", "comentario_" + $("#btn_noviembre").attr("id"));
        $("#text_comentario").val(comentario_noviembre);
        console.log(comentario_noviembre);
    });

     $("#btn_septiembre").click(function () {
        $("#btn_guardarComentario").attr("value", "comentario_" + $("#btn_septiembre").attr("id"));
        $("#text_comentario").val(comentario_septiembre);
        console.log(comentario_septiembre);
    });

    // Asignando comentario.
    $("#btn_guardarComentario").click(function(){
        if ($("#btn_guardarComentario").attr("value") == "comentario_btn_septiembre")
            comentario_septiembre = $("#text_comentario").val();
        else if($("#btn_guardarComentario").attr("value") == "comentario_btn_octubre")
            comentario_octubre = $("#text_comentario").val();
        else
            comentario_noviembre = $("#text_comentario").val();

        console.log(comentario_septiembre);
        console.log(comentario_octubre);
        console.log(comentario_noviembre);
    });


    /* ¿Cómo guardar los cambios?

            1. Obtener id del estudiante
            2. Aplicar update por medio de una función firebase.

        Obtener el comentario correspondiente de cada calificación:

            1. Averiguar cuál es la calificación a agregar.
            2. Almacenar el comentario de la calificación que se agregó.
            3. Agregarlo al objeto que se va a subir a firebase.
    */
    $("#btn_aplicarCambios").click(function(){
    
        var comentario = {
            septiembre : comentario_septiembre,
            octubre : comentario_octubre,
            noviembre : comentario_noviembre
        };


        var calificacion = {
            noviembre: $("#txt_septiembre").val(),
            septiembre: $("#txt_octubre").val(),
            octubre: $("#txt_noviembre").val(),
            comentario: comentario
        };

        validadorCampos.corrigeNulos(comentario);
        validadorCampos.corrigeNulos(calificacion);

        var ref = asistenteFirebase.getRaizRef(),
            estudiantesRef = ref.child("Estudiantes");

        
        estudiantesRef.child(idEstudiante+"/calificacion/" + asignaturaSeleccionada).set(calificacion)
        //estudiantesRef.child(idEstudiante+"/calificacion").push(calificacion) -- Agrega al nodo de calificaciones una calificacion pero con el nombre del nodo autogenerado por firebase
        //estudiantesRef.child(idEstudiante).update({calificacion : calificacion}); 

        console.log(calificacion);

    });