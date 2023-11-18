const currencyForm = document.getElementById("currencyForm");
const continueButton = document.getElementById("continueButton");
const modal = document.getElementById("modal");
const buyCurrencyButton = document.getElementById("buyCurrencyButton");
const usernameInput = document.getElementById("username");
const currencyRangeInput = document.getElementById("currencyRange");
const currencyVirtualAmountInput = document.getElementById(
  "currencyVirtualAmount"
);
const currencyRealAmount = document.getElementById("currencyRealAmount");
const overlay = document.querySelector(".game__overlay");
const btnCloseModal = document.querySelector("[data-close]");

const defaultVirtualMoney = 1000;
const maximumVirtualMoney = 10000;
const disabledRangeInputColor = 0;
const priceWorldfOfWarcraftEU = 10;
const priceWorldfOfWarcraftDE = 15;

let userChoices = {
  currency: "eur",
};

continueButton.addEventListener("click", openModal);
currencyRangeInput.addEventListener("input", updateAmountForGame);
btnCloseModal.addEventListener("click", closeModal);

buyCurrencyButton.addEventListener("click", () => {
  const validName = getAndCheckInputName(usernameInput.value);
  if (validName) {
    console.log(userChoices);
    resetFormAndSettings();
  }
});
currencyRangeInput.addEventListener("input", (event) =>
  handleRangeInputColor(event.target.value)
);

currencyForm.addEventListener("change", function (event) {
  const target = event.target;

  if (target.tagName === "SELECT" || target.tagName === "INPUT") {
    const step = target.getAttribute("data-step");
    userChoices[step] = target.value;

    if (step === "game" || step === "currency" || step === "gameCurrency") {
      updateAmountForGame();
    }

    const nextStep = getNextStep(step);
    const nextElements = document.querySelectorAll(`[data-step="${nextStep}"]`);

    if (nextElements) {
      nextElements.forEach((element) => {
        if (!element.classList.contains("done")) {
          element.disabled = false;
          element.classList.add("active");
        }
      });
    }

    if (nextStep === "username") {
      continueButton.disabled = false;
    }
  }
  updateCurrencyIcons(target.value);
});

currencyVirtualAmountInput.addEventListener("input", function () {
  let moneyGame = currencyVirtualAmountInput.value;
  if (moneyGame > maximumVirtualMoney) {
    currencyVirtualAmountInput.value = maximumVirtualMoney;
    return;
  }
  currencyRangeInput.value = moneyGame;
  handleRangeInputColor(moneyGame);
});

function getAndCheckInputName(value) {
  if (!/^[A-Za-z]+$/.test(value)) {
    alert("Please enter a valid character name with only Latin letters.");
    return false;
  }
  userChoices["userName"] = value;
  return true;
}

function resetFormAndSettings() {
  currencyForm.reset();
  document.querySelectorAll("[data-step]").forEach((element) => {
    if (element.id === "gameSelect") {
      element.classList.remove("done");
    } else {
      element.disabled = true;
      element.classList.remove("active");
      element.classList.remove("done");
    }
  });
  userChoices = {
    currency: "eur",
  };

  handleRangeInputColor(disabledRangeInputColor);
  updateCurrencyIcons(userChoices.currency);
  updateAmountForGame();
  closeModal();
}

function updateAmountForGame() {
  const game = gameSelect.value;
  const moneyGame = +currencyRangeInput.value;
  const realCurrency = formulaGamesCurrency(game, moneyGame);
  const typeOfCurrency = userChoices.currency;
  const transferedAmount = exchangeCurrency(typeOfCurrency, realCurrency);
  currencyRealAmount.innerHTML = transferedAmount;
  currencyVirtualAmountInput.value = moneyGame.toFixed(2);
  userChoices["amount"] = transferedAmount;
}

function getNextStep(currentStep) {
  const selectElement = document.querySelector(`[data-step=${currentStep}]`);
  switch (currentStep) {
    case "game":
      selectElement.classList.add("done");
      return "server";
    case "server":
      selectElement.classList.remove("active");
      selectElement.classList.add("done");
      return "fraction";
    case "fraction":
      selectElement.classList.remove("active");
      selectElement.classList.add("done");
      handleRangeInputColor(defaultVirtualMoney);
      return "gameCurrency";
    case "gameCurrency":
      return "currency";
    case "currency":
      return "username";
    default:
      return "";
  }
}

function formulaGamesCurrency(game, moneyGame) {
  switch (game) {
    case "World of Warcraft (EU)":
      return ((moneyGame * priceWorldfOfWarcraftEU) / 100).toFixed(2);
    case "World of Warcraft (DE)":
      return ((moneyGame * priceWorldfOfWarcraftDE) / 100).toFixed(2);
    default:
      break;
  }
}

function exchangeCurrency(currency, amount) {
  switch (currency) {
    case "eur":
      return `€ ${(amount * 1).toFixed(2)}`;
    case "usd":
      return `$ ${(amount * 1.2).toFixed(2)}`;
    default:
      return amount.toFixed(2);
  }
}

function handleRangeInputColor(inputRangeValue) {
  const progress = (inputRangeValue / currencyRangeInput.max) * 100;
  currencyRangeInput.style.background = `linear-gradient(to right, #46CA43 ${progress}%, #4E5D74 ${progress}%)`;
}

function updateCurrencyIcons(selectedCurrency) {
  const currencyIcons = document.querySelectorAll(".game__currency-flag img");
  const existCurrencies = [];

  currencyIcons.forEach((icon) => {
    existCurrencies.push(icon.getAttribute("data-currency"));
  });

  if (existCurrencies.includes(selectedCurrency)) {
    currencyIcons.forEach((icon) => {
      if (icon.getAttribute("data-currency") === selectedCurrency) {
        icon.style.display = "inline-block";
      } else {
        icon.style.display = "none";
      }
    });
  }
}

function closeModal() {
  overlay.style.display = "none";
}

function openModal() {
  overlay.style.display = "block";
}

window.addEventListener("click", (e) => {
  if (e.target === overlay) {
    closeModal();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.code === "Escape") {
    closeModal();
  }
});

usernameInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
  }
});

currencyVirtualAmountInput.addEventListener("submit", (e) => {
  e.preventDefault();
});

currencyVirtualAmountInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
  }
});
