// Base de Dados Inicial Completa da Competição
let db = {
    teams: [
        { id: 1, name: "Águia Negra FC", city: "Curitiba", stadium: "Estádio Municipal", coach: "Carlos Silva" },
        { id: 2, name: "Botafogo Amador", city: "São José", stadium: "Campo do Bosque", coach: "Marcos Vinicius" },
        { id: 3, name: "Leões da Vila", city: "Pinhais", stadium: "Arena Vila Nova", coach: "Roberto Carlos" },
        { id: 4, name: "União Esporte", city: "Colombo", stadium: "Estádio Centenário", coach: "Paulo Sérgio" },
        { id: 5, name: "Grêmio Paranaense", city: "Curitiba", stadium: "Arena Sul", coach: "Renato Mendes" },
        { id: 6, name: "Santos Amador", city: "Araucária", stadium: "Vila Belminho", coach: "Jairzinho" }
    ],
    matches: [
        { id: 1, round: 1, homeId: 1, awayId: 2, homeScore: 2, awayScore: 1, date: "10/05/2026", time: "15:00", status: "Encerrado" },
        { id: 2, round: 1, homeId: 3, awayId: 4, homeScore: 1, awayScore: 1, date: "10/05/2026", time: "17:00", status: "Encerrado" },
        { id: 3, round: 1, homeId: 5, awayId: 6, homeScore: 3, awayScore: 0, date: "11/05/2026", time: "15:00", status: "Encerrado" },
        { id: 4, round: 2, homeId: 2, awayId: 3, homeScore: 2, awayScore: 2, date: "17/05/2026", time: "15:00", status: "Encerrado" },
        { id: 5, round: 2, homeId: 4, awayId: 1, homeScore: 0, awayScore: 2, date: "17/05/2026", time: "17:00", status: "Encerrado" },
        { id: 6, round: 2, homeId: 6, awayId: 5, homeScore: 1, awayScore: 4, date: "18/05/2026", time: "15:00", status: "Encerrado" },
        { id: 7, round: 3, homeId: 1, awayId: 3, homeScore: 2, awayScore: 0, date: "24/05/2026", time: "15:00", status: "Encerrado" },
        { id: 8, round: 3, homeId: 2, awayId: 6, homeScore: 1, awayScore: 1, date: "24/05/2026", time: "17:00", status: "Encerrado" },
        { id: 9, round: 3, homeId: 4, awayId: 5, homeScore: 0, awayScore: 3, date: "25/05/2026", time: "15:00", status: "Encerrado" }
    ],
    scorers: [
        { name: "Matheus Henrique", team: "Grêmio Paranaense", goals: 6, assists: 2 },
        { name: "Lucas Gabriel", team: "Águia Negra FC", goals: 5, assists: 3 },
        { name: "Bruno Souza", team: "Leões da Vila", goals: 4, assists: 1 },
        { name: "Thiago Santos", team: "Grêmio Paranaense", goals: 3, assists: 4 }
    ]
};

// Inicialização do Sistema
document.addEventListener("DOMContentLoaded", () => {
    initTabs();
    initThemeToggle();
    renderStandings();
    renderMatches();
    renderHomeContent();
    renderTeams();
    renderStats();
    initAdminPanel();
    initGlobalSearch();
});

// Navegação por Abas
function initTabs() {
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach(item => {
        item.addEventListener("click", () => {
            navItems.forEach(nav => nav.classList.remove("active"));
            document.querySelectorAll(".tab-pane").forEach(pane => pane.classList.remove("active"));
            
            item.classList.add("active");
            const tabId = item.getAttribute("data-tab");
            document.getElementById(tabId).classList.add("active");
        });
    });
}

function switchTab(tabId) {
    document.querySelectorAll(".nav-item").forEach(nav => {
        nav.classList.toggle("active", nav.getAttribute("data-tab") === tabId);
    });
    document.querySelectorAll(".tab-pane").forEach(pane => {
        pane.classList.toggle("active", pane.id === tabId);
    });
}

// Alternar Tema Escuro/Claro
function initThemeToggle() {
    const toggleBtn = document.getElementById("themeToggle");
    const htmlTag = document.documentElement;

    toggleBtn.addEventListener("click", () => {
        const currentTheme = htmlTag.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        htmlTag.setAttribute("data-theme", newTheme);
        toggleBtn.innerHTML = newTheme === "dark" ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
    });
}

