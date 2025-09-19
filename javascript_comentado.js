/* 
================================================================================
⚙️ JAVASCRIPT PRINCIPAL - SISTEMA DE CADASTRO DE PETS (COMENTADO PARA ESTUDO)
================================================================================

Este arquivo contém toda a lógica JavaScript da página de cadastro.
Cada função está detalhadamente comentada para fins educacionais.

FUNCIONALIDADES PRINCIPAIS:
1. Banco de Dados Local (localStorage)
2. Validação de Formulários
3. Navegação Multi-Seção
4. Formatação de Campos
5. Mensagens de Feedback

================================================================================
*/

/* 
================================================================================
1. FUNÇÕES DO BANCO DE DADOS LOCAL
================================================================================
*/

/**
 * FUNÇÃO: salvarPetNoBanco
 * PROPÓSITO: Salva dados de um pet no armazenamento local do navegador
 * PARÂMETROS: dadosPet (objeto com informações do pet)
 * RETORNO: ID único gerado para o pet
 * 
 * CONCEITOS APLICADOS:
 * - localStorage: API do navegador para persistência local
 * - JSON: Formato de dados para serialização
 * - Timestamp: Geração de IDs únicos baseados em tempo
 * - Error handling: Tratamento de casos onde não há dados salvos
 */
function salvarPetNoBanco(dadosPet) {
    // PASSO 1: Recuperar dados existentes ou criar array vazio
    // localStorage.getItem() retorna string JSON ou null
    // JSON.parse() converte string JSON em objeto JavaScript
    // Operador || fornece fallback (array vazio) se resultado for null/undefined
    let pets = JSON.parse(localStorage.getItem('petDatabase')) || [];
    
    // PASSO 2: Gerar ID único baseado em timestamp
    // Date.now() retorna milissegundos desde 01/01/1970 (Unix Epoch)
    // .toString() converte número para string (IDs como string são mais seguros)
    dadosPet.id = Date.now().toString();
    
    // PASSO 3: Adicionar timestamp de cadastro formatado
    // new Date() cria objeto Date com data/hora atual
    // .toLocaleString('pt-BR') formata para padrão brasileiro
    // Exemplo: "19/09/2024 14:30:45"
    dadosPet.dataCadastro = new Date().toLocaleString('pt-BR');
    
    // PASSO 4: Adicionar novo pet ao array existente
    // .push() adiciona elemento ao final do array
    // Modifica o array original (método mutante)
    pets.push(dadosPet);
    
    // PASSO 5: Salvar array atualizado no localStorage
    // JSON.stringify() converte objeto JavaScript para string JSON
    // localStorage.setItem() salva dados no navegador persistentemente
    localStorage.setItem('petDatabase', JSON.stringify(pets));
    
    // PASSO 6: Retornar ID para confirmação
    // Permite que código chamador saiba qual ID foi gerado
    return dadosPet.id;
}

/**
 * FUNÇÃO: obterTodosPets
 * PROPÓSITO: Recupera todos os pets salvos no banco local
 * PARÂMETROS: nenhum
 * RETORNO: Array com todos os pets ou array vazio
 */
function obterTodosPets() {
    // Mesmo padrão da função anterior para recuperação segura
    return JSON.parse(localStorage.getItem('petDatabase')) || [];
}

/**
 * FUNÇÃO: limparBancoDados
 * PROPÓSITO: Remove todos os dados do banco local
 * USO: Para reset completo ou limpeza de dados de teste
 */
function limparBancoDados() {
    localStorage.removeItem('petDatabase');
}

/* 
================================================================================
2. FORMATAÇÃO E VALIDAÇÃO DE CAMPOS
================================================================================
*/

/**
 * FUNÇÃO: formatPhoneNumber
 * PROPÓSITO: Formata número de telefone em tempo real durante digitação
 * PARÂMETROS: input (elemento DOM do campo telefone)
 * 
 * CONCEITOS APLICADOS:
 * - Regular Expressions (RegExp): Padrões para busca e substituição
 * - String manipulation: Métodos para modificar strings
 * - Real-time formatting: Atualização durante digitação
 */
