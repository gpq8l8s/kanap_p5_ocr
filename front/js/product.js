'use strict';

// Fetch
async function getOneKanap(idProduct) {
  try {
    const response = await fetch(
      'http://localhost:3000/api/products/' + idProduct
    );
    if (response.ok) {
      return response.json();
    } else {
      console.log(response.error);
    }
  } catch (error) {
    console.log(error);
  }
}

// SearchParams
const params = new URLSearchParams(document.location.search);
const id = params.get('id');

async function showProductDetails() {
  const product = await getOneKanap(id);

  // Get HTML Elements
  const name = document.getElementById('title');
  const price = document.getElementById('price');
  const productImage = document.createElement('img');
  const description = document.getElementById('description');
  const selectId = document.getElementById('colors');

  // Get the Products Details
  const productName = document.createTextNode(product.name);
  const productPrice = document.createTextNode(product.price);
  const productDescrtiption = document.createTextNode(product.description);

  // Show the Details
  name.appendChild(productName);
  price.appendChild(productPrice);
  document.querySelector('.item__img').appendChild(productImage);
  productImage.src = product.imageUrl;
  description.appendChild(productDescrtiption);

  // Color Options
  const colors = product.colors;
  for (const value of colors) {
    const productColor = document.createElement('option');
    selectId.appendChild(productColor);
    productColor.text = value;
    productColor.value = value;
  }
}

showProductDetails();

// LocalStorage
const addBtnDiv = document.getElementsByClassName('item__content__addButton');
const btnA = document.createElement('a');
const addToCart = document.getElementById('addToCart');

const addBtn = addToCart.addEventListener('click', saveLocalStorage);

function saveLocalStorage() {
  const product = {
    id: id,
    color: document.getElementById('colors').value,
    qty: Number(document.getElementById('quantity').value),
  };
  // test si qté saisi > 0 & <100 & color != ""
  var storage = JSON.parse(window.localStorage.getItem('cartItems'));

  if (product.qty < 1 || product.qty > 100 || product.color == '') {
    alert('Veuillez choisir une couleur ou une quantité valide');
  } else {
    if (!storage) {
      storage = [];
      storage.push(product);
      alert("l'article a bien était rajouté au panier");
    } else {
      var finded = false;
      storage.forEach(element => {
        // si color & id identique
        if (product.id === element.id && product.color === element.color) {
          // test si product.qty + element.qty <=100
          const totalNum = Number(product.qty) + Number(element.qty);
          finded = true;

          if (totalNum <= 100) {
            // rajouter product qty avec element.qty
            element.qty = totalNum;
            alert("l'article a bien était rajouté au panier");
          } else if (totalNum > 100) {
            alert(
              'la quantité maximum est 100, vous avez déjà ' +
                element.qty +
                'x cet article dans votre panier, rajouté 100 produits au panier'
            );
            element.qty = 100;
          }
        }
      });
      if (!finded) {
        storage.push(product);
        alert("l'article a bien était rajouté au panier");
      }
    }
    window.localStorage.setItem('cartItems', JSON.stringify(storage));
  }
}
