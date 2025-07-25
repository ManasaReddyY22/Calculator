// Modern Calculator JS
// Handles UI, logic, theme, sound, animation, and input validation

document.addEventListener('DOMContentLoaded', function () {
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('.btn');
    const themeToggle = document.getElementById('theme-toggle');
    const clickSound = document.getElementById('click-sound');
    const historyDiv = document.getElementById('history');
    let currentInput = '';
    let history = [];
    let resultJustShown = false;
    let darkMode = false;

    // Play click sound
    function playSound() {
        if (clickSound) {
            clickSound.currentTime = 0;
            clickSound.play();
        }
    }

    // Update display
    function updateDisplay(val) {
        display.textContent = val || '0';
    }

    // Update history
    function updateHistory() {
        historyDiv.innerHTML = history.slice(-5).map(h => `<div>${h}</div>`).join('');
    }

    // Animate result
    function animateResult() {
        display.classList.add('result-animate');
        setTimeout(() => display.classList.remove('result-animate'), 400);
    }

    // Input handler
    function handleInput(value) {
        playSound();
        if (value === 'C') {
            currentInput = '';
            updateDisplay('0');
            resultJustShown = false;
            return;
        }
        if (value === '←') {
            if (resultJustShown) {
                currentInput = '';
                resultJustShown = false;
            } else {
                currentInput = currentInput.slice(0, -1);
            }
            updateDisplay(currentInput);
            return;
        }
        if (value === '=') {
            try {
                let expression = currentInput.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
                if (/[^0-9+\-*/%.() ]/.test(expression)) return;
                let evalResult = eval(expression);
                if (evalResult === undefined) return;
                evalResult = +evalResult.toFixed(10);
                history.push(currentInput + ' = ' + evalResult);
                updateHistory();
                updateDisplay(evalResult);
                animateResult();
                currentInput = evalResult.toString();
                resultJustShown = true;
            } catch {
                updateDisplay('Error');
                currentInput = '';
                resultJustShown = false;
            }
            return;
        }
        // Prevent multiple dots in a number
        if (value === '.') {
            const parts = currentInput.split(/[-+×÷*/]/);
            const last = parts[parts.length - 1];
            if (last.includes('.')) return;
        }
        // Prevent two operators in a row
        if ('+-×÷*/'.includes(value)) {
            if (currentInput === '' && value !== '-') return;
            if ('+-×÷*/'.includes(currentInput.slice(-1))) {
                currentInput = currentInput.slice(0, -1) + value;
                updateDisplay(currentInput);
                return;
            }
        }
        if (resultJustShown && !'+-×÷*/%'.includes(value)) {
            currentInput = '';
            resultJustShown = false;
        }
        currentInput += value;
        updateDisplay(currentInput);
    }

    // Button click
    buttons.forEach(btn => {
        btn.addEventListener('click', e => {
            handleInput(btn.getAttribute('data-value'));
        });
    });

    // Keyboard support
    document.addEventListener('keydown', e => {
        const keyMap = {
            'Enter': '=',
            '=': '=',
            'Backspace': '←',
            'Delete': 'C',
            '/': '/',
            '*': '*',
            '-': '-',
            '+': '+',
            '.': '.',
            '%': '%'
        };
        if (keyMap[e.key]) {
            handleInput(keyMap[e.key]);
        } else if (/^[0-9]$/.test(e.key)) {
            handleInput(e.key);
        }
    });

    // Theme toggle
    themeToggle.addEventListener('click', () => {
        darkMode = !darkMode;
        document.body.classList.toggle('dark', darkMode);
        themeToggle.textContent = darkMode ? '☀️' : '🌙';
    });

    // Animation CSS
    const style = document.createElement('style');
    style.textContent = `.result-animate { animation: bounce 0.4s; }
    @keyframes bounce { 0% { transform: scale(1); } 30% { transform: scale(1.15); } 60% { transform: scale(0.95); } 100% { transform: scale(1); } }`;
    document.head.appendChild(style);

    // Initial
    updateDisplay('0');
    updateHistory();
}); 