function calculateTip(bill, tipPercentage, numberOfPeople) {
  const tipAmount = ((bill * (tipPercentage / 100)) / 5).toFixed(2);

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

let bill = "";
let numberOfPeople = "";
let tipPercentage = "";

billInputElement.addEventListener("input", function (e) {
  bill = handleInputChange(e);
  billErrorElement = document.querySelector(
    ".calculator-input__bill-error"
  );


  if (!validateInput(bill)) {
    billErrorElement.classList.remove("hidden");
    billErrorElement.classList.add("visible");
    billInputElement.classList.add("calculator-input--error")

    return;
  } else {
    billErrorElement.classList.remove("visible");
    billErrorElement.classList.add("hidden");
    billInputElement.classList.remove("calculator-input--error")
  }
  if (validateAllInputs(bill, tipPercentage, numberOfPeople)) {
    const result = calculateTip(bill, tipPercentage, numberOfPeople);

    showCalculationResult(result);
  }
});

peopleInputElement.addEventListener("input", function (e) {
  numberOfPeople = handleInputChange(e);

  const peopleErrorElement = document.querySelector(
    ".calculator-input__people-error"
  );

  if (!validateInput(numberOfPeople)) {
    peopleErrorElement.classList.remove("hidden");
    peopleErrorElement.classList.add("visible");
    peopleInputElement.classList.add("calculator-input--error")

    return;
  } else {
    peopleErrorElement.classList.remove("visible");
    peopleErrorElement.classList.add("hidden");
    peopleErrorElement.classList.remove("calculator-input--error")
  }
  if (validateAllInputs(bill, tipPercentage, numberOfPeople)) {
    const result = calculateTip(bill, tipPercentage, numberOfPeople);

    showCalculationResult(result);
  }
});

function handleInputChange(event) {
  return parseFloat(event.target.value);
}

function handleRadioChange(event) {
  const selectedValue = parseFloat(event.target.value);

  tipPercentage = selectedValue;

  if (validateAllInputs(bill, tipPercentage, numberOfPeople)) {
    const result = calculateTip(bill, tipPercentage, numberOfPeople);

    showCalculationResult(result);
  }
}

selectTipElement.forEach((option) => {
  option.addEventListener("change", handleRadioChange);
});

function showCalculationResult(result) {
  const tipAmountElement = document.querySelector(
    ".calculator-result__tip__amount"
  );
  tipAmountElement.textContent = "$" + result.tipAmount;

  const totalAmountElement = document.querySelector(
    ".calculator-result__total__amount"
  );
  totalAmountElement.textContent = "$" + result.totalAmount;
}
