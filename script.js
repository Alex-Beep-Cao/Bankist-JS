'use strict';

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

const eurToUsd = 1.1;

const displayMovement = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const moves = sort ? movements.slice().sort((a, b) => a - b) : movements;
  //.textContent = 0
  moves.forEach(function (movement, i, arr) {
    const type = movement > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>

          <div class="movements__value">${movement}€</div>
      </div> `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// displayMovement(account1.movements);

const calcPrintBalance = function (account) {
  const balance = account.movements.reduce(function (acc, cur) {
    return acc + cur;
  }, 0);
  account.balance = balance;

  labelBalance.textContent = `${account.balance}€`;
};
// calcPrintBalance(account1.movements);

const calcsummary = function (account) {
  const income = account.movements
    .filter(function (move) {
      return move > 0;
    })

    .reduce(function (acc, cur) {
      return acc + cur;
    }, 0);

  labelSumIn.textContent = `${income}€`;

  const outcome = account.movements
    .filter(move => move < 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = `${Math.abs(outcome)}€`;

  const insterest = account.movements
    .filter(move => move >= 0)
    .map(deposite => deposite * account.interestRate)
    .filter(inst => inst >= 1)
    .reduce((acc, inst) => acc + inst, 0);
  labelSumInterest.textContent = `${insterest}€`;
};

// to create username in the object account
const createUserName = function (accounts) {
  accounts.forEach(function (account) {
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(function (name) {
        return name[0];
      })
      .join('');
  });

  //return account.username;
};

const updateUI = function (currentAccount) {
  // Display Movements
  displayMovement(currentAccount.movements);

  // Display the balance
  calcPrintBalance(currentAccount);

  // Display summary
  calcsummary(currentAccount);
};
//const user = 'Steven Thomas Williams'; //stw
createUserName(accounts);
console.log(accounts);

//Event handle
let currentAccount = '';
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  // console.log('logIn');
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  // console.log(currentAccount);
  // CurrentAccount ?.pin means check do we have is current Account first ! and then chenck the pin
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI
    containerApp.style.opacity = 100;
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();

    // Display message
    labelWelcome.textContent = `Welcome Back, ${
      currentAccount.owner.split(' ')[0]
    }!😃`;
  }

  // // Display Movements
  // displayMovement(currentAccount.movements);

  // // Display the balance
  // calcPrintBalance(currentAccount);

  // // Display summary
  // calcsummary(currentAccount);

  //three in one function
  updateUI(currentAccount);
});

//Event handle
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const userTo = accounts.find(acc => acc.username === inputTransferTo.value);
  // console.log(amount, userTo);
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    userTo &&
    currentAccount.balance >= amount &&
    userTo?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    userTo.movements.push(amount);
    // Udpdate UI
    updateUI(currentAccount);
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  // console.log('hello');
  const aimUser = inputCloseUsername.value;
  const aimPin = inputClosePin.value;
  if (
    aimUser &&
    currentAccount.username === aimUser &&
    currentAccount.pin === Number(aimPin)
  ) {
    const index = accounts.findIndex(element => element.username === aimUser);
    // console.log(index);
    //delete the account
    accounts.splice(index, 1);
    // console.log(accounts);
    // update the UI
    containerApp.style.opacity = 0;
    labelWelcome.textContent = ` Sorry you don't have account anymore 🤷‍♀️`;
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  // console.log('helo');
  const loanAmount = Number(inputLoanAmount.value);
  //inputLoanAmount.textContent = '';
  if (
    loanAmount > 0 &&
    currentAccount.movements.some(mov => mov >= 0.1 * loanAmount)
  ) {
    currentAccount.movements.push(loanAmount);
    // update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});
let state = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovement(currentAccount.movements, !state);
  state = !state;

  // updateUI(currentAccount);
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// let arr = ['a', 'b', 'c', 'd', 'e', 'f'];
// console.log(arr.slice(2));
// console.log(arr.slice(2, 4));
// console.log(arr.slice(-2));
// // if negtive index, remember from left to right
// console.log(arr.slice(-3, -1));
// //slice can create sollow copy
// // And ... opearte can also create sollow copy

// console.log(arr.slice());
// console.log([...arr]);

// // Splice -> will mutute the orginal array
// arr.splice(-1); //remove the last element and also change the orginal arr

// // means index 1 and number of element from index 1 and include index 1, to be delete
// arr.splice(1, 2);
// console.log(arr);

// //Reverse => mutate the orginal array !!!!
// const arr2 = ['f', 'i', 'r', '5', 't'];
// console.log(arr2.reverse());
// console.log(arr2);

// //Convat => convat arr and arr2
// const letters = arr.concat(arr2);
// // same like
// console.log([...arr, ...arr2]);
// console.log(letters);

// //Join
// console.log(letters.join('-'));

//shift The shift() method removes the first element from an array and returns that removed element. This method changes the length of the array.

// forEach
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`Movement: ${i + 1}: You deposited ${movement}`);
//   } else {
//     console.log(`You withdrew ${Math.abs(movement)}`);
//   }
// }

// console.log(`---------------Foreach-------------------`);

// movements.forEach(function (item, i, arr) {
//   if (item > 0) {
//     console.log(`Movement ${i + 1}You deposited ${item}`);
//   } else {
//     console.log(`You withdrew ${Math.abs(item)}`);
//   }
// });

// // Foreach Map and set
// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function (value, key, map) {
//   console.log(`${key} : ${value}`);
// });

// //set
// // remember new Set([]) need add '[]'!!!
// const currenciensUnique = new Set(['USD', 'EUR', 'GBP']);
// console.log(currenciensUnique);
// currenciensUnique.forEach(function (item, _, set) {
//   console.log(`${item}: ${item}`);
// });
// Set doesnt have the key !!!

// calcsummary(account1.movements);

// Code chanllange #1
// const checkDogs = function (arr1, arr2) {
//   const arr1Correct = arr1.slice();
//   arr1Correct.splice(0, 1);
//   arr1Correct.splice(-2);
//   const arr = [...arr1Correct, ...arr2];
//   console.log(arr);
//   arr.forEach(function (age, i) {
//     console.log(i);
//     const ageRange = age >= 3 ? 'an adult' : ' still a puppy';
//     console.log(`Dog number ${i + 1} is ${ageRange} `);
//   });
// };

// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);

// Data transformation  map, filter, reduce
//Map： take a array and create a new array

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const eurToUsd = 1.1;
// const moveUsd = movements.map(function (item) {
//   return item * eurToUsd;
// });
// console.log(moveUsd);
// // arrow way to write map function
// const moveUSD = movements.map(item => item * eurToUsd);

// const movUSD = [];
// for (const mov of movements) {
//   movUSD.push(mov * eurToUsd);
// }
// console.log(movUSD);

// // map can access index
// movements.map(function (item, index, arr) {
//   //.....same with forEach !!!
// });

////Filter: filter from the orgial array and return a new array
// const deposit = movements.filter(function (mov) {
//   // pass a boolean value and will return a new array
//   return mov > 0;
// });
// console.log(deposit);

// const withdrawals = movements.filter(function (move) {
//   return move < 0;
// });
// console.log(withdrawals);
// //Reduce: bils all array element and down to single value

// const balance = movements.reduce(function (acc, mov, index, arry) {
//   console.log(`${index}:${acc}`);
//   return acc + mov;
// }, 0); //0 is start num

// console.log(balance);

// // Max if movement array
// const max = movements.reduce(function (acc, cur) {
//   if (acc > cur) return acc;
//   else return cur;
// }, movements[0]);
// console.log(max);

//challange #2
// const calcAverageHumanAge = function (ages) {
//   const humansAges = ages.map(function (age) {
//     if (age <= 2) {
//       return 2 * age;
//     }
//     return 16 + age * 4;
//   });
//   const adult = humansAges.filter(function (age) {
//     return age >= 18;
//   });

//   const avgAges =
//     adult.reduce(function (acc, cur) {
//       return acc + cur;
//     }, 0) / adult.length;

//   return avgAges;
// };
// console.log(calcAverageHumanAge([2, 15, 38]));
// calcAverageHumanAge([2, 2, 2]);
//const caAvg = function (ages) {
//   const hum = ages.map(age => (age <= 2 ? age * 2 : 16 + age * 4));
//   console.log(hum);
// };
// caAvg([2, 2, 2, 5]);

// const calcAverageHumanAge = function (ages) {
//   const humanAges = ages.map(function (age) {
//     return age <= 2 ? age * 2 : 16 + age * 4;
//   });
// };
// console.log(calcAverageHumanAge([2, 2, 2, 5]));

// code challange #3

// const calcHA = arr =>
//   arr
//     .map(age => (age <= 2 ? age * 2 : 16 + age * 4))
//     .filter(age => age >= 18)
//     .reduce((acc, cur, i, result) => acc + cur / result.length, 0);

// console.log(calcHA([5, 2, 4, 1, 15, 8, 3]));

//Find method => return the first element match the condition
// const findM = movements.find(function (move) {
//   return move < 0;
// });
// console.log(findM);

// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);

// findindex method will give you the first match element index
// const acc = [1, 2, 3, 4, 5, 6];
// // const index = acc.findIndex(function (ele) {
// //   return ele === 5;
// // });
// const index = acc.findIndex(ele => ele === 5);
// console.log(index);
// acc.splice(index, 1);
// console.log(acc);

// // Some method return true or false
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// // call back function and need to return
// // if one element match the condition will return true
// const anyDeposity = movements.some(mov => mov >= 3000);

// Every method, every ele match the codition will return true otherwise will return false

//flat() method (not call back function)
// const array = [1, 2, 3, [4, 5]];
// // make array to one 1d array but only flat 1 level deep
// //flat(1) 1 level deep, flat(2) 2 level deep
// console.log(array.flat());
// const arrayDeep = [1, [2, 3], [[4], 5]];

// const accountMovements = accounts.map(acc => acc.movements);
// console.log(accountMovements);
// // need to flat the accountMovement array
// const alMovements = accountMovements.flat();
// console.log(alMovements);
// const sumMovements = alMovements.reduce((acc, cur) => acc + cur, 0);
// console.log(sumMovements);
// // if we want to do it in one setp we can use chain or flatmap
// // flatMap is same like map , and flatMap only flat 1 deep

// // String
// //sort only working on string !! and will change orginal array
// const owner = ['Jonas', 'Zach', 'Alex'];
// console.log(owner.sort());
// console.log(owner);

// Number
// sort() not working on numbers will change ele to strign first
// if want to sort number using callback function
//return < 0 A,B (keep order)
// return >0 B, A(switch order)
// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (a < b) return -1;
// });
// console.log(movements);
// from small to big
// movements.sort((a, b) => a - b);
// console.log(movements);
// // b-a big to small

// More way to filling array
// console.log([1, 2, 3, 4, 5]);
// console.log(new Array(1, 2, 3, 4, 5));

// // array constraction  will create length 7 and empty array
// //empty array + fill method
// const x = new Array(7);
// // only can call method .fill will change orgial array
// // x.fill(1);
// // fill 1 from index 3 to 5
// x.fill(1, 3, 5);
// console.log(x);
// // array.from
// const y = Array.from({ length: 7 }, () => 1);
// console.log(y);
// const z = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(z);

// labelBalance.addEventListener('click', function () {
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value'),
//     // maping call back function content
//     ele => Number(ele.textContent.replace('€', ''))
//   );
//   console.log(movementsUI);
// });

// Array method
//1.
// const bankdepositeSum = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .filter(mov => mov > 0)
//   .reduce((sum, cur) => sum + cur, 0);
// console.log(bankdepositeSum);

//2.
// const numdeposite1000 = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov >= 1000).length;
// console.log(numdeposite1000);

// const numdeposite1000 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((count, cur) => (cur >= 1000 ? count + 1 : count), 0);
// console.log(numdeposite1000);

// // 3. object !!! reduce method

// const { de, withqq } = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (sums, cur) => {
//       cur > 0 ? (sums.de += cur) : (sums.with += cur);
//       return sums;
//     },
//     { de: 0, withqq: 0 }
//   );
// // console.log(sums);

// console.log(de, withqq);

// set obeject value
// objectname[variable] = ....
