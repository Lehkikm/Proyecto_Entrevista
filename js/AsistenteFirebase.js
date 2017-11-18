class AsistenteFirebase{

  constructor(pdirectorioRaiz, pdirectorioRaizImagenes){
    //Datos del Database
    this.databaseRef= firebase.database().ref();
    this.raizRef= this.databaseRef.child(pdirectorioRaiz); //Directorio raiz de Aplicación 

    //Datos del Storage
    this.storageRef= firebase.storage().ref();
    this.imgRef= this.storageRef.child(pdirectorioRaizImagenes);
   
    //Datos del usuario
    this.emailUsuarioActual= null;
    this.usuarioActual= null;
  }

  /*---------- AUNTENTICACIÓN -----------*/

  creaUsuario(pemail, pclave){
    firebase.auth().createUserWithEmailAndPassword(pemail, pclave).then(function(){
      this.AsistenteFirebase.cierraSesion()
      alert("Usuario creado exitosamente");
      window.location="index.html?seccion=libroCalificaciones";
    }).catch(function(error){
      asistenteFirebase.cierraSesion();
      console.log(error);
    });

    return false;
  }

  iniciaSesion(pemail, pclave, pleyenda){
    firebase.auth().signInWithEmailAndPassword(pemail, pclave).then(function(usuario){
      window.location ='index.html?seccion=libroCalificaciones';
      }).catch(function(error){
          pleyenda.css('display', 'inline-block');
          pleyenda.html('Usuario o contraseña incorrectos');
      });
  }

  cierraSesion(){
    firebase.auth().signOut().then(function(){
        console.log('Cerrando sesión...');
        window.location='index.html?seccion=login';
      }, function(error){
        alert(error);
    });
  }

  recuperaClave(pemail){
    var autenticador= firebase.auth();
    autenticador.sendPasswordResetEmail(pemail)
      .then(function(){
        alert('Se ha enviado un correo a tu cuenta. Sigue los pasos indicados para recuperarla.');
        window.location= 'index.html?seccion=login';
      }, function (error){
        alert(error);
      });
  }

  static emailUsuarioActual(){
    var email= String (firebase.auth().currentUser.email);
    console.log('getEmailUsuarioActual(): ' + email);
    return email;
  }

  /*------------ DATABASE ------------*/

  agregaRegistro(pdirectorio, pregistro){
    var nuevoRegistro= this.raizRef.child(pdirectorio).push(pregistro),
        idRegistro= nuevoRegistro.key;

    console.log(pdirectorio, pregistro);
  }

  guardaRegistroConAdjunto(pdirectorio, pregistro, pimg){
    var email= AsistenteFirebase.emailUsuarioActual().replace('.', '_'),
        nuevoRegistro= this.raizRef.child(email+'/'+pdirectorio).push(pregistro),
        idRegistro= nuevoRegistro.key;

    console.log(idRegistro);
    //Guardando imagen con el mismo nombre de registro para su posterior utilización.
    this.guardaAdjunto(pdirectorio, pimg, idRegistro);
  } 

  /*------------ STORAGE --------------*/

  guardaAdjunto(pdirectorio, pimg, pid){

    //Obteniendo imagen
    var email = AsistenteFirebase.emailUsuarioActual().replace('.', '_'),
        imagen= pimg.files[0],
        imagenParaSubir= this.imgRef.child(email + "/" + pdirectorio +'/'+ pid).put(imagen);

    //Subiendo imagen
    imagenParaSubir.on('state_changed', function(snapshot){

      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

      $("#btn_guardar").attr("disabled", true);
      $('#cargando').show().text('Subiendo: ' + progress + '%');

      console.log('Upload is ' + progress + '% done');

      switch (snapshot.state) {

        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'

          $('#cargando').show().text('Subiendo: ' + progress + '%');
          $("#btn_guardar").attr("disabled", true);

          break;

        }

    }, function(error){

    }, function(){

        $('#cargando').show().html('<span style="color:#8da806;">¡Registro almacenado correctamente!</span>');
        $("#btn_guardar").attr("disabled", false);
        /*console.log(email + pdirectorio + pid);
        console.log(imgRef)
        this.imgRef.child(email + "/" + pdirectorio + '/' + pid).getDownloadURL().then(function (url) {
        pregistro.urlFoto=url;
        this.raizRef.child(email + '/' + pdirectorio +'/'+pid).push(pregistro);
        });
      */AsistenteFirebase.js
  
    });

  }


  /*------------ RECURSOS INTERNOS ------------*/

  /**
   * [getUsuarioAutenticado Detecta si existe o no el usuario ejecuta las acciones correspondientes]
   * @return {[function]} [La acción a realizar]
   */
  detectaUsuario(paccion){
    firebase.auth().onAuthStateChanged(function(user){
      if (user){ //Si hay un usuario
        console.log("Obteniendo usuario autenticado");
        paccion();
      } else{
        console.log('No hay usuario autenticado');
      }
    });
  }

  /**
   * [getUsuarioActual() Obtiene al usuario logueado.]
   * @return {[obj]} [Usuario actual (currentUser)]
   */
  getUsuarioActual(){
    this.usuarioActual= firebase.auth().currentUser;
    return this.usuarioActual;
  }

  /**
   * [getRaizRef Devuelve la referencia en firebase del directorio raiz]
   * @return {[type]} [description]
   */
  getRaizRef(){
    return this.raizRef;
  }

  getImgRef(){
    return this.imgRef;
  }

}
