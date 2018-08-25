exports.RollingDie = function (responseStr, callbackFunc) {
    dieNumber = Math.floor(Math.random() * 6) + 1;
    global.logManager.PrintLogMessage("GameManager", "RollingDie", "rolling die: " + dieNumber, global.defineManager.LOG_LEVEL_DEBUG)

    dieResultStr = global.util.format(responseStr, dieNumber)

    if(callbackFunc !== undefined) {
        callbackFunc(dieResultStr)
    }
}

exports.RockScissorsPaper = function (responseStr, callbackFunc) {

    randomResult = Math.floor(Math.random() * 3) + 1;

    switch (randomResult) {
        case global.defineManager.GAME_ROCK_SCISSORS_PAPER_PAPER:
            gameResultStr = global.util.format(responseStr, global.defineManager.GAME_ROCK_SCISSORS_PAPER_PAPER_STR)
            break;
        case global.defineManager.GAME_ROCK_SCISSORS_PAPER_ROCK:
            gameResultStr = global.util.format(responseStr, global.defineManager.GAME_ROCK_SCISSORS_PAPER_ROCK_STR)
            break;
        case global.defineManager.GAME_ROCK_SCISSORS_PAPER_SCISSORS:
            gameResultStr = global.util.format(responseStr, global.defineManager.GAME_ROCK_SCISSORS_PAPER_SCISSORS_STR)
            break;
        default:
            break;
    }

    global.logManager.PrintLogMessage("GameManager", "RockScissorsPaper", "random: " + randomResult + " str: " + gameResultStr, global.defineManager.LOG_LEVEL_DEBUG)

    if(callbackFunc !== undefined) {
        callbackFunc(gameResultStr)
    }
}