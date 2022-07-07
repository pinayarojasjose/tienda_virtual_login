function controlTag(e){ //funcion para bloquear teclas y permitir solo numeros
    tecla = (document.all) ? e.keyCode : e.which;
    if (tecla==8) return true;
    else if (tecla==00 || tecla==9) return true;
    patron =/[0-9\s]/;
    n = String.fromCharCode(tecla);
    return patron.test(n);
}

function testText(txtString){ //para validad nombres y apellidos
    var stringText = new RegExp(/^[a-zA-ZÑñÁáÉéÍíÓóÚúÜü\s]+$/);
    if(stringText.test(txtString)){
        return true;
    }else{
        return false;
    }
}

function testEntero(intCant){//para validar numeros
    var intCantidad = new RegExp(/^([0-9])*$/);//numeros del 0 al 9
    if(intCantidad.test(intCant)){
        return true;
    }else{
        return false;
    }
}

function fntEmailValidate(email){
    var stringEmail = new RegExp(/^([a-zA0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/);//expresion regular para un correo
    if (stringEmail.test(email) == false){//si el email es incorrecto
        return false;//duvuelve false
    }else{
        return true;
    }
}

function fntValidText(){
    let validText = document.querySelectorAll(".validText");
    validText.forEach(function(validText){
        validText.addEventListener('keyup', function(){
            let inputValue = this.value;
            if(!testText(inputValue)){
                this.classList.add('is-invalid');
            }else{
                this.classList.remove('is-invalid');
            }
        });
    });
}

function fntValidNumber(){
    let validNumber = document.querySelectorAll(".validNumber");
    validNumber.forEach(function(validNumber){
        validNumber.addEventListener('keyup', function(){
            let inputValue = this.value;
            if(!testEntero(inputValue)){
                this.classList.add('is-invalid');
            }else{
                this.classList.remove('is-invalid');
            }
        });
    });
}

function fntValidEmail(){
    let validEmail = document.querySelectorAll(".validEmail");
    validEmail.forEach(function(validEmail){
        validEmail.addEventListener('keyup', function(){
            let inputValue = this.value;
            if(!fntEmailValidate(inputValue)){
                this.classList.add('is-invalid');
            }else{
                this.classList.remove('is-invalid');
            }
        });
    });
}

window.addEventListener('load', function(){
    fntValidText();
    fntValidNumber()
    fntValidEmail();
}, false);