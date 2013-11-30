// CLABE Account Number Verifier
// by Juan C. Montemayor Elosua, 2013
//
// http://en.wikipedia.org/wiki/CLABE

var TestAccountValid = "032180000118359719"
var TestAccountInvalid = "032180000118379719" // <-- Typo

function getAccountArray(account) {
  var stringArray = account.split("");
  return stringArray.map(function(x){ return parseInt(x); });
}

function getControlDigit(account) {
  if (account.length != 18) {
    throw "account too short"
  }

  return account[17];
}

function dropControlDigit(account) {
  var rawAccount = []
  for (var i = 0; i < account.length-1; i++) {
    rawAccount[i] = account[i];
  }
  return rawAccount;
}

function getWeightForIndex(i) {
  if (i % 3 == 0) {
    return 3;
  }

  if (i % 3 == 1) {
    return 7;
  }

  if (i % 3 == 2) {
    return 1;
  }

  throw "Mod Error";
}

function multiplyByWeightAndModulo(account) {
  var weightedAccount = []
  for (var i = 0; i < account.length; i++) {
    weightedAccount[i] = (account[i] * getWeightForIndex(i)) % 10;
  }
  return weightedAccount;
}

function sumAllAndModulo(weightedAccount) {
  var sum = 0
  for (var i = 0; i < weightedAccount.length; i++) {
    sum += weightedAccount[i];
  }
  return sum % 10;
}

function generateControlDigit(sum) {
  return (10 - sum) % 10;
}

function main(accountStr) {
  var account = getAccountArray(accountStr);

  if (account.length != 18) {
    $('#validField').html("Muy pocos digitos. El numero de cuenta es invalido");
    return;
  }

  var controlDigit = getControlDigit(account);
  account = dropControlDigit(account);

  var weightedAccount = multiplyByWeightAndModulo(account);
  var sum = sumAllAndModulo(weightedAccount);
  var generatedControlDigit = generateControlDigit(sum);

  var validField = $('#validField')
  if (controlDigit != generatedControlDigit) {
    validField.html("OJO: El numero de cuenta es **invalido** bajo CLABE");
  } else {
    validField.html("El numero de cuenta es valido bajo CLABE");
  }
}

function validateClicked() {
  var accountNumber = $('#accountField').val();
  main(accountNumber);
}
