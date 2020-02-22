/*
app.js
	used to manage data from server to ui and vice versa
*/

//cart products list
let cart = [];

//post data to server
function postData( data ) {
	let request = $.ajax({
		url: '././server/router.php',
		type: 'post',
		data: data
	});

	return request;
}

//retrieves and display categories list from server
function getCategories() {
	postData( { categories: 'categories' } )
		.done( function( response ) {
			let html = `<option value="All" selected>All</option>`;

			response.map( item => {
				html += `<option value="${item.name}">${item.name}</option>`;
			});

			$( "#categories-list" ).html( html );
		})
		.fail( function( response ) {
			console.log( "Request failed" );
		});
}

//retrieves and display products list from server
function getProducts( page ) {
	postData( { products: 'products', page: page } )
		.done( function( response ) {
			let products = response.products;
			let page = response.page;
			let first_product = response.first_product;
			let total_pages = response.total_pages;
			let html = '';

			products.map( item => {
				html += `
					<div class="card mb-4 shadow" data-product-category="${item.category}">
  						<img src="${item.image}" class="card-img-top">
 						<div class="card-body text-center">
  							<h5 class="card-title">$<span>${item.price}</span></h5>
							<p class="card-text">${item.name}</p>
							<a href="#"
 								class="btn btn-dark add-to-cart"
								data-product-id="${item.id}"
								data-product-name="${item.name}"
								data-product-price="${item.price}">Add to cart</a>
						</div>
					</div>
				`;
			});

			$( "#products-list" ).html( html );

			//generate pagination
			html = '';

			if ( page != first_product + 1 ) {
                html += `<a class="page-link text-dark" href="#" data-page-id="${page - 1}">Previous</a>`;
            }

            if ( total_pages > 1 ) {
                for (let i = 1; i <= total_pages; i++) {
                    if (i === page) {
                        html += `<a class="page-link text-dark current-page disabled" href="#" data-page-id="${i}">${i}</a>`;
                    } else {
                        html += `<a class="page-link text-dark" href="#" data-page-id="${i}">${i}</a>`;
                    }
                }
            }

            if ( page != total_pages ) {
                html += `<a class="page-link text-dark" href="#" data-page-id="${page + 1}">Next</a>`;
            }

            $( ".pagination" ).html( html );

            $( ".page-link" ).each( function( i, elmt ) {
                $( elmt ).click( function( e ) {
                    e.preventDefault();
                    getProducts( this.dataset.pageId );
                });
            });
			
			//add product to cart
			$( ".add-to-cart" ).each( function ( i, elmt ) {
				$( elmt ).click( function( e ) {
					e.preventDefault();

					let productId = this.dataset.productId;
					let productName = this.dataset.productName;
					let productPrice = this.dataset.productPrice;

					let inCart = cart.find( item => item.id === productId );
	
					if ( !inCart ) {
						cart.push({ productId, productName, productPrice });
						updateCartCount();
				
						$( this ).text( "In cart" );
						$( this ).addClass( "disabled" );
					} 
				});
			});
		})
		.fail( function( response ) {
			console.log( "Request failed" );
		});
}

//update cart price
function updateCartPrice() {
	let cartPrice = 0;
	
	$( ".product-price" ).each( function( i, elmt ) {
		cartPrice += Number( $( elmt ).text() );
	});

	$( "#cart-price" ).text( cartPrice );
}

//update cart products count
function updateCartCount() {
	$( ".cart-count" ).each( function( i, elmt ) {
		$( elmt ).text( cart.length );
	});
}

