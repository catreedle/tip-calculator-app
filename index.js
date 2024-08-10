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

function resetCalculator() {}

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

let bill = "";
let numberOfPeople = "";
let tipPercentage = "";

billInputElement.addEventListener("input", function (e) {
  bill = handleInputChange(e);
  const billErrorElement = document.querySelector(
    ".calculator-input__bill-error"
  );

  if (!validateInput(bill)) {
    billErrorElement.classList.remove("hidden");
    billErrorElement.classList.add("visible");
    billInputElement.classList.add("calculator-input--error");
    emptyCalulationResult();

    return;
  } else {
    billErrorElement.classList.remove("visible");
    billErrorElement.classList.add("hidden");
    billInputElement.classList.remove("calculator-input--error");
  }
  if (validateAllInputs(bill, tipPercentage, numberOfPeople)) {
    const result = calculateTip(bill, tipPercentage, numberOfPeople);

    showCalculationResult(result);
  }
});

peopleInputElement.addEventListener("input", function (e) {
  let value = e.target.value;
  value = value.split(".")[0]; // prevent decimal input
  e.target.value = value;
  numberOfPeople = handleInputChange(e);

  const peopleErrorElement = document.querySelector(
    ".calculator-input__people-error"
  );

  if (!validateInput(numberOfPeople)) {
    peopleErrorElement.classList.remove("hidden");
    peopleErrorElement.classList.add("visible");
    peopleInputElement.classList.add("calculator-input--error");
    emptyCalulationResult();

    return;
  } else {
    peopleErrorElement.classList.remove("visible");
    peopleErrorElement.classList.add("hidden");
    peopleErrorElement.classList.remove("calculator-input--error");
  }
  if (validateAllInputs(bill, tipPercentage, numberOfPeople)) {
    const result = calculateTip(bill, tipPercentage, numberOfPeople);

    showCalculationResult(result);
  }
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

function handleRadioChange(event) {
  let value = event.target.value;
  if (value == "custom") {
    emptyCalulationResult();
    toggleCustomInputTip();
    selectTipCustomInputElement.addEventListener("input", function (e) {
      value = e.target.value;
      tipPercentage = parseFloat(value);

      if (!validateInput(value)) {
        emptyCalulationResult();
        tipErrorElement.classList.remove("hidden");
        tipErrorElement.classList.add("visible");
      }

      if (validateAllInputs(bill, tipPercentage, numberOfPeople)) {
        const result = calculateTip(bill, tipPercentage, numberOfPeople);
        tipErrorElement.classList.add("hidden");
        tipErrorElement.classList.remove("visible");
        showCalculationResult(result);
      }
    });
  } else {
    selectTipCustomRadioElement.classList.remove("hidden");
    selectTipCustomRadioElement.classList.add("visible");
    selectTipCustomContainerElement.classList.remove("visible");
    selectTipCustomContainerElement.classList.add("hidden");
    tipErrorElement.classList.add("hidden");
    tipErrorElement.classList.remove("visible");

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
  tipAmountElement.textContent = "$" + result.tipAmount;

  totalAmountElement.textContent = "$" + result.totalAmount;
}

function emptyCalulationResult() {
  tipAmountElement.textContent = "";
  totalAmountElement.textContent = "";
}
