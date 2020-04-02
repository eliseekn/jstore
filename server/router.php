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

$request = json_decode(file_get_contents('php://input'), true);

//parse requests
if ( isset( $request['categories'] ) ) {
	$data = $categories->get_all();
} elseif ( isset( $request['products'] ) ) {
	if ( isset( $request['page'] ) ) {
		$data = $products->get_all( (int)$request['page'] );
	}
}

//send response in json format
echo json_encode( $data );
