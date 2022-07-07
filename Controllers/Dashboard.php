<?php 

	class Dashboard extends Controllers{
		public function __construct()
		{
			parent::__construct();

			session_start();
			if(empty($_SESSION['login'])) //si no existe la variable de sesion
			{
				header('location: '.base_url().'/login'); //redirecciona
			}
			getPermisos(1);//envia el id del modulo donde esta

		}

		public function dashboard()
		{
			$data['page_id'] = 2;
			$data['page_tag'] = "Dashboard - Tienda Virtual";
			$data['page_title'] = "Dashboard - Tienda Virtual";
			$data['page_name'] = "dashboard";
			$this->views->getView($this,"dashboard",$data);
		}

	}
 ?>