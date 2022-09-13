'use strict';

// Fetch
async function getProduct(idProduct) {
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

async function showProduct() {
  const items = JSON.parse(window.localStorage.getItem('cartItems'));
  for (let item of items) {
    const product = await getProduct(item.id);
    const section = document.getElementById('cart__items');
    const fragment = document.createDocumentFragment();

    //Article
    const article = document.createElement('article');
    article.className = 'cart__item';
    section.appendChild(article);

    //Div Image
    const divImg = document.createElement('div');
    divImg.className = 'cart__item__img';
    article.appendChild(divImg);
    //Image
    const img = document.createElement('img');
    img.src = product.imageUrl;
    img.alt = product.altTxt;
    divImg.appendChild(img);

    //Div Content
    const divContent = document.createElement('div');
    divContent.className = 'cart__item__content';
    article.appendChild(divContent);
    //Description
    const divDes = document.createElement('div');
    divDes.className = 'cart__item__content__description';
    divContent.appendChild(divDes);
    //Name, Price
    const productName = document.createElement('h2');
    productName.textContent = product.name;
    const colorTxt = document.createElement('p');
    colorTxt.textContent = item.color;
    const priceTxt = document.createElement('p');
    priceTxt.textContent = product.price + ' €';

    divDes.appendChild(productName);
    divDes.appendChild(colorTxt);
    divDes.appendChild(priceTxt);
    //Div Settings
    const divSettings = document.createElement('div');
    divSettings.className = 'cart__item__content__settings';
    divContent.appendChild(divSettings);
    const settingQuan = document.createElement('div');
    settingQuan.className = 'cart__item__content__settings__quantity';
    divSettings.appendChild(settingQuan);
    const quanTxt = document.createElement('p');
    quanTxt.textContent = 'Qté : ';
    settingQuan.appendChild(quanTxt);
    const quanInput = document.createElement('input');
    quanInput.type = 'number';
    quanInput.className = 'itemQuantity';
    quanInput.setAttribute('name', 'itemQuantity');
    quanInput.setAttribute('min', 1);
    quanInput.setAttribute('max', 100);
    quanInput.setAttribute('value', item.qty);
    settingQuan.appendChild(quanInput);

    //Supprimer
    const deleteDiv = document.createElement('div');
    deleteDiv.className = 'cart__item__content__settings__delete';
    divSettings.appendChild(deleteDiv);

    const deleteTxt = document.createElement('p');
    deleteTxt.className = 'deleteItem';
    deleteTxt.textContent = 'Supprimer';
    deleteDiv.appendChild(deleteTxt);

    fragment.appendChild(article);
    section.appendChild(fragment);

    // Modify quantity
    quanInput.addEventListener('change', e => {
      if (quanInput.value > 100 || quanInput.value < 1) {
        alert('la quantité doit être entre 1 et 100');
      } else {
        item.qty = quanInput.value;
        window.localStorage.setItem('cartItems', JSON.stringify(items));
        updateTotals();
      }
    });

    //Delete Elements
    deleteDiv.addEventListener('click', e => {
      if (colorTxt.innerText === item.color) {
        const indexof = items.indexOf(item);
        items.splice(indexof, 1);
      }
      section.removeChild(article);
      localStorage.setItem('cartItems', JSON.stringify(items));
      updateTotals();
    });
    updateTotals();
  }
}

function updateTotals() {
  let totalQte = 0;
  let totalPrice = 0;
  const input = [...document.getElementsByClassName('itemQuantity')];
  input.forEach(element => {
    totalQte += Number(element.value);
    const parent = element.closest('.cart__item__content');
    const price = parent
      .querySelector('.cart__item__content__description :nth-child(3)')
      .textContent.slice(0, -2);
    totalPrice += Number(price) * Number(element.value);
  });
  document.getElementById('totalQuantity').textContent = totalQte;
  document.getElementById('totalPrice').textContent = totalPrice;
}

showProduct();

// User Form
const firstName = document.querySelector('#firstName');
const lastName = document.querySelector('#lastName');
const address = document.querySelector('#address');
const city = document.querySelector('#city');
const email = document.querySelector('#email');
const form = document.querySelector('.cart__order__form');
const isOnlyString = /^[a-zA-Z\àâæáäéèêëîïôœûùüú]+$/;
const isStringCity = /^[a-zA-Z\àâæáäéèêëîïôœûùüú\-\s]+$/;
const isString = /^[\s\w\-\àâæáäéèêëîïôœûùüú]+$/;
// document.getElementsByClassName('cart__order__form').method = 'post';
const checkFirstName = () => {
  let valid = false;
  const min = 3,
    max = 25;
  const firstNameValue = firstName.value.trim();

  if (!isRequired(firstNameValue)) {
    showError(firstName, 'Ne peut pas être blanc');
  } else if (!isBetween(firstNameValue.length, min, max)) {
    showError(firstName, `Doit être entre ${min} et ${max} caractères`);
  } else if (!isOnlyString.test(firstNameValue)) {
    showError(firstName, 'Le prénom ne doit pas contenir un nombre');
  } else {
    showSuccess(firstName);
    valid = true;
  }
  return valid;
};

const checkLastName = () => {
  let valid = false;
  const min = 3,
    max = 25;
  const lastNameValue = lastName.value.trim();

  if (!isRequired(lastNameValue)) {
    showError(lastName, 'Ne peut pas être blanc');
  } else if (!isBetween(lastNameValue.length, min, max)) {
    showError(lastName, `Le nom doit être entre ${min} et ${max} caractères`);
  } else if (!isOnlyString.test(lastNameValue)) {
    showError(lastName, 'Le nom ne doit pas contenir un nombre');
  } else {
    showSuccess(lastName);
    valid = true;
  }
  return valid;
};

const checkAddress = () => {
  let valid = false;
  const min = 5,
    max = 60;
  const addressValue = address.value.trim();

  if (!isRequired(addressValue)) {
    showError(address, 'Ne peut pas être blanc');
  } else if (!isBetween(addressValue.length, min, max)) {
    showError(address, `L'address doit être entre ${min} et ${max} caractères`);
  } else if (!isString.test(addressValue)) {
    showError(address, `L'address ne doit pas contenir un symbol caractère`);
  } else {
    showSuccess(address);
    valid = true;
  }
  return valid;
};

const checkCity = () => {
  let valid = false;
  const min = 2,
    max = 25;
  const cityValue = city.value.trim();

  if (!isRequired(cityValue)) {
    showError(city, 'Ne peut pas être blanc');
  } else if (!isBetween(cityValue.length, min, max)) {
    showError(
      city,
      `Le nom de ville doit être entre ${min} et ${max} caractères`
    );
  } else if (!isStringCity.test(cityValue)) {
    showError(city, 'Le nom de ville ne doit pas contenir un nombre');
  } else {
    showSuccess(city);
    valid = true;
  }
  return valid;
};
const checkEmail = () => {
  let valid = false;
  const emailValue = email.value.trim();
  if (!isRequired(emailValue)) {
    showError(email, 'Ne peut pas être blanc');
  } else if (!isEmailValid(emailValue)) {
    showError(email, `L'email n'est pas valide`);
  } else {
    showSuccess(email);
    valid = true;
  }
  return valid;
};

const isEmailValid = email => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

const isRequired = value => (value === '' ? false : true);
const isBetween = (length, min, max) =>
  length < min || length > max ? false : true;

// Show Error
const showError = (input, message) => {
  const formField = input.parentElement;
  formField.classList.remove('success');
  formField.classList.add('error');

  //show Error Msg
  const error = formField.querySelector('p');
  error.textContent = message;
};

// Show Success
const showSuccess = input => {
  const formField = input.parentElement;
  formField.classList.remove('error');
  formField.classList.add('success');

  // Hide Error Msg
  const error = formField.querySelector('p');
  error.textContent = '';
};

form.addEventListener('submit', function (e) {
  e.preventDefault();

  let isFirstNameValid = checkFirstName(),
    isLastNameValid = checkLastName(),
    isAddressValid = checkAddress(),
    isCityValid = checkCity(),
    isEmailValid = checkEmail();

  let isFormValid =
    isFirstNameValid &&
    isLastNameValid &&
    isEmailValid &&
    isAddressValid &&
    isCityValid;

  //Submit To the Server If the Form Is Valid
  if (isFormValid) {
    const storage = JSON.parse(window.localStorage.getItem('cartItems'));
    let productId = [];
    for (let element of storage) {
      productId.push(element.id);
      productId.join(element.id);
    }

    const contacts = {
      firstName: firstName.value,
      lastName: lastName.value,
      address: address.value,
      city: city.value,
      email: email.value,
    };

    async function sendRequest() {
      let response = await fetch('http://localhost:3000/api/products/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contact: contacts,
          products: productId,
        }),
      });
      const result = await response.json();

      // Go to the Confirmation Page
      location.href = './confirmation.html?orderId=' + result.orderId;
    }
    sendRequest();
  }
});

const debouce = (fn, delay = 500) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn.apply(null, args);
    }, delay);
  };
};

form.addEventListener(
  'input',
  debouce(function (e) {
    switch (e.target.id) {
      case 'firstName':
        checkFirstName();
        break;
      case 'lastName':
        checkLastName();
        break;
      case 'address':
        checkAddress();
      case 'city':
        checkCity();
      case 'email':
        checkEmail();
        break;
    }
  })
);
