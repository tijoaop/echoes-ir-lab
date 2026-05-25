// Banco de Dados de Cenários do Laboratório
const scenario_c_insider_advanced = {
    id: "insider_threat_02",
    title: "Quebra de Confiança (Diretoria de Investimentos)",
    logs: {
        "help": "Comandos disponíveis:\n- query [dlp | m365_audit | exchange]\n- analyze [comportamento_endpoint]\n- collect [valor_ioc]",
        
        "query dlp": "Microsoft Purview DLP:\n[ALERT-992] Anomalia de Volumetria.\nUsuário: f.castro@entidade.local (Analista Sênior)\nAtividade: Download cumulativo de 12GB da rede corporativa (SharePoint: 'Teses de Investimento').\nBaseline histórico do usuário: 200MB/semana.\nStatus: Permitido (Read-Access).",
        
        "query exchange": "Exchange Message Trace:\nSender: f.castro@entidade.local\nRecipient: f.castro.invest@gmail.com\nEvent: Message Transfer\nAttachments: carteira_futura.zip (Encrypted), modelos_atuariais.zip (Encrypted).\nTimestamp: 3 ocorrências nas últimas 72h.",
        
        "query m365_audit": "Unified Audit Log (OneDrive):\nOperation: AnonymousLinkCreated\nUser: f.castro@entidade.local\nDetails: Link de compartilhamento externo gerado para pasta raiz.\nForense rápida: A pasta contém 47 documentos. 19 são [CONFIDENCIAIS - Conselho Deliberativo] e 5 contêm PII de coinvestidores (LGPD).",
        
        "analyze comportamento_endpoint": "EDR Telemetry (Host: LPT-FCASTRO-INV):\nNenhum malware detectado. O usuário tem utilizado ferramentas nativas do Windows. O log de acessos revela consultas a bases antigas de carteiras que não faziam parte do seu escopo de trabalho nas últimas 3 semanas."
    },
    injects: [
        { time: "08:15 AM", sender: "Gestão de Pessoas (RH)", text: "Aviso de Desligamento: O analista F. Castro (Investimentos, 8 anos de casa) solicitou saída para assumir vaga em gestora parceira. Aviso prévio trabalhado até 14/08." },
        { time: "08:30 AM", sender: "Compliance", text: "Nota Restrita: O colaborador assinou NDA e Não-Concorrência (6 meses) na admissão. A gestora de destino é parceira em 3 produtos atuais. Risco crítico de conflito de interesses." }
    ],
    // Para vencer, o analista deve coletar: o volume anômalo, o e-mail pessoal e a quantidade de documentos expostos
    win_conditions: ['12GB', 'f.castro.invest@gmail.com', '47_documentos']
};

const activeScenario = scenario_c_insider_advanced;
