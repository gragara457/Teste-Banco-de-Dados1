// Administração - Sistema de Login e Gerenciamento de Pets

// Credenciais de acesso
const ADMIN_CREDENTIALS = {
    username: 'login',
    password: 'login'
};

let petsData = [];
let filteredData = [];

// Função de login
function fazerLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        alert('Por favor, preencha usuário e senha.');
        return;
    }
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        // Login bem-sucedido
        document.getElementById('login-section').classList.remove('active');
        document.getElementById('admin-panel').classList.add('active');
        carregarDados();
    } else {
        alert('Usuário ou senha incorretos!\n\nDica: usuário = login, senha = login');
        document.getElementById('password').value = '';
    }
}

// Função de logout
function logout() {
    if (confirm('Deseja realmente sair?')) {
        document.getElementById('admin-panel').classList.remove('active');
        document.getElementById('login-section').classList.add('active');
        
        // Limpar campos
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    }
}

// Carregar dados do localStorage
function carregarDados() {
    petsData = JSON.parse(localStorage.getItem('petDatabase')) || [];
    filteredData = [...petsData];
    
    atualizarEstatisticas();
    renderizarTabela();
}

// Atualizar estatísticas
function atualizarEstatisticas() {
    const total = petsData.length;
    const perdidos = petsData.filter(pet => pet.situacao === 'perdido').length;
    const encontrados = petsData.filter(pet => pet.situacao === 'achado').length;
    
    document.getElementById('total-pets').textContent = total;
    document.getElementById('pets-perdidos').textContent = perdidos;
    document.getElementById('pets-encontrados').textContent = encontrados;
}

// Aplicar filtros
function aplicarFiltros() {
    const filterSituacao = document.getElementById('filter-situacao').value.toLowerCase();
    const filterEspecie = document.getElementById('filter-especie').value.toLowerCase();
    const filterNome = document.getElementById('filter-nome').value.toLowerCase();
    
    filteredData = petsData.filter(pet => {
        const matchSituacao = !filterSituacao || pet.situacao.toLowerCase().includes(filterSituacao);
        const matchEspecie = !filterEspecie || pet.especie.toLowerCase().includes(filterEspecie);
        const matchNome = !filterNome || pet.nome.toLowerCase().includes(filterNome);
        
        return matchSituacao && matchEspecie && matchNome;
    });
    
    renderizarTabela();
}

// Renderizar tabela
function renderizarTabela() {
    const tbody = document.getElementById('pets-tbody');
    const noData = document.getElementById('no-data');
    
    if (filteredData.length === 0) {
        tbody.innerHTML = '';
        if (petsData.length === 0) {
            noData.style.display = 'block';
            document.querySelector('.table-container').style.display = 'none';
        } else {
            noData.style.display = 'none';
            document.querySelector('.table-container').style.display = 'block';
            tbody.innerHTML = '<tr><td colspan="10" style="text-align: center; padding: 2rem; color: #666;">Nenhum resultado encontrado para os filtros aplicados.</td></tr>';
        }
        return;
    }
    
    noData.style.display = 'none';
    document.querySelector('.table-container').style.display = 'block';
    
    tbody.innerHTML = filteredData.map(pet => `
        <tr>
            <td><strong>#${pet.id.slice(-6)}</strong></td>
            <td>
                <span class="status-badge status-${pet.situacao}">
                    ${pet.situacao === 'perdido' ? 'Perdido' : 'Encontrado'}
                </span>
            </td>
            <td><strong>${pet.nome}</strong></td>
            <td>${pet.especie.charAt(0).toUpperCase() + pet.especie.slice(1)}</td>
            <td>${pet.genero.charAt(0).toUpperCase() + pet.genero.slice(1)}</td>
            <td>${pet.porte.charAt(0).toUpperCase() + pet.porte.slice(1)}</td>
            <td>${formatarData(pet.data)}</td>
            <td>${pet.telefone}</td>
            <td>${pet.dataCadastro}</td>
            <td>
                <button class="action-btn view-btn" onclick="verDetalhes('${pet.id}')">Ver</button>
                <button class="action-btn delete-btn" onclick="excluirPet('${pet.id}')">Excluir</button>
            </td>
        </tr>
    `).join('');
}

// Formatar data para exibição
function formatarData(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR');
}

// Ver detalhes do pet
function verDetalhes(petId) {
    const pet = petsData.find(p => p.id === petId);
    if (!pet) return;
    
    const detalhes = `
ID: ${pet.id}
Situação: ${pet.situacao === 'perdido' ? 'Perdido' : 'Encontrado'}
Nome: ${pet.nome}
Espécie: ${pet.especie}
Gênero: ${pet.genero}
Raça: ${pet.raca}
Porte: ${pet.porte}
Cor: ${pet.cor}
Descrição: ${pet.descricao}
Endereço: ${pet.endereco}
Data: ${formatarData(pet.data)}
Telefone: ${pet.telefone}
Cadastrado em: ${pet.dataCadastro}
    `;
    
    alert(detalhes);
}

// Excluir pet
function excluirPet(petId) {
    const pet = petsData.find(p => p.id === petId);
    if (!pet) return;
    
    if (confirm(`Deseja realmente excluir o pet "${pet.nome}" (ID: ${pet.id.slice(-6)})?`)) {
        petsData = petsData.filter(p => p.id !== petId);
        localStorage.setItem('petDatabase', JSON.stringify(petsData));
        carregarDados();
        alert('Pet excluído com sucesso!');
    }
}

// Exportar para CSV
function exportarCSV() {
    if (filteredData.length === 0) {
        alert('Não há dados para exportar.');
        return;
    }
    
    // Cabeçalho CSV
    const headers = [
        'ID',
        'Situacao',
        'Nome',
        'Especie',
        'Genero',
        'Raca',
        'Porte',
        'Cor',
        'Descricao',
        'Endereco',
        'Data_Ocorrencia',
        'Telefone',
        'Data_Cadastro'
    ];
    
    // Dados CSV
    const csvData = filteredData.map(pet => [
        pet.id.slice(-6), // ID mais curto
        pet.situacao,
        pet.nome,
        pet.especie,
        pet.genero,
        pet.raca,
        pet.porte,
        pet.cor,
        pet.descricao.replace(/,/g, ';'), // Remove vírgulas para não quebrar CSV
        pet.endereco.replace(/,/g, ';'),
        pet.data,
        pet.telefone,
        pet.dataCadastro
    ]);
    
    // Combinar cabeçalho com dados
    const fullData = [headers, ...csvData];
    
    // Converter para string CSV
    const csvContent = fullData.map(row => 
        row.map(field => `"${field}"`).join(',')
    ).join('\n');
    
    // Criar arquivo para download
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `pets_database_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert(`Arquivo CSV exportado com ${filteredData.length} registro(s)!\n\nO arquivo pode ser aberto no Excel.`);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Permitir login com Enter
    document.getElementById('password').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            fazerLogin();
        }
    });
    
    document.getElementById('username').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            fazerLogin();
        }
    });
});

// Limpar filtros
function limparFiltros() {
    document.getElementById('filter-situacao').value = '';
    document.getElementById('filter-especie').value = '';
    document.getElementById('filter-nome').value = '';
    aplicarFiltros();
}