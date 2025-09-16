// =================================================================================
// VARIÁVEL DE CONFIGURAÇÃO
// Cole aqui o link da sua planilha publicada na web como CSV.
// =================================================================================
const googleSheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTtmaAXPS_H_9RQbpKCWk3QzSTmKDCgUALJSrLx3Ko14o90_V79St_tYzLDnLMnEj1AH_MrjJ_lua4u/pub?gid=954558693&single=true&output=csv';

// =================================================================================
// EVENT LISTENERS
// Elementos do DOM que serão usados para os filtros e para a galeria.
// =================================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa a aplicação assim que o DOM estiver completamente carregado.
    fetchAndDisplayPlayers();

    // Adiciona listeners aos menus de filtro para acionar a filtragem em tempo real.
    document.getElementById('eloFilter').addEventListener('change', filterPlayers);
    document.getElementById('roleFilter').addEventListener('change', filterPlayers);
});

/**
 * Função principal que busca os dados da planilha e inicia a renderização.
 */
function fetchAndDisplayPlayers() {
    Papa.parse(googleSheetURL, {
        download: true,
        header: true, // Trata a primeira linha como cabeçalho (Nome de Invocador, Elo, etc.)
        complete: (results) => {
            // Remove a mensagem de "carregando"
            const loadingMessage = document.getElementById('loading-message');
            if (loadingMessage) {
                loadingMessage.style.display = 'none';
            }
            // Chama a função para renderizar os cards com os dados recebidos.
            renderPlayerCards(results.data);
        },
        error: (error) => {
            console.error("Erro ao buscar ou parsear os dados:", error);
            const gallery = document.getElementById('player-gallery');
            gallery.innerHTML = '<p class="text-danger text-center">Erro ao carregar a lista de jogadores. Tente novamente mais tarde.</p>';
        }
    });
}

/**
 * Renderiza os cards dos jogadores na galeria.
 * @param {Array<Object>} players - Um array de objetos, onde cada objeto representa um jogador.
 */
function renderPlayerCards(players) {
    const gallery = document.getElementById('player-gallery');
    gallery.innerHTML = ''; // Limpa a galeria antes de adicionar os novos cards.

    players.forEach(player => {
        // ======================= MUDANÇAS AQUI =======================
        // Agora usamos os nomes exatos do seu formulário.
        // Note o uso de colchetes player['Nome do Campo'] quando o nome tem espaços ou acentos.
        const nomeInvocador = player['Nome de Invocador'];
        const elo = player['Seu Elo']; // ALTERADO DE 'Elo' PARA 'Seu Elo'
        const funcaoPrincipal = player['Função Principal']; // ALTERADO DE 'Role Principal' PARA 'Função Principal'
        const funcoesSecundarias = player['Funções Secundárias']; // NOVO CAMPO ADICIONADO
        const whatsapp = player['Número de Whatsapp']; // ALTERADO DE 'Número do WhatsApp'

        // Validação para garantir que os campos essenciais não estão vazios.
        if (nomeInvocador && elo && funcaoPrincipal) {
            
            // Normaliza o número de WhatsApp para criar o link. Remove caracteres não numéricos.
            const whatsappNumber = (whatsapp || '').replace(/\D/g, '');

            // Monta o HTML para as funções secundárias, apenas se o campo existir
            let funcoesSecundariasHTML = '';
            if (funcoesSecundarias) {
                funcoesSecundariasHTML = `<p class="card-text mb-2"><strong>Secundárias:</strong> ${funcoesSecundarias}</p>`;
            }

            const cardHTML = `
                <div class="col-lg-3 col-md-4 col-sm-6 player-card-wrapper" data-elo="${elo}" data-role="${funcaoPrincipal}">
                    <div class="card h-100 shadow-sm player-card">
                        <div class="card-header text-center">
                            ${nomeInvocador}
                        </div>
                        <div class="card-body text-center d-flex flex-column justify-content-between">
                            <div>
                               <p class="card-text mb-2"><strong>Elo:</strong> <span class="badge bg-secondary">${elo}</span></p>
                               <p class="card-text mb-2"><strong>Principal:</strong> <span class="badge bg-info text-dark">${funcaoPrincipal}</span></p>
                               ${funcoesSecundariasHTML} {/* A nova informação entra aqui */}
                            </div>
                            <a href="https://wa.me/${whatsappNumber}" target="_blank" class="btn btn-whatsapp mt-3">
                                Chamar no WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            `;
            gallery.innerHTML += cardHTML;
        }
    });
}

/**
 * Filtra os cards de jogadores visíveis com base nos valores selecionados nos filtros.
 * Esta função não faz uma nova requisição, apenas manipula a visibilidade dos elementos já na tela.
 */
function filterPlayers() {
    const eloFilterValue = document.getElementById('eloFilter').value;
    const roleFilterValue = document.getElementById('roleFilter').value;

    const allPlayers = document.querySelectorAll('.player-card-wrapper');

    allPlayers.forEach(playerCard => {
        const playerElo = playerCard.getAttribute('data-elo');
        const playerRole = playerCard.getAttribute('data-role');

        // Condições de visibilidade
        const eloMatch = (eloFilterValue === 'all') || (eloFilterValue === playerElo);
        const roleMatch = (roleFilterValue === 'all') || (roleFilterValue === playerRole);

        // Se o jogador corresponde a ambos os filtros (ou se o filtro é 'todos'), ele é exibido.
        if (eloMatch && roleMatch) {
            playerCard.style.display = ''; // Mostra o card
        } else {
            playerCard.style.display = 'none'; // Esconde o card
        }
    });
}