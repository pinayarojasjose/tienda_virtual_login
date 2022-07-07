<?php 

	class Login extends Controllers{
		public function __construct()
		{
			session_start(); // inicializa session
			if(isset($_SESSION['login']))//si existe = isset
			{
				header('location: '.base_url().'/dashboard');
			}
			parent::__construct();
		}

		public function login()
		{

			$data['page_tag'] = "Login - Tienda Virtual";
			$data['page_title'] = "Tienda Virtual";
			$data['page_name'] = "login";
            $data['page_functions_js'] = "functions_login.js";
			$this->views->getView($this,"login",$data);
		}
		
		public function loginUser(){
			//dep($_POST);
			if($_POST){
				if(empty($_POST['txtEmail']) || empty($_POST['txtPassword'])){
					$arrResponse = array('status' => false, 'msg' => 'Error de datos' );
				}else{
					$strUsuario = strtolower(strClean($_POST['txtEmail']));//strtolower=convierte todas las letras en minuscula. strClean=limpia para tener una cadena pura
					$strPassword = hash("SHA256",$_POST['txtPassword']);//encripta con sha256 por medio de hash mandando como parametro el pass que esta recibiendo 
					$requestUser = $this->model->loginUser($strUsuario, $strPassword);
					//dep(requestUser); 
					if(empty($requestUser)){ //si esta vacio
						$arrResponse = array('status' => false, 'msg' => 'El usuario o la contraseña es incorrecto.' );
					}else{
						$arrData = $requestUser;
						if($arrData['status'] == 1){ //si el status es activo
							$_SESSION['idUser'] = $arrData['idpersona']; //crea la variable de sesion con el array del idpersona
							$_SESSION['login'] = true; //para que se cree las variables de session debemos inicializar con session_start
							
							$arrData = $this->model->sessionLogin($_SESSION['idUser']);//obtiene todos los datos del usuario
							$_SESSION['userData'] = $arrData; //para crear la variable de sesion userData

							$arrResponse = array('status' => true, 'msg' => 'ok');
						}else{
							$arrResponse = array('status' => false, 'msg' => 'Usuario inactivo.');
						}
					}
				}
				echo json_encode($arrResponse,JSON_UNESCAPED_UNICODE); //convierte en formato json el array que se esta creando para retornar para en la funcion
			}
			sleep(2);
			die();
		}

		public function resetPass(){
			if($_POST){

				error_reporting(0);//evita que se muestre el error

				if(empty($_POST['txtEmailReset'])){
					$arrResponse = array('status' => false, 'msg' => 'Error de datos');
				}else{
					$token = token();
					$strEmail = strtolower(strClean($_POST['txtEmailReset']));//todo en minuscula y limpiar el script
					$arrData = $this->model->getUserEmail($strEmail);

					if(empty($arrData)){
						$arrResponse = array('status' => false, 'msg' => 'Usuario no existente');
					}else{
						$idpersona = $arrData['idpersona'];
						$nombreUsuario = $arrData['nombres'].' '.$arrData['apellidos'];

						$url_recovery = base_url().'/login/confirmUser/'.$strEmail.'/'.$token;//url para restablecer la contraseña
						$requestUpdate = $this->model->setTokenUser($idpersona,$token);

						$dataUsuario = array('nombreUsuario' => $nombreUsuario,
												'email' => $strEmail,
												'asunto' => 'Recuperar cuenta - '.NOMBRE_REMITENTE,
												'url_recovery' => $url_recovery);							

						if($requestUpdate){

							$sendEmail = sendEmail($dataUsuario,'email_cambioPassword');

							
							if($sendEmail){
								$arrResponse = array('status' => true, 'msg' => 'Se ha enviado un email a tu cuenta de correo para cambiar tu contraseña.');

							}else{
								$arrResponse = array('status' => false, 'msg' => 'No es posible realizar el proceso, intenta más tarde.');

							}
						}else{
							$arrResponse = array('status' => false, 'msg' => 'No es posible realizar el proceso, intenta más tarde.');

						}

					}
				}
				echo json_encode($arrResponse,JSON_UNESCAPED_UNICODE);
			}
			sleep(2);
			die();
		}
        
		public function confirmUser(string $params){ 

			if(empty($params)){//si esta vacio
				header('location: '.base_url());//redirecciona a la ruta raiz
				//$arrParams = explode(',',$params); //explode convierte a un array toda la cadena pero separando con comas)
				$strEmail = strClean($arrParams[0]);//email strClean limpia para q los datos esten puros
				$strToken = strClean($arrParams[1]);//token
				
				$arrResponse = $this->model->getUsuario($strEmail,$strToken);//consulta a la base de datos
				if(empty($arrResponse)){
					header("location: ".base_url());
				}else{
					$data['page_tag'] = "Cambiar contraseña";
					$data['page_name'] = "cambiar_contrasenia";
					$data['page_title'] = "Cambiar Contraseña";
					$data['email'] = $strEmail;
					$data['token'] = $strToken;
					$data['idpersona'] = $arrResponse['idpersona'];
					$data['page_functions_js'] = "functions_login.js";					
					$this->views->getView($this,"cambiar_password",$data);	//llamado hacia la vista
				}
			}
			die();

		}

		public function setPassword(){
			if(empty($_POST['idUsuario']) || empty($_POST['txtEmail']) || empty($_POST['txtToken']) ||
			 empty($_POST['txtPassword']) || empty($_POST['txtPasswordConfirm'])){

				$arrResponse = array('status' => false, 'msg' => 'Error de datos');
			}else{
				$intIdpersona = intval($_POST['idUsuario']);//convertir en un entero el idUsuario
				$strPassword = $_POST['txtPassword'];
				$strPasswordConfirm = $_POST['txtPasswordConfirm'];
				$strEmail = strClean($_POST['txtEmail']);
				$strToken = strClean($_POST['txtToken']);

				if($strPassword != $strPasswordConfirm){
					$arrResponse = array('status' => false,
											'msg' => 'Las contraseñas no son iguales.');
				}else{
					$arrResponseUser = $this->model->getUsuario($strEmail,$strToken);
					if(empty($arrResponseUser)){
						$arrResponse = array('status' => false,
											'msg' => 'Error de datos.');
					}else{
						$strPassword = hash("SHA256",$strPassword);
						$requestPass = $this->model->insertPassword($intIdpersona,$strPassword);

						if($requestPass){
							$arrResponse = array('status' => true,
												'msg' => 'Contraseña actualizada con éxito.');
						}else{
							$arrResponse = array('status' => false,
												'msg' => 'No es posible realizar el proceso, intente más tarde.');
						}
					}
				}

			}
			sleep(2);
			echo json_encode($arrResponse,JSON_UNESCAPED_UNICODE);			
			die();
		}

	}
 ?>