function formatPhoneNumber(input) {
    // PASSO 1: Remover todos os caracteres não numéricos
    // RegExp /\D/g significa: \D (não-dígito) + g (global, todas ocorrências)
    // .replace() substitui padrões encontrados por string vazia
    let value = input.value.replace(/\D/g, '');
    
    // PASSO 2: Aplicar formatação progressiva baseada no comprimento
    
    // Para números com 11+ dígitos: (XX) XXXXX-XXXX
    if (value.length >= 11) {
        // RegExp com grupos de captura: (\d{2}) captura 2 dígitos
        // $1, $2, $3 referenciam os grupos capturados
        // .* no final ignora dígitos extras
        value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
    } 
    // Para números com 7-10 dígitos: (XX) XXXX-XXXX ou (XX) XXXXX-XXXX
    else if (value.length >= 7) {
        // \d{4,5} significa 4 ou 5 dígitos
        value = value.replace(/^(\d{2})(\d{4,5})(\d*)/, '($1) $2-$3');
    } 
    // Para números com 3-6 dígitos: (XX) XXXX
    else if (value.length >= 3) {
        value = value.replace(/^(\d{2})(\d*)/, '($1) $2');
    }
    
    // PASSO 3: Atualizar valor do campo em tempo real
    // input.value modifica diretamente o conteúdo do campo
    input.value = value;
}

/* 
================================================================================
3. SISTEMA DE MENSAGENS DE FEEDBACK
================================================================================
*/

/**
 * FUNÇÃO: showError
 * PROPÓSITO: Exibe mensagem de erro com animação e auto-remoção
 * PARÂMETROS: message (string com texto do erro)
 * 
 * CONCEITOS APLICADOS:
 * - DOM Manipulation: Criação e inserção dinâmica de elementos
 * - CSS Classes: Aplicação de estilos via JavaScript
 * - Timers: setTimeout para ações temporizadas
 * - Event handling: Limpeza de elementos para evitar duplicatas
 */
function showError(message) {
    // PASSO 1: Remover mensagem de erro anterior (evita acúmulo)
    // querySelector() busca primeiro elemento que atende ao seletor CSS
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        // .remove() exclui elemento do DOM completamente
        existingError.remove();
    }
    
    // PASSO 2: Criar novo elemento de erro
    // createElement() cria elemento HTML em memória
    const errorDiv = document.createElement('div');
    
    // PASSO 3: Configurar classes e conteúdo
    // className define classes CSS do elemento
    errorDiv.className = 'error-message';
    // textContent é mais seguro que innerHTML (evita XSS)
    errorDiv.textContent = message;
    
    // PASSO 4: Inserir na seção ativa do formulário
    // querySelector() busca seção atualmente visível
    const activeSection = document.querySelector('.form-section.active');
    // insertBefore() insere elemento antes de outro (no topo da seção)
    activeSection.insertBefore(errorDiv, activeSection.firstChild);
    
    // PASSO 5: Programar remoção automática após 5 segundos
    setTimeout(() => {
        // Verificar se elemento ainda existe antes de remover
        // (usuário pode ter navegado para outra seção)
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000); // 5000 milissegundos = 5 segundos
}

/* 
================================================================================
4. SISTEMA DE VALIDAÇÃO
================================================================================
*/

/**
 * FUNÇÃO: validateSection
 * PROPÓSITO: Valida campos obrigatórios de uma seção específica
 * PARÂMETROS: sectionNumber (número da seção a ser validada)
 * RETORNO: boolean (true se válida, false se inválida)
 * 
 * CONCEITOS APLICADOS:
 * - Switch/Case: Estrutura condicional múltipla
 * - DOM Queries: Busca de elementos por ID
 * - Boolean Logic: Lógica booleana para validação
 * - Early Return Pattern: Saída antecipada em caso de erro
 */
function validateSection(sectionNumber) {
    // Variáveis de controle da validação
    let isValid = true;
    let errorMessage = '';
    
    // Switch/Case para validações específicas por seção
    switch(sectionNumber) {
        case 1: // Seção 1: Informações Básicas
            // Obter valores dos campos obrigatórios
            const situacao = document.getElementById('situacao').value;
            const especie = document.getElementById('especie').value;
            const genero = document.getElementById('genero').value;
            
            // Verificar se algum campo obrigatório está vazio
            // Operador ! converte string vazia em true (falsy -> truthy)
            if (!situacao || !especie || !genero) {
                isValid = false;
                errorMessage = 'Por favor, preencha todos os campos obrigatórios: Situação, Espécie e Gênero.';
            }
            break;
            
        case 2: // Seção 2: Características Físicas
            const porte = document.getElementById('porte').value;
            
            if (!porte) {
                isValid = false;
                errorMessage = 'Por favor, selecione o porte do animal.';
            }
            break;
            
        case 3: // Seção 3: Contato e Detalhes
            const telefone = document.getElementById('telefone').value;
            const data = document.getElementById('data').value;
            
            // Validação básica de preenchimento
            if (!telefone || !data) {
                isValid = false;
                errorMessage = 'Por favor, preencha o telefone e a data.';
            } 
            // Validação específica: telefone deve ter pelo menos 10 dígitos
            else if (telefone.replace(/\D/g, '').length < 10) {
                isValid = false;
                errorMessage = 'Por favor, digite um telefone válido com pelo menos 10 dígitos.';
            }
            break;
    }
    
    // PASSO FINAL: Mostrar erro se validação falhou
    if (!isValid) {
        showError(errorMessage);
    }
    
    // Retornar resultado da validação
    return isValid;
}

