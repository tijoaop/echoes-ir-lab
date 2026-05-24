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
        addInject("L1 Analyst", "Sinceramente, achei que ele só estava fazendo hora extra ou adiantando uma demanda do banco de dados de madrugada. Não chequei o DLP.");
        printTerm("Dica: Confiar em intenções é falho. Analise os rastros de dados com os comandos: query db_audit e query dlp.", 'sys');
    }
    if (action === 'escalate_crisis') {
        document.getElementById('action-feed').innerHTML = `
            <div class="hypothesis-box" style="border-color: var(--accent-green)">
                <strong style="color: var(--accent-green)">CRÍTICO: Shadow Investigation Iniciada</strong>
                <p style="margin-top: 5px;">Você correlacionou o acesso anômalo (UEBA), a extração massiva (DB_Audit) e a exfiltração externa (DLP) para o Dropbox do funcionário em processo de desligamento.</p>
                <p style="margin-top: 10px;"><strong>Ação Tomada:</strong> Em vez de um bloqueio bruto que o alertaria, o comitê acionou a perícia para espelhar a máquina remotamente e revogou os acessos críticos de forma granular, garantindo a cadeia de custódia para um processo legal contra o ex-colaborador.</p>
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
