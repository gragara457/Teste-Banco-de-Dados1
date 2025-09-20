const ADMIN_CREDENTIALS = { username: 'login', password: 'login' };
let petsData = [];
let filteredData = [];

function fazerLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        alert('Preencha usuário e senha.');
        return;
    }
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        document.getElementById('login-section').classList.remove('active');
        document.getElementById('admin-panel').classList.add('active');
        carregarDados();
    } else {
        alert('Usuário ou senha incorretos!');
        document.getElementById('password').value = '';
    }
}

function logout() {
    if (confirm('Deseja sair?')) {
        document.getElementById('admin-panel').classList.remove('active');
        document.getElementById('login-section').classList.add('active');
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    }
}

function carregarDados() {
    petsData = JSON.parse(localStorage.getItem('petDatabase')) || [];
    filteredData = [...petsData];
    atualizarEstatisticas();
    renderizarTabela();
}

function atualizarEstatisticas() {
    const total = petsData.length;
    const perdidos = petsData.filter(pet => pet.situacao === 'perdido').length;
    const encontrados = petsData.filter(pet => pet.situacao === 'achado').length;
    
    document.getElementById('total-pets').textContent = total;
    document.getElementById('pets-perdidos').textContent = perdidos;
    document.getElementById('pets-encontrados').textContent = encontrados;
}

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
            tbody.innerHTML = '<tr><td colspan="10" style="text-align: center; padding: 2rem; color: #666;">Nenhum resultado encontrado.</td></tr>';
        }
        return;
    }
    
    noData.style.display = 'none';
    document.querySelector('.table-container').style.display = 'block';
    
    tbody.innerHTML = filteredData.map(pet => `
        <tr>
            <td><strong>#${pet.id.slice(-6)}</strong></td>
            <td><span class="status-badge status-${pet.situacao}">${pet.situacao === 'perdido' ? 'Perdido' : 'Encontrado'}</span></td>
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

function formatarData(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR');
}

function verDetalhes(petId) {
    const pet = petsData.find(p => p.id === petId);
    if (!pet) return;
    
    alert(`ID: ${pet.id}\nSituação: ${pet.situacao === 'perdido' ? 'Perdido' : 'Encontrado'}\nNome: ${pet.nome}\nEspécie: ${pet.especie}\nGênero: ${pet.genero}\nRaça: ${pet.raca}\nPorte: ${pet.porte}\nCor: ${pet.cor}\nDescrição: ${pet.descricao}\nEndereço: ${pet.endereco}\nData: ${formatarData(pet.data)}\nTelefone: ${pet.telefone}\nCadastrado em: ${pet.dataCadastro}`);
}

function excluirPet(petId) {
    const pet = petsData.find(p => p.id === petId);
    if (!pet) return;
    
    if (confirm(`Excluir "${pet.nome}" (ID: ${pet.id.slice(-6)})?`)) {
        petsData = petsData.filter(p => p.id !== petId);
        localStorage.setItem('petDatabase', JSON.stringify(petsData));
        carregarDados();
        alert('Pet excluído!');
    }
}

function exportarCSV() {
    if (filteredData.length === 0) {
        alert('Não há dados para exportar.');
        return;
    }
    
    const headers = ['ID','Situacao','Nome','Especie','Genero','Raca','Porte','Cor','Descricao','Endereco','Data_Ocorrencia','Telefone','Data_Cadastro'];
    
    const csvData = filteredData.map(pet => [
        pet.id.slice(-6), pet.situacao, pet.nome, pet.especie, pet.genero,
        pet.raca, pet.porte, pet.cor, 
        pet.descricao.replace(/,/g, ';'), pet.endereco.replace(/,/g, ';'),
        pet.data, pet.telefone, pet.dataCadastro
    ]);
    
    const fullData = [headers, ...csvData];
    const csvContent = fullData.map(row => row.map(field => `"${field}"`).join(',')).join('\n');
    
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `pets_database_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert(`Arquivo CSV exportado com ${filteredData.length} registro(s)!`);
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('password').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') fazerLogin();
    });
    document.getElementById('username').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') fazerLogin();
    });
});

function limparFiltros() {
    document.getElementById('filter-situacao').value = '';
    document.getElementById('filter-especie').value = '';
    document.getElementById('filter-nome').value = '';
    aplicarFiltros();
}