// Cálculo e Exibição da Tabela de Classificação
function calculateStandings() {
    let standings = db.teams.map(team => ({
        ...team,
        played: 0, won: 0, drawn: 0, lost: 0,
        gf: 0, ga: 0, gd: 0, points: 0,
        form: []
    }));

    db.matches.filter(m => m.status === "Encerrado").forEach(match => {
        let home = standings.find(t => t.id === match.homeId);
        let away = standings.find(t => t.id === match.awayId);

        if (!home || !away) return;

        home.played++;
        away.played++;

        home.gf += match.homeScore;
        home.ga += match.awayScore;
        away.gf += match.awayScore;
        away.ga += match.homeScore;

        if (match.homeScore > match.awayScore) {
            home.won++; home.points += 3; home.form.push('V');
            away.lost++; away.form.push('D');
        } else if (match.homeScore < match.awayScore) {
            away.won++; away.points += 3; away.form.push('V');
            home.lost++; home.form.push('D');
        } else {
            home.drawn++; home.points += 1; home.form.push('E');
            away.drawn++; away.points += 1; away.form.push('E');
        }
    });

    standings.forEach(team => {
        team.gd = team.gf - team.ga;
        team.winRate = team.played > 0 ? Math.round((team.points / (team.played * 3)) * 100) : 0;
        team.lastFive = team.form.slice(-5).reverse();
    });

    return standings.sort((a, b) => b.points - a.points || b.gd - a.gd || b.gf - a.gf);
}

