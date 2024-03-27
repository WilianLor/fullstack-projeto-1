const resultContainer = document.getElementById("result");
const searchForm = document.getElementById("serachDomainForm");
const domainInput = document.getElementById("domainInput");
const error = document.getElementById("error");

const domains = [];

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const domain = domainInput.value.replace(/\s/g, "");

  if (!domain) {
    renderErrorMessage("Por favor insira um dominio");

    return;
  }

  const response = await fetch(
    `https://brasilapi.com.br/api/registrobr/v1/${domain}`
  );

  const data = await response.json();

  domains.push(data);
  renderDomains();
});

const renderDomains = () => {
  resultContainer.innerHTML = "";

  domains.reverse().forEach((data) => {
    const result = document.createElement("div");

    const fnqdText = document.createElement("p");
    fnqdText.innerHTML = data.fqdn;

    const infosContainer = document.createElement("div");

    const expiresAtInfoContainer = document.createElement("div");

    const expiresAtLabel = document.createElement("p");
    expiresAtLabel.innerHTML = "expira em";

    const expiresText = document.createElement("p");
    expiresText.innerHTML = isStatusRegistred(data.status)
      ? formatDate(new Date(data["expires-at"]))
      : "-";

    expiresAtInfoContainer.appendChild(expiresAtLabel);
    expiresAtInfoContainer.appendChild(expiresText);
    infosContainer.appendChild(expiresAtInfoContainer);

    const statusInfoContainer = document.createElement("div");

    const statusLabel = document.createElement("p");
    statusLabel.innerHTML = "status";

    const statusText = document.createElement("p");
    statusText.innerHTML = formatStatus(data.status);

    statusInfoContainer.appendChild(statusLabel);
    statusInfoContainer.appendChild(statusText);
    infosContainer.appendChild(statusInfoContainer);

    const registroBrLink = document.createElement("a");
    registroBrLink.href = `https://registro.br/busca-dominio/?fqdn=${data.fqdn}`;
    registroBrLink.innerHTML = "registro.br";
    registroBrLink.target = "_blank";

    result.appendChild(fnqdText);
    result.appendChild(infosContainer);
    result.appendChild(registroBrLink);

    resultContainer.append(result);
  });
};

const isStatusRegistred = (status) => {
  return status === "REGISTERED";
};

const formatStatus = (status) => {
  if (status === "REGISTERED") return "registrado";

  return "disponível";
};

const formatDate = (date) => {
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  if (day < 10) day = "0" + day;
  if (month < 10) month = "0" + month;

  return day + "/" + month + "/" + year;
};

const renderErrorMessage = (message = "") => {
  console.log("chamando");
  error.innerHTML = message;
};
