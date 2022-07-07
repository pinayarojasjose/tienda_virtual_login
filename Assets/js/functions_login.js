$('.login-content [data-toggle="flip"]').click(function() {
    $('.login-box').toggleClass('flipped');
    return false;
});

var divLoading = document.querySelector("#divLoading");//corresponde al id de la vista
/* Agrega todos lo eventos que van dentro de la funcion */
document.addEventListener('DOMContentLoaded', function(){
    if(document.querySelector("#formLogin")){ //si existe ese elemento

        let formLogin = document.querySelector("#formLogin"); //let indica que solo va a ser utilizada dentro de esta funcion
        formLogin.onsubmit = function(e) { //agrega el evento onsubmit
            e.preventDefault(); //previene a que se recargue la pagina al momento de darle click al boton sumit

            let strEmail = document.querySelector('#txtEmail').value;
            let strPassword = document.querySelector('#txtPassword').value;

            if(strEmail == "" || strPassword == "")
            {
                swal("Por favor", "Escribe usuario y contraseña.", "error");
                return false;
            }else{
                divLoading.style.display = "flex";//para mostrar el loading
                var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
                var ajaxUrl = base_url+'/Login/loginUser';
                var formData = new FormData(formLogin);
                request.open("POST",ajaxUrl,true); //abre la conexion indicando que va enviar la info de tipo post a traves de la url que tenemos en ajaxUrl
                request.send(formData); //envia la info
                request.onreadystatechange = function(){//ejecuta la funcion
                if(request.readyState != 4) return; //si es diferente a 4 no va hacer nada
                if(request.status == 200){
                    var objData = JSON.parse(request.responseText); // parsea para convertir a un objeto en formato json que viene en ()
                    if(objData.status)//si el status es verdadero
                    {
                        window.location = base_url+'/dashboard'; // va a redireccionar hacia esta direccion 
                    }else{
                        swal("Atención", objData.msg, "error"); // alerta de error
                        document.querySelector('#txtPassword').value = ""; // va al elemento y lo limpia el campo
                    }
                }else{
                    swal("Atención", "Error en el proceso", "error"); //alerta de error cuando falla el servidor
                } 
                divLoading.style.display = "none";//para esconder el loading
                return false;
                }
            }
        }
    }

    if(document.querySelector("#formResetPass")){//va al id del formuladrio
        let formResetPass = document.querySelector("#formResetPass");//obtiene el id del formulario
        formResetPass.onsubmit = function(e){//
            e.preventDefault();//previene a q se recargue la pagina

            let strEmail = document.querySelector('#txtEmailReset').value;//
            if(strEmail == "")//si esta vacio
            {
                swal("Por favor", "Escribe tu correo electrónico.", "error");
                return false;//para que ya no continue el proceso
            }else{
                divLoading.style.display = "flex";
                var request = (window.XMLHttpRequest) ?
                                new XMLHttpRequest() :
                                new ActiveXObject('Microsoft.XMLHTTP');//verifica en q navegador esta para crear el objeto xmmlhttp

                var ajaxUrl = base_url+'/Login/resetPass';
                var formData = new FormData(formResetPass);//
                request.open("POST",ajaxUrl,true);
                request.send(formData);
                request.onreadystatechange = function(){
                  
                    if(request.readyState != 4) return;

                    if(request.status == 200){
                        var objData = JSON.parse(request.responseText);
                        if(objData.status)
                        {
                            swal({
                                title: "",
                                text: objData.msg, //manda el msg que tiene ""
                                type: "success",
                                confirmButtonText: false,
                            }, function(isConfirm){
                                if(isConfirm){//si es verdadero
                                    window.location = base_url;//redirecciona a la ruta raiz
                                }
                            });
                        }else{
                            swal("Atención", objData.msg, "error");
                        }
                    }else{
                        swal("Atención", "Error en el proceso", "error");
                    }
                    divLoading.style.display = "none";
                    return false;
                }
            }
        }
    }
    /*enviar por ajax cambiar contraseña*/
        if(document.querySelector("#formCambiarPass")){
        let formCambiarPass = document.querySelector("#formCambiarPass");
        formCambiarPass.onsubmit = function(e){
            e.preventDefault();
            
            let strPassword = document.querySelector('#txtPassword').value;
            let strPasswordConfirm = document.querySelector('#txtPasswordConfirm').value;
            let idUsuario = document.querySelector('#idUsuario').value;

            if(strPassword == "" || strPasswordConfirm == ""){
                swal("Por favor", "Escribe la nueva contraseña." , "error");
                return false;//evita a que el proceso continue
            }else{
                if(strPassword.length < 5 ){
                    swal("Atención", "La contraseña debe tener un mínimo de 5 caracteres.", "info");
                    return false;
                }
                if(strPassword != strPasswordConfirm){
                    swal("Atención", "Las contraseñas no son iguales.", "error");
                    return false;
                }
                divLoading.style.display = "flex";
                var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
                var ajaxUrl = base_url+'/Login/setPassword';
                var formData = new FormData(formCambiarPass);
                request.open("POST",ajaxUrl,true);
                request.send(formData);
                request.onreadystatechange = function(){
                    if(request.readyState != 4) return;
                    if(request.status == 200){
                        var objData = JSON.parse(request.responseText);//todo lo que trae el contenido  

                        if(objData.status)
                        {
                            swal({
                                title: "",
                                text: objData.msg,
                                type: "success",
                                confirmButtonText: "Iniciar sessión",
                                closeOnConfirm: false,//indica q no va cerrar hasta que no se de click
                            }, function(isConfirm){
                                if (isConfirm){
                                    window.location = base_url+'/login';
                                }
                            });
                        }else{
                            swal("Atención",objData.msg,"error");
                        }
                    }else{
                        swal("Atención","Error en el proceso","error");
                    }
                    divLoading.style.display = "none";
                }

            }
        }
    }

}, false);