class ValidadorCampos{

  constructor(){
    this.emailValido= false;
    this.claveValida= false;
    this.camposValidos= true;
    this.cantidadAceptable= false;
    this.todosCamposValidos=false;
    this.procesoAutomatico=false;
  }

  validaEmail(pemail){
    if (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(pemail)){
      this.emailValido= true;
    }else {
      this.emailValido= false;
      // console.log('email-invalido');
    }
    return this.emailValido;
  }

  validaClaves(pclave1, pclave2){
    if (pclave1==pclave2 && pclave1!="" && pclave2!=""){
      this.claveValida= true;
    }else {
      this.claveValida= false;
      // console.log(pclave1 + ' | ' + pclave2);
    }
    return this.claveValida;
  }

  validaCantidadCaracteresClave(pclave){
    if (pclave.length >= 8){
      this.cantidadAceptable = true;
    }else{
      this.cantidadAceptable = false;
      // console.log('muy pocos caracteres');
    }
    return this.cantidadAceptable;
  }

  validaCampos(pobjeto){
    for (var k in pobjeto){
      if (pobjeto[k]==""){
        this.camposValidos=false;
        console.log(pobjeto[k].value + '=========');
      } else{
        this.camposValidos= true;
        // console.log(pobjeto[k] + '+++++++++');
      }
    }
    return this.camposValidos;
  }

  getEstadoTodosLosCampos(){
    if (!this.emailValido && !this.claveValida && !this.camposValidos && !this.cantidadAceptable){
      this.todosCamposValidos= false;
    } else{
      this.todosCamposValidos=true;
    }
    return this.todosCamposValidos;
  }

  validaCamposAutomaticamente(pentidad, nombre, pemail, pclave, pconfirmaClave, pleyendaError){
    var validador= new ValidadorCampos();
    var camposValidos= validador.validaCampos(pentidad),
        emailValido= validador.validaEmail(pemail),
        claveValida= validador.validaClaves(pclave, pconfirmaClave),
        minimoCaracteres= validador.validaCantidadCaracteresClave(pclave);

    if (claveValida && emailValido && camposValidos && minimoCaracteres){
      this.procesoAutomatico=true;
    }

    var estadoTodosLosCampos= validador.getEstadoTodosLosCampos();

    if (!estadoTodosLosCampos){
      pleyendaError.css("display", "inline-block");
      pleyendaError.html('- Ingresa datos válidos');
      console.warn('mirando algo');
    }
    if (!claveValida && estadoTodosLosCampos){
      pleyendaError.css("display", "inline-block");
      pleyendaError.html('- Contraseñas no coinciden. Escríbelas nuevamente.');
      console.warn('mirando algo');
    }
    if (!emailValido && estadoTodosLosCampos) {
      pleyendaError.css("display", "inline-block");
      pleyendaError.html('- e-mail no válido.');
      console.warn('mirando algo');
    }
    if (!minimoCaracteres && estadoTodosLosCampos){
      console.log('estadoTodosLosCampos'+ estadoTodosLosCampos);
      pleyendaError.css("display", "inline-block");
      pleyendaError.html('- Contraseña muy corta. Ingresa una con mínimo 8 caracteres');
      console.warn('mirando algo');
    }

    return this.procesoAutomatico;

  }

}
