'use strict';

// Show Order ID
const params = new URLSearchParams(document.location.search);
const orderId = params.get('orderId');
const orderTxt = document.getElementById('orderId');
orderTxt.textContent = orderId;

// Empty localStorage
window.localStorage.clear();
