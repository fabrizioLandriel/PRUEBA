document.getElementById("loader").style.display = "block";
fetch("/products")
  .then((response) => {
    if (response.status === 401) {
      window.location.href = "/login";
    } else {
      window.location.href = "/products";
    }
  })
  .finally(() => {
    document.getElementById("loader").style.display = "none";
  });
