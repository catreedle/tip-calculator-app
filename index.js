const billInputElement = document.getElementById("bill");
const peopleInputElement = document.getElementById("number-of-people");
const selectTipElement = document.getElementsByName("select-tip");
const selectTipCustomRadioElement = document.querySelector(
  ".calculator-tip__radio__custom"
);
const selectTipCustomContainerElement = document.querySelector(
  ".calculator-tip__select__custom__container"
);
const selectTipCustomInputElement = document.getElementById("custom-input");
const peopleErrorElement = document.querySelector(
  ".calculator-input__people-error"
);
const billErrorElement = document.querySelector(
  ".calculator-input__bill-error"
);

let bill = "";
let numberOfPeople = "";
let tipPercentage = "";

function calculateTip(bill, tipPercentage, numberOfPeople) {
  const tipAmount = ((bill * (tipPercentage / 100)) / numberOfPeople).toFixed(
    2
  );
  const totalAmount = (bill / numberOfPeople + parseFloat(tipAmount)).toFixed(
    2
  );

  return { tipAmount, totalAmount };
}

function validateInput(input) {
  if (input && parseFloat(input) > 0) {
    return true;
  }
  return false;
}

// Function to validate multiple parameters and stop on first failure using for...of
function validateAllInputs(...inputs) {
  for (const input of inputs) {
    if (!validateInput(input)) {
      return false; // Return false immediately if any input fails validation
    }
  }
  return true; // Return true if all inputs pass validation
}

function toggleDisplayError(
  inputValue,
  errorMessageElement,
  inputFieldElement
) {
  if (!validateInput(inputValue)) {
    errorMessageElement.classList.remove("hidden");
    errorMessageElement.classList.add("visible");
    inputFieldElement.classList.add("calculator-input--error");
    emptyCalculationResult();
  } else {
    enableResetButton();
    errorMessageElement.classList.remove("visible");
    errorMessageElement.classList.add("hidden");
    inputFieldElement.classList.remove("calculator-input--error");
  }
}

function validateAndCalculate(bill, tipPercentage, numberOfPeople) {
  if (validateAllInputs(bill, tipPercentage, numberOfPeople)) {
    const result = calculateTip(bill, tipPercentage, numberOfPeople);

    showCalculationResult(result);
  }
}

function preventDecimalInput(e) {
  let value = e.target.value;
  value = value.split(".")[0]; // prevent decimal input
  e.target.value = value;
  return e;
}

billInputElement.addEventListener("input", function (e) {
  bill = handleInputChange(e);

  toggleDisplayError(bill, billErrorElement, billInputElement);
  validateAndCalculate(bill, tipPercentage, numberOfPeople);
});

peopleInputElement.addEventListener("input", function (e) {
  e = preventDecimalInput(e);
  numberOfPeople = handleInputChange(e);

  toggleDisplayError(numberOfPeople, peopleErrorElement, peopleInputElement);
  validateAndCalculate(bill, tipPercentage, numberOfPeople);
});

function handleInputChange(event) {
  return parseFloat(event.target.value);
}

function toggleCustomInputTip() {
  selectTipCustomRadioElement.classList.add("hidden");
  selectTipCustomRadioElement.classList.remove("visible");

  selectTipCustomContainerElement.classList.toggle("hidden");
  selectTipCustomContainerElement.classList.toggle("visible");
}

const tipErrorElement = document.querySelector(".calculator-input__tip-error");

function resetSelectTip() {
  selectTipCustomInputElement.value = "";
  selectTipCustomRadioElement.classList.remove("hidden");
  selectTipCustomRadioElement.classList.add("visible");
  selectTipCustomContainerElement.classList.remove("visible");
  selectTipCustomContainerElement.classList.add("hidden");
  tipErrorElement.classList.add("hidden");
  tipErrorElement.classList.remove("visible");
}

function handleRadioChange(event) {
  let value = event.target.value;
  if (value == "custom") {
    emptyCalculationResult();
    toggleCustomInputTip();
    selectTipCustomInputElement.addEventListener("input", function (e) {
      value = e.target.value;
      tipPercentage = parseFloat(value);

      if (!validateInput(value)) {
        emptyCalculationResult();
        tipErrorElement.classList.remove("hidden");
        tipErrorElement.classList.add("visible");
      } else {
        enableResetButton();
        if (validateAllInputs(bill, tipPercentage, numberOfPeople)) {
          const result = calculateTip(bill, tipPercentage, numberOfPeople);
          tipErrorElement.classList.add("hidden");
          tipErrorElement.classList.remove("visible");
          showCalculationResult(result);
        }
      }
    });
  } else {
    enableResetButton();
    resetSelectTip();
    const selectedValue = parseFloat(value);
    tipPercentage = selectedValue;

    if (validateAllInputs(bill, tipPercentage, numberOfPeople)) {
      const result = calculateTip(bill, tipPercentage, numberOfPeople);

      showCalculationResult(result);
    }
  }
}

selectTipElement.forEach((option) => {
  option.addEventListener("change", handleRadioChange);
});

const tipAmountElement = document.querySelector(
  ".calculator-result__tip__amount"
);

const totalAmountElement = document.querySelector(
  ".calculator-result__total__amount"
);

function showCalculationResult(result) {
  let resultTip = 0;
  let resultTotal = 0;
  if (
    result.tipAmount &&
    result.totalAmount &&
    !isNaN(result.totalAmount) &&
    !isNaN(result.tipAmount)
  ) {
    resultTip = result.tipAmount;
    resultTotal = result.totalAmount;
  }
  tipAmountElement.textContent = "$" + resultTip;
  totalAmountElement.textContent = "$" + resultTotal;
}

function emptyCalculationResult() {
  bill = 0;
  tipPercentage = 0;
  numberOfPeople = 0;
  result = calculateTip(bill, tipPercentage, numberOfPeople);
  showCalculationResult(result);
}

const resetButton = document.querySelector(".calculator-result__button");

function resetCalculator(...inputElements) {
  for (let el of inputElements) {
    if (el instanceof NodeList) {
      for (let option of el) {
        option.checked = false;
      }
    } else {
      el.value = "";
    }
  }

  emptyCalculationResult();
}

resetButton.addEventListener("click", function () {
  resetCalculator(
    billInputElement,
    selectTipElement,
    peopleInputElement,
    selectTipCustomInputElement
  );
  resetSelectTip();
  disableResetButton();
});

function disableResetButton() {
  resetButton.classList.add("calculator-result__button--disabled");
  resetButton.setAttribute("disabled", "true");
}

function enableResetButton() {
  resetButton.classList.remove("calculator-result__button--disabled");
  resetButton.removeAttribute("disabled");
}
