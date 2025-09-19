function showError(message) {
    // Remove mensagem de erro anterior se existir
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Cria nova mensagem de erro
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    // Adiciona a mensagem no topo da seção ativa
    const activeSection = document.querySelector('.form-section.active');
    activeSection.insertBefore(errorDiv, activeSection.firstChild);
    
    // Remove a mensagem após 5 segundos
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

function validateSection(sectionNumber) {
    let isValid = true;
    let errorMessage = '';
    
    switch(sectionNumber) {
        case 1:
            const situacao = document.getElementById('situacao').value;
            const especie = document.getElementById('especie').value;
            const genero = document.getElementById('genero').value;
            
            if (!situacao || !especie || !genero) {
                isValid = false;
                errorMessage = 'Por favor, preencha todos os campos obrigatórios: Situação, Espécie e Gênero.';
            }
            break;
            
        case 2:
            const porte = document.getElementById('porte').value;
            
            if (!porte) {
                isValid = false;
                errorMessage = 'Por favor, selecione o porte do animal.';
            }
            break;
            
        case 3:
            const telefone = document.getElementById('telefone').value;
            const data = document.getElementById('data').value;
            
            if (!telefone || !data) {
                isValid = false;
                errorMessage = 'Por favor, preencha o telefone e a data.';
            } else if (telefone.replace(/\D/g, '').length < 10) {
                isValid = false;
                errorMessage = 'Por favor, digite um telefone válido com pelo menos 10 dígitos.';
            }
            break;
    }
    
    if (!isValid) {
        showError(errorMessage);
    }
    
    return isValid;
}

function nextSection(currentSection) {
    // Valida a seção atual antes de avançar
    if (!validateSection(currentSection)) {
        return; // Para a execução se a validação falhar
    }
    
    // Remove mensagem de erro se existir
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Esconde a seção atual
    const current = document.getElementById(`section${currentSection}`);
    current.classList.remove('active');

    // Mostra a próxima seção
    const next = document.getElementById(`section${currentSection + 1}`);
    if (next) {
        next.classList.add('active');
    }
}

function prevSection(currentSection) {
    // Esconde a seção atual
    const current = document.getElementById(`section${currentSection}`);
    current.classList.remove('active');

    // Mostra a seção anterior
    const prev = document.getElementById(`section${currentSection - 1}`);
    if (prev) {
        prev.classList.add('active');
    }
}

// Funções do banco de dados local
function salvarPetNoBanco(dadosPet) {
    // Recupera pets existentes ou cria array vazio
    let pets = JSON.parse(localStorage.getItem('petDatabase')) || [];
    
    // Adiciona ID único e data de cadastro
    dadosPet.id = Date.now().toString();
    dadosPet.dataCadastro = new Date().toLocaleString('pt-BR');
    
    // Adiciona o novo pet
    pets.push(dadosPet);
    
    // Salva no localStorage
    localStorage.setItem('petDatabase', JSON.stringify(pets));
    
    return dadosPet.id;
}

function obterTodosPets() {
    return JSON.parse(localStorage.getItem('petDatabase')) || [];
}

function limparBancoDados() {
    localStorage.removeItem('petDatabase');
}

function formatPhoneNumber(input) {
    // Remove todos os caracteres não numéricos
    let value = input.value.replace(/\D/g, '');
    
    // Formatar no padrão (XX) XXXXX-XXXX
    if (value.length >= 11) {
        value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
    } else if (value.length >= 7) {
        value = value.replace(/^(\d{2})(\d{4,5})(\d*)/, '($1) $2-$3');
    } else if (value.length >= 3) {
        value = value.replace(/^(\d{2})(\d*)/, '($1) $2');
    }
    
    input.value = value;
}

function submitForm() {
    // Validação completa de todos os campos obrigatórios
    const situacao = document.getElementById('situacao').value;
    const especie = document.getElementById('especie').value;
    const genero = document.getElementById('genero').value;
    const porte = document.getElementById('porte').value;
    const telefone = document.getElementById('telefone').value;
    const data = document.getElementById('data').value;
    
    // Lista de campos obrigatórios vazios
    let camposVazios = [];
    
    if (!situacao) camposVazios.push('Situação');
    if (!especie) camposVazios.push('Espécie');
    if (!genero) camposVazios.push('Gênero');
    if (!porte) camposVazios.push('Porte');
    if (!telefone) camposVazios.push('Telefone');
    if (!data) camposVazios.push('Data');
    
    // Se há campos vazios, mostra erro
    if (camposVazios.length > 0) {
        let errorMessage = `Os seguintes campos são obrigatórios: ${camposVazios.join(', ')}.`;
        showError(errorMessage);
        return;
    }
    
    // Validação específica do telefone
    if (telefone.replace(/\D/g, '').length < 10) {
        showError('Por favor, digite um telefone válido com pelo menos 10 dígitos.');
        return;
    }
    
    // Coletando dados do formulário
    const formData = {
        situacao: situacao,
        especie: especie,
        genero: genero,
        raca: document.getElementById('raca').value || 'Não informado',
        porte: porte,
        cor: document.getElementById('cor').value || 'Não informado',
        nome: document.getElementById('nome').value || 'Não informado',
        descricao: document.getElementById('descricao').value || 'Não informado',
        endereco: document.getElementById('endereco').value || 'Não informado',
        data: data,
        telefone: telefone
    };
    
    try {
        // Salva no banco de dados local
        const petId = salvarPetNoBanco(formData);
        
        console.log('Pet salvo no banco de dados com ID:', petId);
        console.log('Dados salvos:', formData);
        
        // Remove qualquer mensagem de erro
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Mostra mensagem de sucesso
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <strong>Pet cadastrado com sucesso!</strong><br>
            ID do cadastro: ${petId}<br>
            Os dados foram salvos no sistema local.
        `;
        
        const activeSection = document.querySelector('.form-section.active');
        activeSection.insertBefore(successDiv, activeSection.firstChild);
        
        // Remove a mensagem de sucesso após 5 segundos
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.remove();
            }
        }, 5000);
        
        // Limpar o formulário após envio
        setTimeout(() => {
            if (confirm('Deseja limpar o formulário para cadastrar outro pet?')) {
                limparFormulario();
            }
        }, 2000);
        
    } catch (error) {
        console.error('Erro ao salvar no banco de dados:', error);
        showError('Erro ao salvar os dados. Tente novamente.');
    }
}

function limparFormulario() {
    // Limpa todos os campos
    document.getElementById('situacao').value = '';
    document.getElementById('especie').value = '';
    document.getElementById('genero').value = '';
    document.getElementById('raca').value = '';
    document.getElementById('porte').value = '';
    document.getElementById('cor').value = '';
    document.getElementById('nome').value = '';
    document.getElementById('descricao').value = '';
    document.getElementById('endereco').value = '';
    document.getElementById('data').value = '';
    document.getElementById('telefone').value = '';
    
    // Volta para a primeira seção
    document.querySelectorAll('.form-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById('section1').classList.add('active');
    
    // Remove mensagens
    const messages = document.querySelectorAll('.error-message, .success-message');
    messages.forEach(msg => msg.remove());
}