const addToCart = async (pid) => {
  const cartInput = document.getElementById("cart");
  const cid = cartInput.value;
  try {
    const response = await fetch(`/api/carts/${cid}/product/${pid}`, {
      method: "POST",
    });

    if (response.status === 200) {
      Toastify({
        text: `Product ${pid} added to cart`,
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        duration: 3000,
      }).showToast();
    } else {
      throw new Error("Failed to add product to cart");
    }
  } catch (error) {
    Toastify({
      text: "Failed to add product to cart",
      style: {
        background: "linear-gradient(to right, #ff4b2b, #ff416c)",
      },
      duration: 3000,
    }).showToast();
  }
};

const removeFromCart = async (pid) => {
  const cartInput = document.getElementById("cart");
  const cid = cartInput.value;
  try {
    const response = await fetch(`/api/carts/${cid}/product/${pid}`, {
      method: "DELETE",
    });

    if (response.status === 200) {
      Toastify({
        text: `Product ${pid} removed from cart`,
        style: {
          background: "linear-gradient(to right, #ff4b2b, #ff416c)",
        },
        duration: 3000,
      }).showToast();

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
      throw new Error("Failed to add product to cart");
    }
  } catch (error) {
    Toastify({
      text: "Failed to add product to cart",
      style: {
        background: "linear-gradient(to right, #ff4b2b, #ff416c)",
      },
      duration: 3000,
    }).showToast();
  }
};

const purchase = async (cid) => {
  try {
    const response = await fetch(`/api/carts/${cid}/purchase`, {
      method: "POST",
    });
    const data = await response.json();

    if (response.status === 200) {
      if (data.ticket) {
        Swal.fire({
          title: "Purchase successful",
          icon: "success",
        });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        Swal.fire({
          title: "Insufficient stock for some products",
          icon: "error",
        });
      }
    } else {
      throw new Error("Failed to complete purchase");
    }
  } catch (error) {
    Toastify({
      text: "Failed to complete purchase",
      style: {
        background: "linear-gradient(to right, #ff4b2b, #ff416c)",
      },
      duration: 3000,
    }).showToast();
  }
};

const getTotalPrice = async () => {
  const cartInput = document.getElementById("cart");
  const cid = cartInput.value;
  try {
    const response = await fetch(`/api/carts/${cid}`);
    const data = await response.json();

    const totalPrice = data.cartById.products.reduce((accumulator, product) => {
      const productPrice = Number(product.product.price);
      const productQuantity = Number(product.quantity);
      return accumulator + productPrice * productQuantity;
    }, 0);

    const totalPriceDiv = document.getElementById("precioTotal");
    totalPriceDiv.innerHTML = `<p id="precioTotal">Total price: $${totalPrice.toFixed(
      2
    )}</p>`;
  } catch (error) {
    console.error("Error fetching total price:", error);
  }
};

getTotalPrice();
