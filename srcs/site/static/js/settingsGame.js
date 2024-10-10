// settingsGame.js

const MIN_PLAYERS = 2;
const VERSUS_MAX = 4;
const TOURNAMENT_MAX = 10;
const LASTMANSTANDING_MAX = 4;
const BRICKBREAKER_MAX = 4;

document.getElementById('mode').addEventListener('change', updateOptions);
document.getElementById('addPlayer').addEventListener('click', addPlayer);
document.getElementById('removePlayer').addEventListener('click', removePlayer);
document.getElementById('maxScore').addEventListener('input', () => {
    document.getElementById('maxScoreValue').textContent = document.getElementById('maxScore').value;
});
document.getElementById('paddleSpeed').addEventListener('input', () => {
    document.getElementById('paddleSpeedValue').textContent = document.getElementById('paddleSpeed').value;
});
document.getElementById('paddleSize').addEventListener('input', () => {
    document.getElementById('paddleSizeValue').textContent = document.getElementById('paddleSize').value;
});
document.getElementById('ballSpeed').addEventListener('input', () => {
    document.getElementById('ballSpeedValue').textContent = document.getElementById('ballSpeed').value;
});
document.getElementById('ballAcceleration').addEventListener('input', () => {
    document.getElementById('ballAccelerationValue').textContent = document.getElementById('ballAcceleration').value;
});
document.getElementById('numBalls').addEventListener('input', () => {
    document.getElementById('numBallsValue').textContent = document.getElementById('numBalls').value;
});
document.getElementById('map').addEventListener('input', () => {
    document.getElementById('mapValue').textContent = document.getElementById('map').value;
});

function updateOptions() {
    const mode = document.getElementById('mode').value;
    const maxScoreField = document.getElementById('maxScore');
    document.getElementById('player-controls-wrapper').innerHTML = '';
    document.getElementById('player-key-wrapper').innerHTML = '';

    let initialPlayers = MIN_PLAYERS;
    let maxPlayers = getMaxPlayersForMode(mode);

    if (mode === 'brickBreaker') {
        maxScoreField.disabled = true;
        document.getElementById('maxScoreValue').textContent = 'N/A';
    } else {
        maxScoreField.disabled = false;
        document.getElementById('maxScoreValue').textContent = maxScoreField.value;
    }

    let numberOfControls = mode === 'tournament' ? 2 : initialPlayers;
    for (let i = 0; i < numberOfControls; i++) {
        addPlayerField(i);
    }

    updateAddPlayerButton();
    updateRemovePlayerButton();
}

function getPlayersToAddOrRemove(mode) {
    return (mode === 'versus' || mode === 'brickBreaker') ? 2 : 1;
}

function addPlayer() {
    const mode = document.getElementById('mode').value;
    const maxPlayers = getMaxPlayersForMode(mode);
    const playerFields = document.getElementsByClassName('player-control');

    let toAdd = getPlayersToAddOrRemove(mode);
    const currentPlayers = playerFields.length;
    for (let i = 0; i < toAdd; i++) {
        if (currentPlayers + i < maxPlayers) {
            addPlayerField(currentPlayers + i);
        }
    }

    updateAddPlayerButton();
    updateRemovePlayerButton();
}

function removePlayer() {
    const mode = document.getElementById('mode').value;
    const playerFields = document.getElementsByClassName('player-control');
    const keyFields = document.getElementsByClassName('player-controls');

    let toRemove = getPlayersToAddOrRemove(mode);

    for (let i = 0; i < toRemove; i++) {
        if (playerFields.length > MIN_PLAYERS) {
            playerFields[playerFields.length - 1].remove();
            if (mode !== 'tournament') {
                keyFields[keyFields.length - 1].remove();
            }
        }
    }

    updateAddPlayerButton();
    updateRemovePlayerButton();
}

function addPlayerField(index) {
    const controlsWrapper = document.getElementById('player-controls-wrapper');
    const keyWrapper = document.getElementById('player-key-wrapper');
    const divPlayer = document.createElement('div');
    const divKeys = document.createElement('div');

    divPlayer.classList.add('player-control');
    divPlayer.innerHTML = `
        <label>Player ${index + 1} Name:</label>
        <input type="text" id="player${index}" placeholder="Enter player name"><br>
    `;
    controlsWrapper.appendChild(divPlayer);

    const mode = document.getElementById('mode').value;
    if (mode !== 'tournament' || index < 2) {
        divKeys.classList.add('player-controls');
        divKeys.innerHTML = `
            <label>Up Key for Player ${index + 1}:</label>
            <input type="text" id="player${index}Up" placeholder="Enter Up key"><br>
            <label>Down Key for Player ${index + 1}:</label>
            <input type="text" id="player${index}Down" placeholder="Enter Down key"><br>
        `;
        keyWrapper.appendChild(divKeys);
    }
}

