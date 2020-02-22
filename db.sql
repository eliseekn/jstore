-- create database for products, users and products' categories
CREATE DATABASE `jstore` CHARACTER SET 'utf8';

-- select database
USE `jstore`;

-- create tables
CREATE TABLE `categories` (
	id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `products` (
	id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	category VARCHAR(255) NOT NULL,
	price VARCHAR(255) NOT NULL,
	image VARCHAR(255) NOT NULL DEFAULT 'public/assets/img/products/thumb.svg'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- insert templates in each tables
INSERT INTO `categories` (`name`) VALUES 
	('Category A'), 
	('Category B'), 
	('Category C'), 
	('Category D');

INSERT INTO `products` (`name`, `category`, `price`) VALUES 
	('Product A', 'Category A', '15'),
	('Product B', 'Category A', '3'),
	('Product C', 'Category A', '8'),
	('Product D', 'Category A', '9'),
	('Product E', 'Category A', '150'),
	('Product F', 'Category A', '16'),
	('Product G', 'Category B', '74'),
	('Product H', 'Category B', '2'),
	('Product I', 'Category B', '22'),
	('Product J', 'Category B', '64'),
	('Product K', 'Category B', '75'),
	('Product L', 'Category B', '152'),
	('Product M', 'Category C', '566'),
	('Product N', 'Category C', '189'),
	('Product O', 'Category C', '50'),
	('Product P', 'Category C', '136'),
	('Product Q', 'Category C', '89'),
	('Product R', 'Category C', '65'),
	('Product S', 'Category D', '199'),
	('Product T', 'Category D', '745'),
	('Product U', 'Category D', '363'),
	('Product V', 'Category D', '235'),
	('Product W', 'Category D', '195'),
	('Product X', 'Category D', '815'),
	('Product Y', 'Category A', '656'),
	('Product Z', 'Category B', '36');
