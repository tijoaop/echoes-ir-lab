# ECHOES // Incident Response Lab

ECHOES é um simulador de "Tabletop Exercise" (TTX) em formato de aplicação web interativa, desenhado para equipes de SOC, Arquitetos de Nuvem e CSIRT. 

Ele simula o ambiente de tensão operacional sob a ótica de um incidente cibernético, onde ferramentas de monitoramento falham e a verdade só pode ser extraída via análise profunda de logs e correlação de ameaças.

## Instalação e Uso
O projeto é 100% Client-Side (HTML/CSS/JS puros). Nenhuma instalação de backend ou Node.js é necessária.

1. Clone o repositório: `git clone https://github.com/SEU-USUARIO/echoes-ir-lab.git`
2. Abra o arquivo `index.html` em qualquer navegador.

## Como Jogar (Mecânicas)
- **Terminal:** Digite comandos como `analyze firewall`, `query entra_id` ou `analyze legacy_db` para obter fragmentos de log.
- **Mural de Evidências:** Quando achar um IOC (Indicador de Comprometimento) como um IP ou um Service Principal suspeito, digite `collect <valor>` para anexá-lo ao painel.
- **Condição de Vitória:** O botão de Escalonamento (que gera a crise no comitê) só aparece quando você coleciona os IOCs corretos.
