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
    if (action === 'ask_manager') {
        advanceTime(45);
        addInject("Gestor Imediato", "Confidencial: O Castro tem estado estranhamente solícito ultimamente. Pediu proativamente para revisar carteiras antigas de investimentos que já não eram da alçada dele.");
        printTerm("Dica: Comportamento anômalo confirmado. Busque a materialidade técnica com 'query m365_audit' e 'query exchange'.", 'sys');
    }
    if (action === 'consult_legal') {
        advanceTime(60);
        addInject("Diretoria Jurídica", "DIRETRIZ CRÍTICA: Preservação imediata e silenciosa das evidências! Abstenção de ações de bloqueio brusco agora. Precisamos de cadeia de custódia compatível com foro trabalhista/cível. Se ele perceber, fará wipe nos dados.");
    }
    if (action === 'escalate_crisis') {
        document.getElementById('action-feed').innerHTML = `
            <div class="hypothesis-box" style="border-color: var(--accent-green)">
                <strong style="color: var(--accent-green)">CRÍTICO: Comitê de Ética Acionado</strong>
                <p style="margin-top: 5px;">Evidências consolidadas: Download de 12GB (vs 200MB baseline), ZIPs cifrados enviados para Gmail e 47 documentos (incluindo PII e atas do Conselho) expostos via OneDrive.</p>
                <p style="margin-top: 10px;"><strong>Hotwash (C5/C6):</strong> A matriz SI-RH-Jurídico funcionou. Comitê delibera pela <em>Justa Causa por Quebra de Confiança</em>, combinada com medida judicial cautelar (tutela inibitória) para busca e apreensão. A cadeia de custódia foi validada.</p>
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
