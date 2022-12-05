'use strict'

const EASY_DIFF = 16
const MEDIUM_DIFF = 25
const HARD_DIFF = 36

var gNums
var gCurrNum
var gCurrDiff = EASY_DIFF
var gTimerMs
var gTimerSeconds
var gTimerMinutes
var gGameTimerId

function onInit() {
    resetTimer()
    document.querySelector('h2 span').innerText = formatTimer()
    gNums = generateNums()
    renderBoard()
    gCurrNum = 1
    updateNextNum()
}

function generateNums() {
    const nums = []
    for (var i = 0; i < gCurrDiff; i++) {
        nums.push(i + 1)
    }
    return nums
}

function renderBoard() {
    var htmlStr = ''
    const length = Math.sqrt(gNums.length)
    for (var i = 0; i < length; i++) {
        htmlStr += `<tr>`
        for (var j = 0; j < length; j++) {
            const randomNum = getRandomNumFromArr(gNums)
            htmlStr += `<td onclick="onCellClicked(this)">${randomNum}</td>`
        }
        htmlStr += '</tr>'
    }

    const elTableBody = document.querySelector('table tbody')
    elTableBody.innerHTML = htmlStr
}

function getRandomNumFromArr(nums) {
    const randomIdx = getRandomInt(0, nums.length)
    return nums.splice(randomIdx, 1)
}

function updateNextNum() {
    const elH1Span = document.querySelector('h1 span')
    elH1Span.innerText = gCurrNum
}

function onCellClicked(elCell) {
    const cellNum = +elCell.innerText
    if(cellNum === 1) startTimer()
    if (cellNum === gCurrNum) {
        elCell.classList.add('correct')
        if(checkIfGameOver()) {
            stopTimer()
            showRestartTextOnBtns()
            return
        }
        gCurrNum++
        updateNextNum()
    }
}

function startTimer() {
    const elH2Span = document.querySelector('h2 span')
    gGameTimerId = setInterval(() => {
        gTimerMs += 10
        if(gTimerMs >= 1000){
            gTimerSeconds++
            gTimerMs = 0
        }
        if(gTimerSeconds >= 60){
            gTimerMinutes++
            gTimerSeconds = 0
        }
        elH2Span.innerText = formatTimer()
    }, 10);
}

function stopTimer(){
    if(gGameTimerId) clearInterval(gGameTimerId)
    gGameTimerId = null
}

function formatTimer() {
    return `${gTimerMinutes.toString().padStart(2, 0)}:${gTimerSeconds.toString().padStart(2, 0)}.${gTimerMs.toString().padEnd(3, 0)}`
}

function checkIfGameOver(){
    return gCurrNum === gCurrDiff
}

function onDiffSelected(elBtn){
    const difficulty = elBtn.dataset.difficulty
    if(difficulty === 'Hard'){
        gCurrDiff = HARD_DIFF
        onInit()
    } else if(difficulty === 'Medium') {
        gCurrDiff = MEDIUM_DIFF
        onInit()
    } else {
        gCurrDiff = EASY_DIFF
        onInit()
    }
    resetDiffBtns()
    elBtn.classList.add('active')
    resetTimer()
    stopTimer()
}

function resetDiffBtns(){
    const elBtns = document.querySelectorAll('div button')
    for(var i = 0; i < elBtns.length; i++){
        const elBtn = elBtns[i]
        const originalValue = elBtn.dataset.difficulty
        if(elBtn.innerText !== originalValue) elBtn.innerText = originalValue
        elBtn.classList.remove('active')
    }
}

function resetTimer(){
    gTimerMs = 0
    gTimerSeconds = 0
    gTimerMinutes = 0
}

function showRestartTextOnBtns(){
    const elBtns = document.querySelectorAll('div button')
    for(var i = 0; i < elBtns.length; i++){
        const elBtn = elBtns[i]
        elBtn.innerText = 'Restart'
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
}