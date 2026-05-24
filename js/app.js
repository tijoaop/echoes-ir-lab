// Engine State
const state = {
    time: new Date(new Date().setHours(3, 14, 0)),
    evidenceCollected: new Set(),
    phase: 1
};

const DOM = {
    cmdInput: document.getElementById('cmd-input'),
    termOutput: document.getElementById('terminal-output'),
    injectFeed: document.getElementById('inject-feed'),
    evidenceGrid: document.getElementById('evidence-grid'),
    clock: document.getElementById('hud-clock'),
    btnEscalate: document.getElementById('btn-escalate')
};

function init() {
    renderInjects();
    DOM.cmdInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            const cmd = this.value.trim();
            if(cmd) processCommand(cmd);
            this.value = '';
        }
    });
}

function printTerm(text, type = 'sys') {
    const span = document.createElement('span');
    span.className = `log-${type}`;
    span.innerText = text;
    DOM.termOutput.appendChild(span);
    DOM.termOutput.scrollTop = DOM.termOutput.scrollHeight;
}

function processCommand(rawCmd) {
    printTerm(`root@soc:~# ${rawCmd}`, 'sys');
    const cmd = rawCmd.toLowerCase();

    if (activeScenario.logs[cmd]) {
        printTerm(activeScenario.logs[cmd], 'ok');
        advanceTime(3); 
        
        // Lógica de progressão narrativa
        if(cmd === 'query entra_id' && state.phase === 1) {
            setTimeout(() => addInject("DPO (Automático)", "Alerta de DLP: Base de dados sensível sendo acessada via Service Principal."), 2000);
            state.phase = 2;
        }
    } else if (cmd.startsWith("collect ")) {
        const ioc = cmd.split(" ")[1];
        addEvidence(ioc);
        printTerm(`Evidência [${ioc}] indexada no mural.`, 'ok');
    } else {
        printTerm(`bash: ${rawCmd}: command not found. Tente 'help'.`, 'err');
    }
}

function addEvidence(val) {
    if (state.evidenceCollected.has(val)) return;
    state.evidenceCollected.add(val);
    
    const div = document.createElement('div');
    div.className = 'ioc-card';
    div.innerHTML = `<div class="ioc-type">Artefato Tático</div><div class="ioc-val">${val}</div>`;
    DOM.evidenceGrid.appendChild(div);

    checkWinCondition();
}

function advanceTime(minutes) {
    state.time.setMinutes(state.time.getMinutes() + minutes);
    DOM.clock.innerText = state.time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

function addInject(sender, text) {
    const timeStr = state.time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const html = `
        <div class="inject-item">
            <div class="inject-time">${timeStr}</div>
            <div class="inject-sender">${sender}</div>
            <div class="inject-text">${text}</div>
        </div>
    `;
    DOM.injectFeed.insertAdjacentHTML('afterbegin', html);
}

function renderInjects() {
    activeScenario.injects.forEach(inj => {
        DOM.injectFeed.innerHTML += `
        <div class="inject-item">
            <div class="inject-time">${inj.time}</div>
            <div class="inject-sender">${inj.sender}</div>
            <div class="inject-text">${inj.text}</div>
        </div>`;
    });
}

function executeAction(action) {
    if (action === 'ask_l1') {
        advanceTime(5);
        addInject("L1 Analyst", "Verificamos o /health da API bridge. Retorna HTTP 200. Nenhuma flag de erro no AppInsights. Pra mim é falso positivo do proxy.");
        printTerm("Dica: L1 está confiando cegamente no APM. Tente cruzar logs de Entra ID com o tráfego do banco legado (query entra_id).", 'sys');
    }
    if (action === 'escalate_crisis') {
        document.getElementById('action-feed').innerHTML = `
            <div class="hypothesis-box" style="border-color: var(--accent-green)">
                <strong style="color: var(--accent-green)">CRÍTICO: Exfiltração Contida</strong>
                <p style="margin-top: 5px;">Você identificou o ataque de Cadeia de Suprimentos abusando da Workload Identity. O "200 OK" mascarava chamadas de banco extraindo tabelas.</p>
                <p style="margin-top: 10px;"><strong>Debriefing (Govern):</strong> O uso do Zero Trust exigia privilégio mínimo, mas a API legada tinha permissão SELECT *. Revise as políticas do Entra ID.</p>
            </div>`;
    }
}

function checkWinCondition() {
    const hasWinCondition = activeScenario.win_conditions.some(ioc => state.evidenceCollected.has(ioc));
    if (hasWinCondition) {
        DOM.btnEscalate.style.display = 'block';
        document.getElementById('hud-risk').innerText = "CRÍTICO (EXFILTRAÇÃO)";
    }
}

// Inicializa o laboratório
init();