function renderStandings() {
    const tbody = document.querySelector("#standingsTable tbody");
    tbody.innerHTML = "";
    const standings = calculateStandings();

    standings.forEach((team, index) => {
        let posClass = "";
        if (index === 0) posClass = "pos-1";
        else if (index < 4) posClass = "pos-2";
        else if (index === standings.length - 1) posClass = "pos-last";

        const tr = document.createElement("tr");
        tr.className = posClass;
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td class="text-left team-cell" onclick="openTeamModal(${team.id})">
                <div class="team-badge-sm">${team.name.charAt(0)}</div>
                ${team.name}
            </td>
            <td>${team.played}</td>
            <td>${team.won}</td>
            <td>${team.drawn}</td>
            <td>${team.lost}</td>
            <td>${team.gf}</td>
            <td>${team.ga}</td>
            <td>${team.gd > 0 ? '+' + team.gd : team.gd}</td>
            <td><strong>${team.points}</strong></td>
            <td>${team.winRate}%</td>
            <td>
                ${team.lastFive.map(res => `<span style="color: ${res==='V'?'var(--success)':res==='E'?'var(--warning)':'var(--danger)'}; font-weight:bold;">${res}</span>`).join(' ')}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Renderizar Partidas
function renderMatches() {
    const container = document.getElementById("matchesContainer");
    const select = document.getElementById("roundSelect");
    
    // Popular seletor de rodadas
    const rounds = [...new Set(db.matches.map(m => m.round))];
    select.innerHTML = rounds.map(r => `<option value="${r}">Rodada ${r}</option>`).join("");

    const currentRound = select.value || rounds[0];
    const filteredMatches = db.matches.filter(m => m.round == currentRound);

    container.innerHTML = filteredMatches.map(m => {
        const home = db.teams.find(t => t.id === m.homeId);
        const away = db.teams.find(t => t.id === m.awayId);
        return `
            <div class="match-card">
                <div class="match-header-info">
                    <span>${m.date} - ${m.time}</span>
                    <span>${m.status}</span>
                </div>
                <div class="match-teams-box">
                    <div class="match-team-row">
                        <div class="match-team-info"><div class="team-badge-sm">${home.name.charAt(0)}</div> ${home.name}</div>
                        <span class="match-score">${m.status === 'Encerrado' ? m.homeScore : '-'}</span>
                    </div>
                    <div class="match-team-row">
                        <div class="match-team-info"><div class="team-badge-sm">${away.name.charAt(0)}</div> ${away.name}</div>
                        <span class="match-score">${m.status === 'Encerrado' ? m.awayScore : '-'}</span>
                    </div>
                </div>
            </div>
        `;
    }).join("");

    select.onchange = (e) => renderMatchesForRound(e.target.value);
}

function renderMatchesForRound(round) {
    const container = document.getElementById("matchesContainer");
    const filteredMatches = db.matches.filter(m => m.round == round);

    container.innerHTML = filteredMatches.map(m => {
        const home = db.teams.find(t => t.id === m.homeId);
        const away = db.teams.find(t => t.id === m.awayId);
        return `
            <div class="match-card">
                <div class="match-header-info">
                    <span>${m.date} - ${m.time}</span>
                    <span>${m.status}</span>
                </div>
                <div class="match-teams-box">
                    <div class="match-team-row">
                        <div class="match-team-info"><div class="team-badge-sm">${home.name.charAt(0)}</div> ${home.name}</div>
                        <span class="match-score">${m.status === 'Encerrado' ? m.homeScore : '-'}</span>
                    </div>
                    <div class="match-team-row">
                        <div class="match-team-info"><div class="team-badge-sm">${away.name.charAt(0)}</div> ${away.name}</div>
                        <span class="match-score">${m.status === 'Encerrado' ? m.awayScore : '-'}</span>
                    </div>
                </div>
            </div>
        `;
    }).join("");
}

// Home Content & Highlights
function renderHomeContent() {
    const nextMatch = db.matches.find(m => m.status !== "Encerrado") || db.matches[0];
    const homeTeam = db.teams.find(t => t.id === nextMatch.homeId);
    const awayTeam = db.teams.find(t => t.id === nextMatch.awayId);

    document.getElementById("nextMatchHighlight").innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>${homeTeam.name}</span>
            <strong>VS</strong>
            <span>${awayTeam.name}</span>
        </div>
        <p style="margin-top: 0.5rem; font-size: 0.8rem; color: #cbd5e1;">📅 ${nextMatch.date} às ${nextMatch.time}</p>
    `;

    const recentResults = db.matches.filter(m => m.status === "Encerrado").slice(-3);
    document.getElementById("homeRecentResults").innerHTML = recentResults.map(m => {
        const h = db.teams.find(t => t.id === m.homeId);
        const a = db.teams.find(t => t.id === m.awayId);
        return `<div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--border);">
            <span>${h.name} <strong>${m.homeScore} x ${m.awayScore}</strong> ${a.name}</span>
        </div>`;
    }).join("");

    document.getElementById("homeHighlights").innerHTML = `
        <div style="background: var(--bg-primary); padding: 1rem; border-radius: 8px;">
            <h4>Melhor Ataque</h4>
            <p style="font-size: 1.2rem; font-weight: bold; color: var(--accent); margin-top: 0.5rem;">Grêmio Paranaense (10 gols)</p>
        </div>
        <div style="background: var(--bg-primary); padding: 1rem; border-radius: 8px;">
            <h4>Artilheiro</h4>
            <p style="font-size: 1.2rem; font-weight: bold; color: var(--accent); margin-top: 0.5rem;">Matheus Henrique (6 gols)</p>
        </div>
    `;
}

// Equipes
function renderTeams() {
    const container = document.getElementById("teamsContainer");
    container.innerHTML = db.teams.map(team => `
        <div class="card" style="cursor: pointer;" onclick="openTeamModal(${team.id})">
            <div class="card-body" style="text-align: center;">
                <div class="team-badge-sm" style="width: 50px; height: 50px; margin: 0 auto 1rem; font-size: 1.2rem;">${team.name.charAt(0)}</div>
                <h3>${team.name}</h3>
                <p style="color: var(--text-secondary); font-size: 0.85rem; margin-top: 0.25rem;">📍 ${team.city}</p>
            </div>
        </div>
    `).join("");
}

// Modal de Time
function openTeamModal(teamId) {
    const team = db.teams.find(t => t.id === teamId);
    document.getElementById("modalTeamTitle").innerText = team.name;
    document.getElementById("modalTeamBody").innerHTML = `
        <p><strong>Cidade:</strong> ${team.city}</p>
        <p><strong>Estádio:</strong> ${team.stadium}</p>
        <p><strong>Técnico:</strong> ${team.coach}</p>
    `;
    document.getElementById("teamModal").classList.add("active");
}

document.getElementById("closeTeamModal").onclick = () => {
    document.getElementById("teamModal").classList.remove("active");
};

// Estatísticas
function renderStats() {
    document.getElementById("scorersList").innerHTML = db.scorers.map((s, i) => `
        <div style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid var(--border);">
            <span>${i+1}. ${s.name} (${s.team})</span>
            <strong>${s.goals} Gols</strong>
        </div>
    `).join("");

    document.getElementById("assistsList").innerHTML = db.scorers.map((s, i) => `
        <div style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid var(--border);">
            <span>${i+1}. ${s.name} (${s.team})</span>
            <strong>${s.assists} Assistências</strong>
        </div>
    `).join("");

    // Gráficos com Chart.js
    const ctxGoals = document.getElementById("goalsChart").getContext("2d");
    new Chart(ctxGoals, {
        type: 'bar',
        data: {
            labels: ['Rodada 1', 'Rodada 2', 'Rodada 3'],
            datasets: [{ label: 'Gols', data: [7, 7, 7], backgroundColor: '#3b82f6' }]
        }
    });

    const ctxPerf = document.getElementById("performanceChart").getContext("2d");
    new Chart(ctxPerf, {
        type: 'doughnut',
        data: {
            labels: ['Vitórias Mandante', 'Empates', 'Vitórias Visitante'],
            datasets: [{ data: [5, 2, 2], backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'] }]
        }
    });

    // Abas Estatísticas
    document.querySelectorAll(".stats-tab-btn").forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll(".stats-tab-btn").forEach(b => b.classList.remove("active"));
            document.querySelectorAll(".stats-pane").forEach(p => p.classList.remove("active"));
            btn.classList.add("active");
            document.getElementById(btn.getAttribute("data-stat") + "Pane").classList.add("active");
        };
    });
}

// Painel Administrativo
function initAdminPanel() {
    const modal = document.getElementById("adminModal");
    document.getElementById("adminLoginBtn").onclick = () => modal.classList.add("active");
    document.getElementById("closeAdminModal").onclick = () => modal.classList.remove("active");

    const matchesList = document.getElementById("adminMatchesList");
    matchesList.innerHTML = db.matches.map(m => {
        const h = db.teams.find(t => t.id === m.homeId);
        const a = db.teams.find(t => t.id === m.awayId);
        return `
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; gap: 0.5rem;">
                <span style="font-size: 0.85rem; flex: 1;">${h.name} x ${a.name}</span>
                <input type="number" id="hscore_${m.id}" value="${m.homeScore}" style="width: 50px;"> x 
                <input type="number" id="ascore_${m.id}" value="${m.awayScore}" style="width: 50px;">
                <button class="btn-primary" onclick="updateMatchScore(${m.id})">Salvar</button>
            </div>
        `;
    }).join("");

    document.getElementById("teamForm").onsubmit = (e) => {
        e.preventDefault();
        const name = document.getElementById("teamNameInput").value;
        const city = document.getElementById("teamCityInput").value;
        const stadium = document.getElementById("teamStadiumInput").value;
        db.teams.push({ id: db.teams.length + 1, name, city, stadium, coach: "Técnico Novo" });
        alert("Equipe cadastrada com sucesso!");
        renderTeams();
        modal.classList.remove("active");
    };
}

function updateMatchScore(id) {
    const hScore = parseInt(document.getElementById(`hscore_${id}`).value);
    const aScore = parseInt(document.getElementById(`ascore_${id}`).value);
    const match = db.matches.find(m => m.id === id);
    if(match) {
        match.homeScore = hScore;
        match.awayScore = aScore;
        match.status = "Encerrado";
        renderStandings();
        renderMatches();
        alert("Placar atualizado e tabela recalculada com sucesso!");
    }
}

// Pesquisa Global
function initGlobalSearch() {
    document.getElementById("globalSearch").oninput = (e) => {
        const term = e.target.value.toLowerCase();
        if(term.length > 2) {
            switchTab('teams');
            const container = document.getElementById("teamsContainer");
            const filtered = db.teams.filter(t => t.name.toLowerCase().includes(term) || t.city.toLowerCase().includes(term));
            container.innerHTML = filtered.map(team => `
                <div class="card"><div class="card-body"><h3>${team.name}</h3><p>${team.city}</p></div></div>
            `).join("");
        } else {
            renderTeams();
        }
    };
}