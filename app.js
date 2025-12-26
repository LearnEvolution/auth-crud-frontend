const API_URL = "https://auth-crud-api.onrender.com/api";

let token = null;

// LOGIN
document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (data.token) {
    token = data.token;
    document.getElementById("auth").style.display = "none";
    document.getElementById("items").style.display = "block";
    loadItems();
  } else {
    alert(data.msg || "Erro no login");
  }
});

// LOGOUT
document.getElementById("logoutBtn").addEventListener("click", () => {
  token = null;
  document.getElementById("auth").style.display = "block";
  document.getElementById("items").style.display = "none";
});

// ADICIONAR ITEM
document.getElementById("addItemBtn").addEventListener("click", async () => {
  const title = document.getElementById("newItem").value;
  if (!title) return;

  await fetch(`${API_URL}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ title })
  });

  document.getElementById("newItem").value = "";
  loadItems();
});

// CARREGAR ITENS
async function loadItems() {
  const res = await fetch(`${API_URL}/items`, {
    headers: { "Authorization": `Bearer ${token}` }
  });

  const items = await res.json();
  const list = document.getElementById("itemList");
  list.innerHTML = "";

  items.forEach(item => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = item.title;

    const btn = document.createElement("button");
    btn.textContent = "❌";
    btn.style.marginLeft = "10px";

    btn.addEventListener("click", async () => {
      await fetch(`${API_URL}/items/${item._id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      loadItems();
    });

    li.appendChild(span);
    li.appendChild(btn);
    list.appendChild(li);
  });
}
