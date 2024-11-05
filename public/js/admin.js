const deleteProduct = async (btn) => {
  try {
    const productId = btn.parentNode.querySelector("[name=productId]").value;
    const csrf = btn.parentNode.querySelector("[name=_csrf]").value;

    const productElement = btn.closest("article");

    const response = await fetch("/admin/product/delete/" + productId, {
      method: "DELETE",
      headers: {
        "csrf-token": csrf,
      },
    });
    const data = await response.json();
    console.log(data);
    productElement.remove();
  } catch (error) {
    console.log(error);
  }
};