/* 
================================================================================
5. NAVEGAÇÃO ENTRE SEÇÕES
================================================================================
*/

/**
 * FUNÇÃO: nextSection
 * PROPÓSITO: Avança para próxima seção após validar a atual
 * PARÂMETROS: currentSection (número da seção atual)
 * 
 * CONCEITOS APLICADOS:
 * - Validation First Pattern: Validar antes de prosseguir
 * - Early Return: Parar execução se validação falhar
 * - CSS Class Manipulation: Mostrar/ocultar seções
 * - Template Literals: Construção dinâmica de IDs
 */
function nextSection(currentSection) {
    // PASSO 1: Validar seção atual antes de avançar
    // Early return pattern: sair da função se validação falhar
    if (!validateSection(currentSection)) {
        return; // Para execução aqui se dados inválidos
    }
    
    // PASSO 2: Remover erro anterior (se existir)
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // PASSO 3: Ocultar seção atual
    // Template literal: `section${currentSection}` vira "section1", "section2", etc.
    const current = document.getElementById(`section${currentSection}`);
    // classList.remove() remove classe CSS específica
    current.classList.remove('active');

    // PASSO 4: Mostrar próxima seção (se existir)
    const next = document.getElementById(`section${currentSection + 1}`);
    // Verificar se próxima seção existe (null é falsy)
    if (next) {
        // classList.add() adiciona classe CSS
        next.classList.add('active');
    }
}

/**
 * FUNÇÃO: prevSection
 * PROPÓSITO: Volta para seção anterior
 * PARÂMETROS: currentSection (número da seção atual)
 * 
 * Similar à nextSection, mas sem validação (sempre permite voltar)
 */
function prevSection(currentSection) {
    // Ocultar seção atual
    const current = document.getElementById(`section${currentSection}`);
    current.classList.remove('active');

    // Mostrar seção anterior (se existir)
    const prev = document.getElementById(`section${currentSection - 1}`);
    if (prev) {
        prev.classList.add('active');
    }
}

/* 
================================================================================
6. SUBMISSÃO E FINALIZAÇÃO DO FORMULÁRIO
================================================================================
*/

/**
 * FUNÇÃO: submitForm
 * PROPÓSITO: Processa e salva dados completos do formulário
 * PARÂMETROS: nenhum
 * 
 * CONCEITOS APLICADOS:
 * - Form Data Collection: Coleta de dados de múltiplos campos
 * - Comprehensive Validation: Validação final completa
 * - Error Handling: Tratamento de erros com try/catch
 * - User Feedback: Mensagens de sucesso/erro
 * - Confirmations: Diálogos de confirmação
 */
