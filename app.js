const API_URL = "https://auth-crud-api.onrender.com/api";

let token = null;

// Login
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

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  token = null;
  document.getElementById("auth").style.display = "block";
  document.getElementById("items").style.display = "none";
});

// Adicionar item
document.getElementById("addItemBtn").addEventListener("click", async () => {
  const title = document.getElementById("newItem").value;
  if (!title) return;

  const res = await fetch(`${API_URL}/items`, {
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

// Carregar itens
async function loadItems() {
  const res = await fetch(`${API_URL}/items`, {
    headers: { "Authorization": `Bearer ${token}` }
  });

  const items = await res.json();
  const list = document.getElementById("itemList");
  list.innerHTML = "";
  items.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item.title;
    list.appendChild(li);
  });
}