//load resources on document load
$( function() {
	//display categories and products list
	getCategories();
	getProducts( 1 );

	//display cart products list
	$( "#show-cart" ).click( function( e ) {
		let html = '';

		cart.forEach( item => {
			html += `
				<li class="list-group-item d-flex justify-content-between align-items-center">
					<p>
						${item.productName} 
						($<span class="product-price" data-product-id="${item.productId}">${item.productPrice}</span>)
					</p>
					<div class="form-group row align-items-center">
						<span>Quantity</span>
						<div class="col">
							<input 
								type="number" 
								class="form-control product-quantity" 
								value="1" 
								min="1" 
								data-product-price="${item.productPrice}" 
								data-product-id="${item.productId}">
						</div>
						
						<button 
							type="button" 
							class="btn btn-danger remove-from-cart" 
							data-product-id="${item.productId}">Remove</button>
					</div>
				</li>
			`;
		});

		$( "#cart-products" ).html( html );
	
		//remove product from cart
		$( ".remove-from-cart" ).each( function( i, elmt ) {
			$( elmt ).click( function( e ) {
				e.preventDefault();
			
				$( this ).parent().parent().remove();

				let productId = this.dataset.productId;
				let j = cart.findIndex( item => item.id === productId );
				cart.splice( j, 1 );

				$( ".add-to-cart" ).each( function ( i, elmt ) {
					if ( elmt.dataset.productId === productId ) {
						$( this ).text( "Add to cart" );
						$( this ).removeClass( "disabled" );
					}
				});

				updateCartCount();
				updateCartPrice();
			});
		});
		
		//update product price
		$( ".product-quantity" ).each( function( i, elmt ) {
			$( elmt ).change( function() {
				let productId = this.dataset.productId;
				let productPrice = this.dataset.productPrice;
				let newProductPrice = productPrice * $( this ).val();

				$( ".product-price" ).each( function( i, elmt ) {
					if ( elmt.dataset.productId === productId ) {
						$( elmt ).text( newProductPrice );
					}
				});

				updateCartPrice();		
			});
		});

		updateCartCount();
		updateCartPrice();
	});

	//clear cart products list
	$( "#clear-cart" ).click( function( e ) {
		e.preventDefault();

		$( ".remove-from-cart" ).each( function( i, elmt ) {
			$( elmt ).click();
		});
	});

	//filter products by category
	$( "#categories-list" ).change( function( e ) {
		let categoryName = this.value;
		
		$( ".card" ).each( function( i, elmt ) {
			let productCategory = this.dataset.productCategory;
				
			if ( productCategory === categoryName ) {
				$( elmt ).css( "display", "flex" );
			} else {
				$( elmt ).css( "display", "none" );
			}

			if ( categoryName === "All" ) {
				$( elmt ).css( "display", "flex" );
			}
		});
	});
	
	//filter products by name
	$( "#search" ).keyup( function() {
		let productSearchName = $( this ).val().toUpperCase();
		
		$( ".card-text" ).each( function( i, elmt ) {
			let productCard = $( elmt ).parent().parent();
			let productCategory = productCard.data( "productCategory" );
			let categoryName = $( "#categories-list" ).val();

			//apply category filter
			if ( categoryName === productCategory || categoryName === "All" ) {
				if ( $( elmt ).text().toUpperCase().indexOf( productSearchName ) > -1 ) {
					productCard.css( "display", "flex" );
				} else {
					productCard.css( "display", "none" );
				}
			} else {
				productCard.css( "display", "none" );
			}
		});
	});

	//filter products by price
	$( "#price-filter" ).on( 'input', function() {
		let filterPrice = $( this ).val();
		$( "#product-filter-price" ).text( filterPrice );

		$( ".card-title" ).each( function( i, elmt ) {
			let productCard = $( elmt ).parent().parent();
			let productCategory = productCard.data( "productCategory" );
			let categoryName = $( "#categories-list" ).val();
			let productSearchName = $( "#search" ).val().toUpperCase();
			let productCardName = $( elmt ).next().text();
			let productPrice = $( elmt ).children().text();
			productPrice = Number( productPrice );
			
			//apply category filter
			if ( categoryName === productCategory || categoryName === "All" ) {
				//apply product name filter
				if ( productCardName.toUpperCase().indexOf( productSearchName ) > -1 ) {
					if ( productPrice <= filterPrice ) {
						productCard.css( "display", "flex" );
					} else {
						productCard.css( "display", "none" );
					}
				} else {
					productCard.css( "display", "none" );
				}
			} else {
				productCard.css( "display", "none" );
			}
		});
	});
});
