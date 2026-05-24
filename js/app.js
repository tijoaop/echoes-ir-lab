// Banco de Dados de Cenários do Laboratório
const activeScenario = {
    id: "legacy_ghost_01",
    title: "O Fantasma no Monólito",
    logs: {
        "analyze firewall": "AzureFirewallRuleLog: Traffic spike. Src: 10.0.4.15 (AKS-Node). Dst: 185.199.108.153 (External). Bytes: 450MB. Action: ALLOW.",
        "query entra_id": "AADServicePrincipalSignInLogs: AppID 'legacy-bridge-api' logando de IP suspeito (185.199.108.153) fora da VNet. Result: SUCCESS. MFA: Not Required for Service Principals.",
        "analyze legacy_db": "AuditLog: SELECT * FROM tb_beneficiarios_ativos; Executado por 'svc_entraid_bridge'. Status: 200 OK.",
        "help": "Comandos disponíveis:\n- analyze [firewall | legacy_db | app_proxy]\n- query [entra_id | edr]\n- collect [ioc_value]"
    },
    injects: [
        { time: "03:14 AM", sender: "PAGERDUTY", text: "INC-9921: Delta de tráfego no Proxy reverso apontando para API Legada." }
    ],
    win_conditions: ['185.199.108.153', 'legacy-bridge-api', 'svc_entraid_bridge']
};
