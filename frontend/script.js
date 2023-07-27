const productForm = document.getElementById("product-form");
const productList = document.getElementById("products");
let selectedProductId = null;

async function fetchProducts() {
  try {
    const response = await fetch("http://localhost:5000/products");
    const products = await response.json();

    productList.innerHTML = "";

    products.forEach((product) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <h3>${product.name}</h3><br>
        Price: $${product.price}<br>
        Description: ${product.description}<br>
        <button class="update-btn" data-product-id="${product._id}">Update</button>
        <button class="delete-btn" data-product-id="${product._id}">Delete</button>
      `;
      productList.appendChild(li);
    });
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

async function addProduct(event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const description = document.getElementById("description").value;

  const newProduct = {
    name,
    price,
    description,
  };

  try {
    const response = await fetch("http://localhost:5000/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    });

    if (response.ok) {
      productForm.reset();
      selectedProductId = null;
      fetchProducts();
      alert("Product added successfully!");
    } else {
      console.error("Failed to add product:", response.statusText);
    }
  } catch (error) {
    console.error("Error adding product:", error);
  }
}

async function updateProduct(productId) {
  try {
    const response = await fetch(`http://localhost:5000/products/${productId}`);
    const product = await response.json();

    document.getElementById("name").value = product.name;
    document.getElementById("price").value = product.price;
    document.getElementById("description").value = product.description;

    selectedProductId = productId;
  } catch (error) {
    console.error("Error fetching product details:", error);
  }
}

async function saveUpdatedProduct(event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const description = document.getElementById("description").value;

  const updatedProduct = {
    name,
    price,
    description,
  };

  try {
    const response = await fetch(
      `http://localhost:5000/products/${selectedProductId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProduct),
      }
    );

    if (response.ok) {
      productForm.reset();
      selectedProductId = null;
      fetchProducts();
    } else {
      console.error("Failed to update product:", response.statusText);
    }
  } catch (error) {
    console.error("Error updating product:", error);
  }
}

async function deleteProduct(productId) {
  if (!confirm("Are you sure you want to delete this product?")) {
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:5000/products/${productId}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      fetchProducts();
    } else {
      console.error("Failed to delete product:", response.statusText);
    }
  } catch (error) {
    console.error("Error deleting product:", error);
  }
}

productForm.addEventListener("submit", (event) => {
  if (selectedProductId) {
    saveUpdatedProduct(event);
  } else {
    addProduct(event);
  }
});

productList.addEventListener("click", (event) => {
  if (event.target.tagName === "BUTTON") {
    const productId = event.target.dataset.productId;
    if (event.target.classList.contains("update-btn")) {
      updateProduct(productId);
    } else if (event.target.classList.contains("delete-btn")) {
      deleteProduct(productId);
    }
  }
});

fetchProducts();
