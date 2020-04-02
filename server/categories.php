<?php
/*
categories.php
	used to manage operations on categories in database	
*/

//define main class for categories
class Categories {
	private $db;	

	public function __construct() {
		//create new database connection instance
		$this->db = new Database();
	}

	//retrieves all categories by name
	public function get_all() {
		$categories = array();

		if ( $this->db->connected ) {
			$result = $this->db->fetch_assoc( "SELECT * FROM categories", true );

			foreach ( $result as $category ) {
				$categories[] = array (
					'name' => $category['name']
				);
			}
		}
		
		return $categories;
	}
}
