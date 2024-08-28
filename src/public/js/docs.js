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
            text: "Error subiendo un archivo",
            style: {
              background: "linear-gradient(to right, #FFA100, #0066A1)",
            },
            duration: 3000,
          }).showToast();
        }

        const result = await response.json();

        Toastify({
          text: "Subida de archivo satisfactoria",
          style: {
            background: "linear-gradient(to right, #FFA100, #0066A1)",
          },
          duration: 3000,
        }).showToast();
      } catch (error) {
        Toastify({
          text: "Error subiendo un archivo",
          style: {
            background: "linear-gradient(to right, #FFA100, #0066A1)",
          },
          duration: 3000,
        }).showToast();
      }
    });
  });
});
