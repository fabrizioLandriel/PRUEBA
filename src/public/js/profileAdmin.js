function handleEvent(event) {
  event.preventDefault();

  const form = event.target.closest("form");

  const userId = form.querySelector('input[name="userId"]').value;
  const role = form.querySelector('select[name="role"]').value;

  fetch(`/api/users/admin/${userId}/role`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ role: role }),
  })
    .then((response) => {
      if (response.ok) {
        Toastify({
          text: "Rol actualizado correctamente",
          style: {
            color: "linear-gradient(to right, #FFA100, #0066A1)",
          },
          duration: 3000,
        }).showToast();
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        throw new Error("Fallo en actualizar rol");
      }
    })
    .catch((error) => {
      Toastify({
        text: error.message,
        style: {
          background: "linear-gradient(to right, #FFA100, #0066A1)",
        },
        duration: 3000,
      }).showToast();
    });
}

function handleDelete(event) {
  event.preventDefault();
  const form = event.target.closest("form");

  const userId = form.querySelector('input[name="userId"]').value;

  fetch(`/api/users/admin/${userId}/delete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  })
    .then((response) => {
      if (response.ok) {
        Toastify({
          text: "Usuario eliminado correctamente",
          style: {
            background: "linear-gradient(to right, #FFA100, #0066A1)",
          },
          duration: 3000,
        }).showToast();
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        return response.json().then((data) => {
          throw new Error(data.message || "Ocurrio un error");
        });
      }
    })
    .catch((error) => {
      Toastify({
        text: `Error: ${error.message}`,
        style: {
          background: "linear-gradient(to right, #FFA100, #0066A1)",
        },
        duration: 3000,
      }).showToast();
    });
}