function updateAddPlayerButton() {
    const mode = document.getElementById('mode').value;
    const maxPlayers = getMaxPlayersForMode(mode);
    const playerFields = document.getElementsByClassName('player-control');

    if (playerFields.length >= maxPlayers) {
        document.getElementById('addPlayer').style.display = 'none';
    } else {
        document.getElementById('addPlayer').style.display = 'inline';
    }
}

function updateRemovePlayerButton() {
    const playerFields = document.getElementsByClassName('player-control');
    if (playerFields.length <= MIN_PLAYERS) {
        document.getElementById('removePlayer').style.display = 'none';
    } else {
        document.getElementById('removePlayer').style.display = 'inline';
    }
}

function getMaxPlayersForMode(mode) {
    switch (mode) {
        case 'versus':
        case 'brickBreaker':
            return VERSUS_MAX;
        case 'tournament':
            return TOURNAMENT_MAX;
        case 'lastManStanding':
            return LASTMANSTANDING_MAX;
        default:
            return 4;
    }
}

updateOptions();

document.getElementById('startGame').addEventListener('click', () => {
    const mode = document.getElementById('mode').value;
    const playerFields = document.getElementsByClassName('player-control');

    let allFieldsValid = true;
    for (let i = 0; i < playerFields.length; i++) {
        const playerName = document.getElementById(`player${i}`).value.trim();

        // Vérifier les touches seulement pour les deux premiers joueurs (Player 1 et Player 2)
        if (i < 2) {
            const upKey = document.getElementById(`player${i}Up`).value.trim();
            const downKey = document.getElementById(`player${i}Down`).value.trim();
            if (!playerName || !upKey || !downKey) {
                allFieldsValid = false;
                alert(`Player ${i + 1} must have a name and keys assigned!`);
                break;
            }
        } else {
            // Pour les joueurs supplémentaires, vérifier uniquement le nom du joueur
            if (!playerName) {
                allFieldsValid = false;
                alert(`Player ${i + 1} must have a name!`);
                break;
            }
        }
    }

    if (allFieldsValid) {
        const playerNames = [];
        const playerKeys = [];
        for (let i = 0; i < playerFields.length; i++) {
            const playerName = document.getElementById(`player${i}`).value;

            if (i < 2) {
                const upKey = document.getElementById(`player${i}Up`).value;
                const downKey = document.getElementById(`player${i}Down`).value;
                playerKeys.push([upKey, downKey]);
            } else {
                playerKeys.push([null, null]);  // Ajouter des valeurs null pour les joueurs sans touches
            }
            playerNames.push(playerName);
        }

        const maxScore = document.getElementById('maxScore').value;
        const paddleSpeed = document.getElementById('paddleSpeed').value;
        const paddleSize = document.getElementById('paddleSize').value;
        const bounceMode = document.getElementById('bounceMode').checked;
        const ballSpeed = document.getElementById('ballSpeed').value;
        const ballAcceleration = document.getElementById('ballAcceleration').value;
        const numBalls = document.getElementById('numBalls').value;
        const map = document.getElementById('map').value;

        localStorage.setItem('gameOptions', JSON.stringify({
            mode, playerNames, playerKeys, maxScore, paddleSpeed, paddleSize, bounceMode, ballSpeed, ballAcceleration, numBalls, map
        }));

        window.location.href = 'game.html';
    }
});

function resetToDefault() {
    document.getElementById('maxScore').value = 10;
    document.getElementById('maxScoreValue').textContent = 10;

    document.getElementById('paddleSpeed').value = 5;
    document.getElementById('paddleSpeedValue').textContent = 5;

    document.getElementById('paddleSize').value = 100;
    document.getElementById('paddleSizeValue').textContent = 100;

    document.getElementById('bounceMode').checked = true;

    document.getElementById('ballSpeed').value = 5;
    document.getElementById('ballSpeedValue').textContent = 5;

    document.getElementById('ballAcceleration').value = 1;
    document.getElementById('ballAccelerationValue').textContent = 1;

    document.getElementById('numBalls').value = 1;
    document.getElementById('numBallsValue').textContent = 1;

    document.getElementById('map').value = 1;
    document.getElementById('mapValue').textContent = 1;
}

document.getElementById('defaultSetting').addEventListener('click', resetToDefault);
