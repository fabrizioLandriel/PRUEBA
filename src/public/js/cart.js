const addToCart = async (pid) => {
  const cartInput = document.getElementById("cart");
  const cid = cartInput.value;
  try {
    const response = await fetch(`/api/carts/${cid}/product/${pid}`, {
      method: "POST",
    });

    if (response.status === 200) {
      Toastify({
        text: `Producto ${pid} agregado al carrito`,
        style: {
          background: "linear-gradient(to right, #FFA100, #0066A1)",
        },
        duration: 3000,
      }).showToast();
    } else {
      throw new Error("Fallo en agregar producto al carrito");
    }
  } catch (error) {
    Toastify({
      text: "Fallo en agregar producto al carrito",
      style: {
        background: "linear-gradient(to right, #FFA100, #0066A1)",
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
        text: `Producto ${pid} eliminado del carrito`,
        style: {
          background: "linear-gradient(to right, #FFA100, #0066A1)",
        },
        duration: 3000,
      }).showToast();

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
      throw new Error("Fallo en agregar producto al carrito");
    }
  } catch (error) {
    Toastify({
      text: "Fallo en agregar producto al carrito",
      style: {
        background: "linear-gradient(to right, #FFA100, #0066A1)",
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
          title: "Compra satisfactoria",
          icon: "success",
        });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        Swal.fire({
          title: "Stock faltante en algunos productos",
          icon: "error",
        });
      }
    } else {
      throw new Error("Fallo en completar la compra");
    }
  } catch (error) {
    Toastify({
      text: "Fallo en completar la compra",
      style: {
        background: "linear-gradient(to right, #FFA100, #0066A1)",
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
