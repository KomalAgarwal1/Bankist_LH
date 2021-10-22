'use strict';

// const { readSync } = require('fs');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
// //REVERSE- It mutates the original array and reverse it.
// const arr = [5, 4, 3, 2, 1];
// console.log(arr.reverse()); //[1, 2, 3, 4, 5]

// //CONCAT: It does not mutate the original array
// const arr2 = [6, 7, 8, 9];
// const numarr = arr.concat(arr2);
// console.log(numarr); //its same as below [1, 2, 3, 4, 5, 6, 7, 8, 9]

// console.log([...arr, ...arr2]); //[1, 2, 3, 4, 5, 6, 7, 8, 9]

// //JOIN method- results the array in string with the separator used
// console.log(arr.join('-')); //1-2-3-4-5

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const deposits = movements.filter(function (mov) {
//   return mov > 0;
// });

// const withdrawls = movements.filter(function (mov) {
//   return mov < -1;
// });

// //here acc is the SNOWBALL, which accumalate the result, cur is the current element in array

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  //taking copy of mvements array and use
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const displayBal = function (acc) {
  // console.log(acc.movements);
  acc.balance = acc.movements.reduce(function (acc, cur) {
    return acc + cur;
  }, 0);
  // console.log(acc.balance);
  labelBalance.textContent = `${acc.balance} €`;
}; //assiging initial value to acc variable

const calcDisplaySummary = function (acc) {
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumIn.textContent = `${income} €`;
  const outVal = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = `${outVal} €`;

  const interest = acc.movements
    .filter(int => int > 0)
    .map(int => (int * acc.interestRate) / 100)
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${interest} €`;
};

//Creating usernames
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

//Update UI
const updateUI = function (acc) {
  calcDisplaySummary(acc);

  displayBal(acc);

  displayMovements(acc.movements);
};

//Event handler
let currentAccount;

//FAKE LOGIN
currentAccount= account1;
updateUI(currentAccount);
containerApp.style.opacity=100;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  // console.log('login');
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
  }
  containerApp.style.opacity = 100;

  //Clear input fields
  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur();

  //Update UI
  updateUI(currentAccount);
});

//Transfers

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiver = accounts.find(acc => acc.username === inputTransferTo.value);
  console.log(amount, receiver);
  if (
    amount > 0 &&
    receiver &&
    currentAccount.username !== receiver.username &&
    currentAccount.balance >= amount
  ) {
    currentAccount.movements.push(-amount);
    receiver.movements.push(amount);
  }
  updateUI(currentAccount);
  inputTransferAmount.value = inputTransferTo.value = '';
});

//Loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amt = Number(inputLoanAmount.value);
  if (amt > 0 && currentAccount.movements.some(mov => mov >= amt * 0.1)) {
    currentAccount.movements.push(amt);
    updateUI(currentAccount);
  }

  inputLoanAmount.value = '';
});

//Close Account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    inputClosePin.value = inputCloseUsername.value = '';
    labelWelcome.textContent = `Login`;
    // console.log(index);
  }
});

//Sorting
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

// console.log(currentAccount);

// // console.log(balance);
// // let withdrawls1 = [];
// // movements.forEach(function (mov) {
// //   if (mov < 0) {
// //     withdrawls1.push(mov);
// //   }
// //   return withdrawls1;
// // });

// console.log(deposits);
// console.log(withdrawls);
// // console.log(withdrawls1);
// //Foreach
// movements.forEach(function (movement) {
//   if (movement > 0) console.log(`You added ${movement} amount to your account`);
//   else console.log(`You withdrew ${Math.abs(movement)} amount to your account`);
// });

//getting the index in forEach the order is callback func would be first should be the element, then index and then arr tha is being looped over
// movements.forEach(function (movement, index, arr) {
//   if (movement > 0)
//     console.log(
//       `Movement ${index + 1}: You added ${movement} amount to your account`
//     );
//   else
//     console.log(
//       `Movement ${index + 1}: You withdrew ${Math.abs(
//         movement
//       )} amount to your account`
//     );
// }); //op is Movement 1: You added 200 amount to your account
//script.js:102 Movement 2: You added 450 amount to your account

//MAP- it loops on map which is array of array and since it does not have index we have a key element used to get the details
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

// currencies.forEach(function (value, key, map) {
//   console.log(`${key}:${value}`);
// });

// //op is USD:United States dollar
// // script.js:116 EUR:Euro
// // script.js:116 GBP:Pound sterling

// // SET: We do not have any key or index here, so second param in forEach func is same as the value element of set:
// const currenciesSet = new Set(['USD', 'USD', 'EUR', 'AUD', 'EUR']);

// currenciesSet.forEach(function (value, _, set) {
//   console.log(`${value}:${value}`);
// });

// const dogsJulia = [3, 5, 2, 12, 7];
// const dogsKate = [4, 1, 15, 8, 3];

// const mergeArr = dogsJulia.concat(dogsKate);
// const checkDogs = function (dogJ, dogK) {
//   const dogShallow = dogJ.slice(1, -2);
//   const mergeArr = dogShallow.concat(dogK);
//   mergeArr.forEach(function (el, i) {
//     console.log(
//       `${el >= 3 ? 'Dog' : 'Puppy'} number ${i + 1} is ${
//         el >= 3 ? `adult and , is ${el} years old` : `still a puppy`
//       }`
//     );
//   });
// };

// checkDogs(dogsJulia, dogsKate);

// const calcAverageHumanAge1 = function (mergeArr) {
//   const humanAges = mergeArr.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
//   console.log(humanAges);

//   const adults = humanAges.filter(age => age >= 18);
//   console.log(adults);

//   const avg = adults.reduce((acc, age, i, arr) => acc + age / arr.length, 0);
//   return avg;
// };

// console.log(calcAverageHumanAge1([5, 2, 4, 1, 15, 8, 3]));

// //using arrow func and chaining
// const calcAverageHumanAge = mergeArr =>
//   mergeArr
//     .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
//     .filter(age => age >= 18)
//     .reduce((acc, age, i, arr) => acc + age / arr.length, 0);

// console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));

// console.log(ca);
// const newAge = mergeArr.map(function (dogAge) {
//   // console.log(dogAge);
//   if (dogAge <= 2) humanAge = 2 * dogAge;
//   else humanAge = 16 + dogAge * 4;
// });

// console.log(newAge);

// const user = 'Seteven William'; //sw

// console.log(accounts);

//find method

// const acc = accounts.find(acco => acco.owner === 'Sarah Smith');
// console.log(acc);

// for (const acc of accounts) {
//   if (acc.owner === 'Sarah Smith') console.log(acc);
//   // console.log(acc);
// }

// const allMove = accounts.map(acc => acc.movements).flat();
// const allMove = accounts.flatMap(acc => acc.movements);
// console.log(allMove);

// //2. Count how many movements are there with atleast 1000

// const newMov = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov >= 1000).length;

// console.log(newMov);

// const sums = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (sums, cur) => {
//       cur > 0 ? (sums.deposits += cur) : (sums.withdrawls += cur);
//       return sums;
//     },
//     { deposits: 0, withdrawls: 0 }
//   );

// console.log(sums);

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];
// console.log(...dogs);

dogs.forEach(function (el) {
  el.recommendedFood = Math.trunc(el.weight ** 0.75 * 28);
});
console.log(dogs);

const dogsSarah = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(
  `Sarah's dog is eating too ${
    dogsSarah.recommendedFood < dogsSarah.curFood ? 'much' : 'less'
  }`
);
// const moreOwners = dogs
//   .filter(dog => dog.recommendedFood < dog.curFood)
//   .flatMap(own => own.owners);
const moreOwners = [];
const lessOwners = [];
dogs.filter(dog =>
  dog.recommendedFood < dog.curFood
    ? moreOwners.push(dog.owners)
    : lessOwners.push(dog.owners)
);
console.log(moreOwners);
console.log(lessOwners);

console.log(dogs.some(dog => dog.recommendedFood === dog.curFood));

//current > (recommended * 0.90) && current < (recommended * 1.10)
console.log(
  dogs.some(
    dog =>
      dog.curFood > dog.recommendedFood * 0.9 &&
      dog.curFood < dog.recommendedFood * 1.1
  )
);

const okayDog = dogs.filter(
  dog =>
    dog.curFood > dog.recommendedFood * 0.9 &&
    dog.curFood < dog.recommendedFood * 1.1
);

console.log(okayDog);

//8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

const shallowDogs = dogs.slice();

shallowDogs.sort((a, b) => a.recommendedFood - b.recommendedFood);
console.log(shallowDogs);
