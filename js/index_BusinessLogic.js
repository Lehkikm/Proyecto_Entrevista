/****************************************
 * La lógica de negocios del index.html *
 ****************************************/

/**
 * [getUrlParameter description]
 * @param  {[string]} pseccion [Esta es la variable en la que se almacena la sección]
 * @return {[string]}          [Devuelve el valor de la "sección" (pseccion)]
 */

function getUrlParameter(pseccion) {
  var urlPaginas = decodeURIComponent(window.location.search.substring(1)),
    urlVariables = urlPaginas.split("&"),
    nombreSeccion,
    i;

  for (i = 0; i < urlVariables.length; i++) {
    nombreSeccion = urlVariables[i].split("=");

    if (nombreSeccion[0] === pseccion) {
      return nombreSeccion[1] === undefined ? true : nombreSeccion[1];
    }
  }
}

asistenteFirebase.detectaUsuario(muestraElementosUsuarioAutenticado);

function muestraElementosUsuarioAutenticado() {
  //Esta se ejecuta cuando asistenteFirebase detecta un usuario

  $("#li_planificarConsulta").show();
  $("#li_registro");
  $("#li_libroCalificaciones").show().addClass("active");
  $("#li_reportes").show(); 
  $("#li_registro").hide();
  $("#li_inicioSesion").hide();
  $("#li_cierreSesion").show();
  $("#li_datosUsuario").show();
  $("#li_datosUsuario").html(
    "<a href=index.html?seccion=inicio>" +
      AsistenteFirebase.emailUsuarioActual() +
      "</a>"
 );
}

function cambiaSeccion(pagina, pcontenedor) {
  seccion = getUrlParameter("seccion");

  switch (seccion) {
    //Del sistema
    case "registro":
      pagina = "pages/registro.html";
      break;

    case "login":
      pagina = "pages/login.html";
      break;

    case "recuperarClave":
      pagina = "pages/recuperarClave.html";
      break; 

    case "libroCalificaciones":
      pagina="pages/libroCalificaciones.html";
      break;
  }

  var estudiante = {
    nombre: "Daniel Guerrero",
    matricula: "2015-3024"
  };

  //Funciones propias del index 
  $(pcontenedor).load(pagina);
}