function submitForm() {
    // PASSO 1: Coletar dados de todos os campos obrigatórios
    const situacao = document.getElementById('situacao').value;
    const especie = document.getElementById('especie').value;
    const genero = document.getElementById('genero').value;
    const porte = document.getElementById('porte').value;
    const telefone = document.getElementById('telefone').value;
    const data = document.getElementById('data').value;
    
    // PASSO 2: Verificar campos obrigatórios vazios
    // Array para acumular nomes dos campos vazios
    let camposVazios = [];
    
    // Verificações individuais com adição condicional ao array
    if (!situacao) camposVazios.push('Situação');
    if (!especie) camposVazios.push('Espécie');
    if (!genero) camposVazios.push('Gênero');
    if (!porte) camposVazios.push('Porte');
    if (!telefone) camposVazios.push('Telefone');
    if (!data) camposVazios.push('Data');
    
    // PASSO 3: Mostrar erro se há campos vazios
    if (camposVazios.length > 0) {
        // .join(', ') une elementos do array com vírgula
        let errorMessage = `Os seguintes campos são obrigatórios: ${camposVazios.join(', ')}.`;
        showError(errorMessage);
        return; // Para execução se há erros
    }
    
    // PASSO 4: Validação específica do telefone
    // Remove não-dígitos e verifica comprimento mínimo
    if (telefone.replace(/\D/g, '').length < 10) {
        showError('Por favor, digite um telefone válido com pelo menos 10 dígitos.');
        return;
    }
    
    // PASSO 5: Montar objeto com todos os dados
    const formData = {
        situacao: situacao,
        especie: especie,
        genero: genero,
        raca: document.getElementById('raca').value || 'Não informado',     // Operador || para fallback
        porte: porte,
        cor: document.getElementById('cor').value || 'Não informado',
        nome: document.getElementById('nome').value || 'Não informado',
        descricao: document.getElementById('descricao').value || 'Não informado',
        endereco: document.getElementById('endereco').value || 'Não informado',
        data: data,
        telefone: telefone
    };
    
    // PASSO 6: Salvar dados com tratamento de erro
    try {
        // Tentar salvar no banco de dados
        const petId = salvarPetNoBanco(formData);
        
        // Log para debug (visível no console do navegador)
        console.log('Pet salvo no banco de dados com ID:', petId);
        console.log('Dados salvos:', formData);
        
        // Limpar mensagens de erro anteriores
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // PASSO 7: Mostrar mensagem de sucesso
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        // innerHTML permite HTML (tags <br>, <strong>) no conteúdo
        successDiv.innerHTML = `
            <strong>Pet cadastrado com sucesso!</strong><br>
            ID do cadastro: ${petId}<br>
            Os dados foram salvos no sistema local.
        `;
        
        // Inserir mensagem na seção ativa
        const activeSection = document.querySelector('.form-section.active');
        activeSection.insertBefore(successDiv, activeSection.firstChild);
        
        // Remover mensagem após 5 segundos
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.remove();
            }
        }, 5000);
        
        // PASSO 8: Oferecer limpeza do formulário
        setTimeout(() => {
            // confirm() mostra diálogo de confirmação
            if (confirm('Deseja limpar o formulário para cadastrar outro pet?')) {
                limparFormulario();
            }
        }, 2000); // Aguarda 2 segundos antes de perguntar
        
    } catch (error) {
        // PASSO 9: Tratar erros de salvamento
        console.error('Erro ao salvar no banco de dados:', error);
        showError('Erro ao salvar os dados. Tente novamente.');
    }
}

/**
 * FUNÇÃO: limparFormulario
 * PROPÓSITO: Reset completo do formulário para novo cadastro
 * 
 * CONCEITOS APLICADOS:
 * - Form Reset: Limpeza de todos os campos
 * - State Reset: Retorno ao estado inicial
 * - DOM Cleanup: Remoção de mensagens temporárias
 */
function limparFormulario() {
    // PASSO 1: Limpar todos os campos individualmente
    // .value = '' define valor vazio para campos de input/select
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
    
    // PASSO 2: Voltar para primeira seção
    // querySelectorAll() busca todos os elementos que atendem ao seletor
    document.querySelectorAll('.form-section').forEach(section => {
        section.classList.remove('active');
    });
    // Ativar apenas a primeira seção
    document.getElementById('section1').classList.add('active');
    
    // PASSO 3: Remover todas as mensagens
    const messages = document.querySelectorAll('.error-message, .success-message');
    messages.forEach(msg => msg.remove());
}

/* 
================================================================================
CONCEITOS AVANÇADOS UTILIZADOS NO CÓDIGO:

1. **Closure e Scope**: Variáveis têm escopo de função, evitando conflitos globais

2. **Event-Driven Programming**: Funções executam em resposta a eventos do usuário

3. **State Management**: Controle de estado através de classes CSS e localStorage

4. **Error Handling**: Try/catch para operações que podem falhar

5. **Functional Programming**: Uso de métodos como map, filter, forEach

6. **Asynchronous Programming**: setTimeout para operações temporizadas

7. **Template Literals**: Strings dinâmicas com ${} para interpolação

8. **Regular Expressions**: Padrões complexos para validação e formatação

9. **DOM Manipulation**: Criação, modificação e remoção dinâmica de elementos

10. **Progressive Enhancement**: Funcionalidade básica primeiro, melhorias depois

================================================================================
*/

/*
================================================================================
PADRÕES DE DESIGN APLICADOS:

1. **Single Responsibility Principle**: Cada função tem uma responsabilidade clara

2. **DRY (Don't Repeat Yourself)**: Reutilização de código em funções utilitárias

3. **Fail Fast**: Validações antecipadas para parar execução em caso de erro

4. **Graceful Degradation**: Funcionalidade básica mesmo se algo der errado

5. **User-Centric Design**: Foco na experiência do usuário com feedback claro

================================================================================
*/