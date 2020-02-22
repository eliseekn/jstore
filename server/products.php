<?php
/*
products.php
	used to manage operations on products in database
*/

//define main class for products
class Products {
	private $db;

	public function __construct() {
		//create new database connection instance
		$this->db = new Database();
	}
	
	//generate pagination
	private function pagination( int $page ): array {
		if ( $this->db->connected ) {
			$total_products = $this->db->rows_count( "SELECT * FROM products" );
		}

		$last_product = 9;
		$total_pages = ceil( $total_products / $last_product );

		if ( $page < 1) {
			$page = 1;
		} elseif ( $page > $total_pages ) {
			$page = $total_pages;
		}
		
		
		$first_product = ( $page - 1 ) * $last_product;

		return array( $first_product, $last_product, $total_pages );
	}

	//retrieves all products
	public function get_all( int $page ): array {
		$products = array();
		$pagination = $this->pagination( $page );
		$query = "SELECT * FROM products LIMIT $pagination[0], $pagination[1]";

		if ( $this->db->connected ) {
			$result = $this->db->fetch_assoc( $query, true );

			foreach ( $result as $product ) {
				$products[] = array (
					'id' => $product['id'],
					'name' => $product['name'],
					'price' => $product['price'],
					'category' => $product['category'],
					'image' => $product['image']
				);
			}
		}
		
		return array( 
			'products' => $products,
			'page' => $page,
			'first_product' => $pagination[0],
			'total_pages' => $pagination[2]
		);
	}

	//get single product by id
	public function get_product( string $id ): array {
		$product = array();

		if ( $this->db->connected ) {
			$product = $this->db->fetch_assoc( "SELECT * FROM products WHERE id='$id'" );
		}

		return $product;
	}
}
