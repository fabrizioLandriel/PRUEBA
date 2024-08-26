document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll(".upload-form");

  forms.forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const action = form.getAttribute("action");

      try {
        const response = await fetch(action, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          return Toastify({
            text: "Error uploading file",
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
            duration: 3000,
          }).showToast();
        }

        const result = await response.json();

        Toastify({
          text: "File uploaded successfully",
          style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
          },
          duration: 3000,
        }).showToast();
      } catch (error) {
        Toastify({
          text: "Error uploading file",
          style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
          },
          duration: 3000,
        }).showToast();
      }
    });
  });
});
