async function fetchCategories() {
  try {
    const response = await fetch('https://dummyjson.com/products/category-list');
    const categories = await response.json();
    const categoriesContainer = document.getElementById('categories');
    categoriesContainer.innerHTML = '';

    categories.forEach(category => {
      const btn = document.createElement('button');
      btn.className = 'category-btn';
      btn.textContent = capitalizeWords(category);
      btn.onclick = () => fetchProductsByCategory(category);
      categoriesContainer.appendChild(btn);
    });
  } catch (err) {
    displayError('Unable to load categories. Please try again later.');
  }
}

async function fetchProductsByCategory(category) {
  try {
    const productsContainer = document.getElementById('products');
    productsContainer.innerHTML = `<p class="loading">Loading products for "${capitalizeWords(category)}"...</p>`;

    const res = await fetch(`https://dummyjson.com/products/category/${category}`);
    const data = await res.json();
    const products = data.products || [];

    if (products.length === 0) {
      productsContainer.innerHTML = `<p class="error">No products found for "${capitalizeWords(category)}".</p>`;
      return;
    }

    productsContainer.innerHTML = '';
    products.forEach(product => {
      const card = document.createElement('article');
      card.className = 'product-card';
      card.innerHTML = `
        <div class="product-image">
          <img src="${product.thumbnail}" alt="${product.title}" />
        </div>
        <div class="product-details">
          <h3>${product.title}</h3>
          <p class="price">$${product.price.toFixed(2)}</p>
          <p class="description">${product.description}</p>
          <button class="buy-btn" onclick="alert('Added \"${product.title}\" to cart!')">Buy Now</button>
        </div>
      `;
      productsContainer.appendChild(card);
    });
  } catch (err) {
    displayError('Failed to load products. Please try again later.');
  }
}

function displayError(msg) {
  const container = document.getElementById('products');
  container.innerHTML = `<p class="error">${msg}</p>`;
}

function capitalizeWords(str) {
  return str.replace(/\b\w/g, c => c.toUpperCase());
}

document.addEventListener('DOMContentLoaded', () => {
  fetchCategories();
  fetchProductsByCategory('smartphones');
});
