<?php 

	class Logout{
		public function __construct()
		{
			session_start();//inicializa sesion
            session_unset();//limpia todas las variables de sesion
            session_destroy();//destruye todas las sesiones
            header('location: '.base_url().'/login');//redirecciona a traves de php a esta ruta
		}
	}
 ?>