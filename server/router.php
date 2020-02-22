<?php
/*
router.php
	used to parse $_POST requests to server
*/

//set headers for json response
header( 'Content-Type: application/json' );

//import database class
require_once "database.php";
require_once "categories.php";
require_once "products.php";

//define main variables
$data = array();
$categories = new Categories();
$products = new Products();

//parse $_POST requests
if ( isset( $_POST['categories'] ) ) {
	$data = $categories->get_all();
} elseif ( isset( $_POST['products'] ) ) {
	if ( isset( $_POST['page'] ) ) {
		$data = $products->get_all( (int)$_POST['page'] );
	}
}

//send response in json format
echo json_encode( $data );
