async function getAllKanap() {
  try {
    const response = await fetch('http://localhost:3000/api/products');
    if (response.ok) {
      return response.json();
    } else {
      console.log(response.error);
    }
  } catch (error) {
    console.log(error);
  }
}

async function displayKanap() {
  const kanaps = await getAllKanap();
  const section = document.getElementById('items');
  var fragment = document.createDocumentFragment();

  kanaps.forEach(kanap => {
    var baliseA = document.createElement('a');
    baliseA.href = './product.html?id=' + kanap._id;

    var article = document.createElement('article');
    baliseA.appendChild(article);

    var image = document.createElement('img');
    image.src = kanap.imageUrl;
    image.alt = kanap.altTxt;
    article.appendChild(image);

    var title = document.createElement('h3');
    title.className = 'productName';
    title.textContent = kanap.name;
    article.appendChild(title);

    var description = document.createElement('p');
    description.className = 'productDescription';
    description.textContent = kanap.description;
    article.appendChild(description);

    fragment.appendChild(baliseA);
  });

  section.appendChild(fragment);
}

displayKanap();
