function showError(message) {
    const existingError = document.querySelector('.error-message');
    if (existingError) existingError.remove();
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    document.querySelector('.form-section.active').insertBefore(errorDiv, document.querySelector('.form-section.active').firstChild);
    
    setTimeout(() => errorDiv.parentNode && errorDiv.remove(), 5000);
}

function validateSection(sectionNumber) {
    let errorMessage = '';
    
    switch(sectionNumber) {
        case 1:
            const situacao = document.getElementById('situacao').value;
            const especie = document.getElementById('especie').value;
            const genero = document.getElementById('genero').value;
            if (!situacao || !especie || !genero) 
                errorMessage = 'Por favor, preencha todos os campos obrigatórios: Situação, Espécie e Gênero.';
            break;
        case 2:
            if (!document.getElementById('porte').value) 
                errorMessage = 'Por favor, selecione o porte do animal.';
            break;
        case 3:
            const telefone = document.getElementById('telefone').value;
            const data = document.getElementById('data').value;
            if (!telefone || !data) {
                errorMessage = 'Por favor, preencha o telefone e a data.';
            } else if (telefone.replace(/\D/g, '').length < 10) {
                errorMessage = 'Por favor, digite um telefone válido com pelo menos 10 dígitos.';
            }
            break;
    }
    
    if (errorMessage) showError(errorMessage);
    return !errorMessage;
}

function nextSection(currentSection) {
    if (!validateSection(currentSection)) return;
    
    const existingError = document.querySelector('.error-message');
    if (existingError) existingError.remove();
    
    document.getElementById(`section${currentSection}`).classList.remove('active');
    const next = document.getElementById(`section${currentSection + 1}`);
    if (next) next.classList.add('active');
}

function prevSection(currentSection) {
    document.getElementById(`section${currentSection}`).classList.remove('active');
    const prev = document.getElementById(`section${currentSection - 1}`);
    if (prev) prev.classList.add('active');
}

function salvarPetNoBanco(dadosPet) {
    let pets = JSON.parse(localStorage.getItem('petDatabase')) || [];
    dadosPet.id = Date.now().toString();
    dadosPet.dataCadastro = new Date().toLocaleString('pt-BR');
    pets.push(dadosPet);
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
    let value = input.value.replace(/\D/g, '');
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
    const campos = ['situacao', 'especie', 'genero', 'porte', 'telefone', 'data'];
    const valores = {};
    let camposVazios = [];
    
    campos.forEach(campo => {
        valores[campo] = document.getElementById(campo).value;
        if (!valores[campo]) camposVazios.push(campo.charAt(0).toUpperCase() + campo.slice(1));
    });
    
    if (camposVazios.length > 0) {
        showError(`Campos obrigatórios: ${camposVazios.join(', ')}.`);
        return;
    }
    
    if (valores.telefone.replace(/\D/g, '').length < 10) {
        showError('Telefone deve ter pelo menos 10 dígitos.');
        return;
    }
    
    const formData = {
        ...valores,
        raca: document.getElementById('raca').value || 'Não informado',
        cor: document.getElementById('cor').value || 'Não informado',
        nome: document.getElementById('nome').value || 'Não informado',
        descricao: document.getElementById('descricao').value || 'Não informado',
        endereco: document.getElementById('endereco').value || 'Não informado'
    };
    
    try {
        const petId = salvarPetNoBanco(formData);
        
        const existingError = document.querySelector('.error-message');
        if (existingError) existingError.remove();
        
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `<strong>Pet cadastrado!</strong><br>ID: ${petId}`;
        
        document.querySelector('.form-section.active').insertBefore(successDiv, document.querySelector('.form-section.active').firstChild);
        
        setTimeout(() => successDiv.parentNode && successDiv.remove(), 5000);
        
        setTimeout(() => {
            if (confirm('Limpar formulário para novo cadastro?')) {
                limparFormulario();
            }
        }, 2000);
        
    } catch (error) {
        showError('Erro ao salvar. Tente novamente.');
    }
}

function limparFormulario() {
    const campos = ['situacao', 'especie', 'genero', 'raca', 'porte', 'cor', 'nome', 'descricao', 'endereco', 'data', 'telefone'];
    campos.forEach(campo => document.getElementById(campo).value = '');
    
    document.querySelectorAll('.form-section').forEach(section => section.classList.remove('active'));
    document.getElementById('section1').classList.add('active');
    
    document.querySelectorAll('.error-message, .success-message').forEach(msg => msg.remove());
}