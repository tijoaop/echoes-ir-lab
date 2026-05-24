// Banco de Dados de Cenários do Laboratório
// Para alternar entre os cenários, basta mudar qual objeto é exportado ou usado como 'activeScenario'

const scenario_c_insider = {
    id: "insider_threat_01",
    title: "Quebra de Confiança",
    logs: {
        "help": "Comandos disponíveis:\n- query [ueba | db_audit | dlp]\n- analyze [endpoint_agent]\n- collect [ioc_value]",
        
        "query ueba": "UEBA Alert (User Entity Behavior Analytics):\nAnomalia detectada para 'f.castro@suaempresa.com'.\nLogin interativo às 02:14 AM. IP de origem: 177.43.12.9 (ISP_RESIDENCIAL). Padrão histórico do usuário: 08:00 às 18:00 via VPN corporativa.",
        
        "query db_audit": "Database Audit Logs (Oracle Exadata):\n02:22 AM - User 'f.castro' executou query anômala:\nSELECT cpf, nome, dados_bancarios FROM tb_folha_pagamento WHERE status='ativo';\nLinhas retornadas: 450.000. Bytes transferidos: 1.2 GB.",
        
        "query dlp": "Microsoft Purview DLP - Endpoint Alert:\n02:45 AM - Processo 'chrome.exe' fez upload de arquivo criptografado (backup_local.zip - 800MB).\nDestino da conexão: api.dropboxapi.com.\nClassificação de dados não pôde ser lida (arquivo zipado com senha).",
        
        "analyze endpoint_agent": "EDR Telemetry (Host: LPT-FCASTRO):\n02:05 AM - Execução de script PowerShell suspeito (Compress-Archive).\n02:45 AM - Conexão HTTPS estabelecida com api.dropboxapi.com."
    },
    injects: [
        { time: "08:15 AM", sender: "SOC L1", text: "Alerta noturno do UEBA sobre desvio comportamental do usuário f.castro (Arquiteto de Dados). O analista anterior deixou na fila de baixa prioridade." },
        { time: "08:45 AM", sender: "Sistema de RH", text: "Aviso de Movimentação: O colaborador F. Castro solicitou desligamento voluntário hoje cedo. Status alterado para: Cumprindo aviso prévio em home office." },
        { time: "09:00 AM", sender: "Jurídico (Automático)", text: "Diretriz: Em caso de suspeita de insider, NÃO bloqueie a conta imediatamente sem coleta forense. Risco de o funcionário destruir evidências no notebook corporativo antes da devolução." }
    ],
    win_conditions: ['f.castro@suaempresa.com', '177.43.12.9', 'api.dropboxapi.com']
};

// Aqui definimos que o Cenário C é o que vai rodar na Engine
const activeScenario = scenario_c_insider;
