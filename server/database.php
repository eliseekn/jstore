<?php
/*
database.php
	used to connect and execute operations to MySQL server
*/

//define database connection constants
define('DB_HOST', 'localhost');
define('DB_USERNAME', 'root'); //change this to your database infos
define('DB_PASSWORD', 'eliseekn'); //change this to your database infos
define('DB_NAME', 'jstore'); //if you change this, change alse in db.sql

//define database class used to connect and execute queries on it
class Database {
	private $connection;
	public $connected = false;

	//connect to database
	public function __construct() {
		$this->connection = mysqli_connect( DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME );

		//check for connection error to database
		if ( !mysqli_connect_errno() ) {
			$this->connected = true;
		}
	}

	//mysql escape string for database insertion
	public function escape_string( string $str ): string {
		return mysqli_real_escape_string( $this->connection, $str );
	}

	//execute query
	public function execute_query( string $query ) {
		return mysqli_query( $this->connection, $query );
	}

	//fetch row as enumerated array 
	public function fetch_assoc( string $query, bool $recursive = false ) {
		$query_result = $this->execute_query( $query );

		if ( !$recursive ) {
			$result = mysqli_fetch_assoc( $query_result );
		} else {
			$result = array();
			
			while ( $row = mysqli_fetch_assoc( $query_result ) ) {
				$result[] = $row;
			}
		}

		return $result;
	}

	//retrieves rows count
	public function rows_count( string $query ) {
		$query_result = $this->execute_query( $query );
		return mysqli_num_rows( $query_result );
	} 
}
