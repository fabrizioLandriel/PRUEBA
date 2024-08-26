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
          text: "Role updated successfully!",
          style: {
            color: "linear-gradient(to right, #00b09b, #96c93d)",
          },
          duration: 3000,
        }).showToast();
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        throw new Error("Failed to update role");
      }
    })
    .catch((error) => {
      Toastify({
        text: error.message,
        style: {
          background: "linear-gradient(to right, #ff5f6d, #ffc371)",
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
          text: "User deleted successfully!",
          style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
          },
          duration: 3000,
        }).showToast();
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        return response.json().then((data) => {
          throw new Error(data.message || "An error occurred");
        });
      }
    })
    .catch((error) => {
      Toastify({
        text: `Error: ${error.message}`,
        style: {
          background: "linear-gradient(to right, #ff5f6d, #ffc371)",
        },
        duration: 3000,
      }).showToast();
    });
}
