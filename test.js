const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

let lineNum = 0

let elementNum = 0
let stdArr = []

let testNum = 0
let testArr = []

let result = null
rl.on('line', data => {
  lineNum++
  if (lineNum == 1)
    elementNum = Number(data.trim())
  else if (lineNum == 2)
    stdArr = data.trim().split(' ')
  else if (lineNum == 3)
    testNum = Number(data.trim())
  else {
    testNum --
    testArr = data.trim().split(' ')
    console.log(handle(testArr)) 
    if (testNum == 0) {
      process.exit(0)
    }
  }

})

function handle(testArr) {
  let count = 0
  testArr.forEach(item => {
    if (stdArr.includes(item)){
      count++
    }
  })
  return count
}