const tabs = document.querySelectorAll(".tab");
const insertUserPane = document.querySelector("#insert-user-pane");
const searchUserPane = document.querySelector("#search-user-pane");
const userSubmitButton = document.querySelector("#user-submit-button");
const userSearchButton = document.querySelector("#user-search-button");
const userInfoContainer = document.querySelector(".user-info-container");
const dialog = document.querySelector("#dialog");

let displayedPane = insertUserPane;
displayedPane.classList.remove("hidden");

// const apiUrl = "https://workshare-api.herokuapp.com";
const apiUrl = "http://127.0.0.1:5000";

const tabIdToPane = {
  "insert-user-tab": insertUserPane,
  "search-user-tab": searchUserPane,
};

const triggerDialog = (title, description, icon) => {
  dialog.innerHTML = `
    <div class="card">
      <div class="dialog-icon">
        <object
          data="${icon}"
          class="icon"
          type="image/svg+xml"
        ></object>
      </div>
      <div class="dialog-info">
        <p class="dialog-title">${title}</p>
        <p>${description}</p>
        <button class="submit-button" onclick="hideDialog()">OK</button>
      </div>
    </div>
  `;
  dialog.classList.remove("hidden");
};

const hideDialog = () => {
  dialog.classList.add("hidden");
};

const onUserSubmit = async (e) => {
  e.preventDefault();
  const form = document.forms["user-form"];
  const data = {
    username: form["username"].value,
    email: form["email"].value,
    password: form["password"].value,
    fullName: form["full-name"].value,
  };

  const response = await fetch(`${apiUrl}/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();

  if (response.status !== 201) {
    triggerDialog(
      "Erro na criação do usuário",
      result.error,
      "assets/icons/error.svg"
    );
    return;
  }

  triggerDialog("Usuário inserido", result.message, "assets/icons/success.svg");
  document.forms["user-form"].reset();
};

const onUserSearch = async (e) => {
  e.preventDefault();
  const user = fakeUser;

  const queryString = document.forms["search-user"]["user-search-field"].value;

  const response = await fetch(`${apiUrl}/user/${queryString.toLowerCase()}`, {
    method: "GET",
  });
  const result = await response.json();

  if (response.status !== 200) {
    triggerDialog(
      "Erro na busca de usuário",
      result.error,
      "assets/icons/error.svg"
    );
    return;
  }

  const locInfo = result.isLoc
    ? `
      <p>CPF: <b>${result.lCpf || "Não registrado"}</b></p>
      <p>RG: <b>${result.lRg || "Não registrado"}</b></p>
      <p>CNPJ: <b>${result.lCnpj || "Não registrado"}</b></p>
    `
    : "";

  const propInfo = result.isProp
    ? `
      <p>CPF: <b>${result.pCpf || "Não registrado"}</b></p>
      <p>RG: <b>${result.pRg || "Não registrado"}</b></p>
    `
    : "";

  userInfoContainer.innerHTML = `
    <p class="user-info-title">Dados do usuário</p>
    <p>Nome completo: <b>${result.name}</b></p>
    <p>Nome de usuário: <b>${result.username}</b></p>
    <p>E-Mail: <b>${result.email}</b></p>
    <p class="user-info-subtitle">Locatário: ${result.isLoc ? "Sim" : "Não"}</p>
    ${locInfo}
    <p class="user-info-subtitle">Proprietário: ${
      result.isProp ? "Sim" : "Não"
    }</p>
    ${propInfo}
  `;

  userInfoContainer.classList.remove("hidden");
};

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((cTab) => {
      if (cTab === tab) {
        tab.classList.add("selected");
      } else {
        cTab.classList.remove("selected");
      }
    });
    const nextPane = tabIdToPane[tab.id];
    if (nextPane !== displayedPane) {
      displayedPane.classList.add("hidden");
      nextPane.classList.remove("hidden");
      displayedPane = nextPane;
    }
  });
});

userSubmitButton.addEventListener("click", onUserSubmit);
userSearchButton.addEventListener("click", onUserSearch);
