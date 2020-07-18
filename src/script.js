const tabs = document.querySelectorAll(".tab");
const insertUserPane = document.querySelector("#insert-user-pane");
const searchUserPane = document.querySelector("#search-user-pane");
const userSubmitButton = document.querySelector("#user-submit-button");
const userSearchButton = document.querySelector("#user-search-button");
const userInfoContainer = document.querySelector(".user-info-container");
const dialog = document.querySelector("#dialog");

let displayedPane = insertUserPane;
displayedPane.classList.remove("hidden");

const fakeUser = {
  username: "ftopper",
  fullName: "Fulano Topper",
  email: "ftopper_skate@gmail.com",
};

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

const onUserSubmit = (e) => {
  e.preventDefault();
  const form = document.forms["user-form"];
  const data = {
    username: form["username"].value,
    email: form["email"].value,
    password: form["password"].value,
    fullName: form["full-name"].value,
  };

  console.log(data);
  triggerDialog(
    "Usuário inserido",
    `O usuário ${data.username} foi inserido na base de dados com sucesso!`,
    "assets/icons/success.svg"
  );
};

const onUserSearch = (e) => {
  e.preventDefault();
  const user = fakeUser;

  userInfoContainer.innerHTML = `
    <p class="user-info-title">Dados do usuário</p>
    <p>Nome completo: <b>${user.fullName}</b></p>
    <p>Nome de usuário: <b>${user.username}</b></p>
    <p>E-Mail: <b>${user.email}</b></p>
  `;

  userInfoContainer.classList.remove("hidden");

  // triggerDialog(
  //   "Usuário não encontrado",
  //   "Não foi encontrado nenhum usuário com esse e-mail ou username",
  //   "assets/icons/error.svg"
  // );

  fetch("http://127.0.0.1:5000/user", {
    method: "GET",
  })
    .then((response) => response.json())
    .then((result) => {
      console.log("Success:", result);
    });
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
