# 🎓 GUIA DE ESTUDO PRÁTICO - Sistema de Pets

## 🧪 **EXERCÍCIOS PRÁTICOS PARA APRENDIZADO**

### **📚 NÍVEL 1: CONCEITOS BÁSICOS**

#### **Exercício 1.1: Entendendo o DOM**
```javascript
// Experimente no console do navegador:

// 1. Buscar elemento por ID
const elemento = document.getElementById('situacao');
console.log(elemento);

// 2. Buscar elemento por classe
const secoesAtivas = document.querySelector('.form-section.active');
console.log(secoesAtivas);

// 3. Buscar múltiplos elementos
const todosBotoes = document.querySelectorAll('button');
console.log(todosBotoes);

// 4. Alterar conteúdo
elemento.value = 'perdido';

// 5. Alterar classe
elemento.classList.add('destaque');
elemento.classList.remove('destaque');
```

#### **Exercício 1.2: localStorage**
```javascript
// Abra o console e teste:

// 1. Salvar dados
localStorage.setItem('teste', 'Hello World');

// 2. Recuperar dados
const dados = localStorage.getItem('teste');
console.log(dados);

// 3. Salvar objeto
const usuario = { nome: 'João', idade: 25 };
localStorage.setItem('usuario', JSON.stringify(usuario));

// 4. Recuperar objeto
const usuarioRecuperado = JSON.parse(localStorage.getItem('usuario'));
console.log(usuarioRecuperado);

// 5. Remover dados
localStorage.removeItem('teste');

// 6. Ver todos os dados salvos
console.log(localStorage);
```

### **📚 NÍVEL 2: FUNCIONALIDADES INTERMEDIÁRIAS**

#### **Exercício 2.1: Criando Validação Personalizada**
```javascript
// Crie sua própria função de validação:

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validarCPF(cpf) {
    // Remove pontos e hífens
    cpf = cpf.replace(/[^\d]/g, '');
    
    // Verifica se tem 11 dígitos
    if (cpf.length !== 11) return false;
    
    // Verifica se não é sequência repetida
    if (/^(\d)\1+$/.test(cpf)) return false;
    
    return true; // Implementação simplificada
}

function validarIdade(nascimento) {
    const hoje = new Date();
    const dataNasc = new Date(nascimento);
    const idade = hoje.getFullYear() - dataNasc.getFullYear();
    
    return idade >= 18 && idade <= 120;
}

// Teste as funções:
console.log(validarEmail('teste@email.com')); // true
console.log(validarCPF('123.456.789-10')); // true
console.log(validarIdade('1990-01-01')); // true
```

#### **Exercício 2.2: Manipulando Arrays**
```javascript
// Simule dados de pets para praticar:

const pets = [
    { nome: 'Rex', especie: 'cachorro', idade: 3, perdido: true },
    { nome: 'Mimi', especie: 'gato', idade: 2, perdido: false },
    { nome: 'Bob', especie: 'cachorro', idade: 5, perdido: true },
    { nome: 'Luna', especie: 'gato', idade: 1, perdido: false }
];

// 1. Filtrar apenas pets perdidos
const petsPerdidos = pets.filter(pet => pet.perdido);
console.log('Perdidos:', petsPerdidos);

// 2. Mapear apenas nomes
const nomes = pets.map(pet => pet.nome);
console.log('Nomes:', nomes);

// 3. Encontrar pet específico
const rex = pets.find(pet => pet.nome === 'Rex');
console.log('Rex:', rex);

// 4. Contar pets por espécie
const contagem = pets.reduce((acc, pet) => {
    acc[pet.especie] = (acc[pet.especie] || 0) + 1;
    return acc;
}, {});
console.log('Contagem:', contagem);

// 5. Ordenar por idade
const ordenadosPorIdade = pets.sort((a, b) => a.idade - b.idade);
console.log('Ordenados:', ordenadosPorIdade);
```

### **📚 NÍVEL 3: FUNCIONALIDADES AVANÇADAS**

#### **Exercício 3.1: Sistema de Eventos Personalizado**
```javascript
// Criar sistema de notificações:

class NotificationSystem {
    constructor() {
        this.listeners = {};
    }
    
    // Adicionar listener
    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }
    
    // Disparar evento
    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => callback(data));
        }
    }
    
    // Remover listener
    off(event, callback) {
        if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
        }
    }
}

// Usar o sistema:
const notifier = new NotificationSystem();

// Adicionar listeners
notifier.on('pet-cadastrado', (pet) => {
    console.log(`Pet ${pet.nome} foi cadastrado!`);
});

notifier.on('pet-encontrado', (pet) => {
    console.log(`Pet ${pet.nome} foi encontrado!`);
});

// Disparar eventos
notifier.emit('pet-cadastrado', { nome: 'Rex', especie: 'cachorro' });
notifier.emit('pet-encontrado', { nome: 'Mimi', especie: 'gato' });
```

#### **Exercício 3.2: Sistema de Cache**
```javascript
// Implementar cache para melhorar performance:

class DataCache {
    constructor(ttl = 300000) { // 5 minutos por padrão
        this.cache = new Map();
        this.ttl = ttl;
    }
    
    set(key, data) {
        const expireTime = Date.now() + this.ttl;
        this.cache.set(key, { data, expireTime });
    }
    
    get(key) {
        const cached = this.cache.get(key);
        
        if (!cached) return null;
        
        if (Date.now() > cached.expireTime) {
            this.cache.delete(key);
            return null;
        }
        
        return cached.data;
    }
    
    clear() {
        this.cache.clear();
    }
    
    size() {
        return this.cache.size;
    }
}

// Usar o cache:
const cache = new DataCache();

// Salvar dados
cache.set('pets-stats', { total: 50, perdidos: 10, encontrados: 40 });

// Recuperar dados
const stats = cache.get('pets-stats');
console.log(stats);
```

---

## 🔬 **ANÁLISE DE CÓDIGO LINHA POR LINHA**

### **🔍 Função `nextSection()` - Análise Detalhada**

```javascript
function nextSection(currentSection) {
    // LINHA 1: Declaração da função
    // - 'function' = palavra-chave para declarar função
    // - 'nextSection' = nome descritivo da função
    // - 'currentSection' = parâmetro que recebe número da seção atual
    
    if (!validateSection(currentSection)) {
        // LINHA 2: Condicional de validação
        // - '!' = operador de negação (NOT)
        // - 'validateSection()' = chama função de validação
        // - Se validação falhar (retornar false), condição é true
        
        return;
        // LINHA 3: Saída antecipada
        // - 'return' sem valor para parar execução
        // - Pattern de "early return" para evitar aninhamento
    }
    
    const current = document.getElementById(`section${currentSection}`);
    // LINHA 4: Busca elemento atual
    // - 'const' = declaração de constante (não pode ser reatribuída)
    // - 'document.getElementById()' = método DOM para buscar por ID
    // - Template literal: `section${currentSection}` vira "section1", "section2", etc.
    
    current.classList.remove('active');
    // LINHA 5: Remove classe CSS
    // - 'classList' = propriedade que gerencia classes do elemento
    // - 'remove()' = método que remove classe específica
    // - Remove visibilidade da seção atual
    
    const next = document.getElementById(`section${currentSection + 1}`);
    // LINHA 6: Busca próxima seção
    // - 'currentSection + 1' = incrementa número da seção
    // - Busca elemento da próxima seção
    
    if (next) {
        // LINHA 7: Verifica se próxima seção existe
        // - JavaScript trata elementos inexistentes como 'null'
        // - 'null' é considerado falsy, então if só executa se elemento existir
        
        next.classList.add('active');
        // LINHA 8: Adiciona classe à próxima seção
        // - 'add()' = método que adiciona classe CSS
        // - Torna próxima seção visível
    }
}
```

### **🔍 Função `salvarPetNoBanco()` - Análise Detalhada**

```javascript
function salvarPetNoBanco(dadosPet) {
    let pets = JSON.parse(localStorage.getItem('petDatabase')) || [];
    // ANÁLISE DESSA LINHA:
    // 1. 'localStorage.getItem('petDatabase')' - busca dados salvos
    //    - Retorna string JSON ou null se não existir
    // 2. 'JSON.parse()' - converte string JSON em objeto JavaScript
    //    - Se receber null, gera erro
    // 3. '|| []' - operador OR lógico como fallback
    //    - Se JSON.parse falhar ou retornar null, usa array vazio
    // 4. 'let pets' - declara variável mutável
    //    - Diferente de 'const', pode ser reatribuída
    
    dadosPet.id = Date.now().toString();
    // ANÁLISE:
    // 1. 'Date.now()' - timestamp atual em milissegundos
    //    - Ex: 1726742400000
    // 2. '.toString()' - converte número para string
    //    - IDs como string são mais seguros para chaves
    // 3. 'dadosPet.id' - adiciona propriedade ao objeto
    //    - Notação de ponto para acessar/criar propriedades
    
    dadosPet.dataCadastro = new Date().toLocaleString('pt-BR');
    // ANÁLISE:
    // 1. 'new Date()' - cria objeto Date com horário atual
    // 2. '.toLocaleString('pt-BR')' - formata para padrão brasileiro
    //    - Ex: "19/09/2024 14:30:45"
    
    pets.push(dadosPet);
    // ANÁLISE:
    // 1. '.push()' - método que adiciona elemento ao final do array
    // 2. Modifica array original (método mutante)
    
    localStorage.setItem('petDatabase', JSON.stringify(pets));
    // ANÁLISE:
    // 1. 'JSON.stringify()' - converte objeto JavaScript em string JSON
    // 2. 'localStorage.setItem()' - salva no armazenamento do navegador
    // 3. Persistente - dados sobrevivem ao fechamento do navegador
    
    return dadosPet.id;
    // ANÁLISE:
    // 1. Retorna ID gerado para confirmação/referência
    // 2. Permite que função chamadora saiba qual ID foi criado
}
```

---

## 🛠️ **DEBUGGING E TROUBLESHOOTING**

### **🐛 Problemas Comuns e Soluções**

#### **Problema 1: "Cannot read property of null"**
```javascript
// ❌ ERRO COMUM:
const elemento = document.getElementById('id-que-nao-existe');
elemento.value = 'teste'; // ERRO: Cannot read property 'value' of null

// ✅ SOLUÇÃO:
const elemento = document.getElementById('id-que-nao-existe');
if (elemento) {
    elemento.value = 'teste';
} else {
    console.error('Elemento não encontrado');
}

// 🔧 ALTERNATIVA COM OPTIONAL CHAINING (ES2020):
elemento?.setAttribute('value', 'teste');
```

#### **Problema 2: localStorage não funciona**
```javascript
// ❌ POSSÍVEIS CAUSAS:
// 1. Navegador em modo privado/incógnito
// 2. Armazenamento local desabilitado
// 3. Cota de armazenamento excedida

// ✅ SOLUÇÃO COM VERIFICAÇÃO:
function isLocalStorageAvailable() {
    try {
        const test = '__localStorage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
}

if (isLocalStorageAvailable()) {
    // Usar localStorage normalmente
    localStorage.setItem('dados', JSON.stringify(dados));
} else {
    // Fallback para sessionStorage ou cookies
    alert('Armazenamento local não disponível');
}
```

#### **Problema 3: Formulário não valida**
```javascript
// ❌ ERRO COMUM:
function validarCampo() {
    const valor = document.getElementById('campo').value;
    if (valor == '') { // Comparação fraca
        return false;
    }
}

// ✅ SOLUÇÃO ROBUSTA:
function validarCampo() {
    const elemento = document.getElementById('campo');
    
    // Verificar se elemento existe
    if (!elemento) return false;
    
    const valor = elemento.value;
    
    // Comparação estrita e trim para espaços
    if (valor.trim() === '') {
        return false;
    }
    
    return true;
}
```

### **🔧 Ferramentas de Debug**

#### **Console do Navegador**
```javascript
// 1. Log básico
console.log('Valor da variável:', minhaVariavel);

// 2. Log com estilo
console.log('%c Erro encontrado!', 'color: red; font-size: 16px;');

// 3. Log de tabela
console.table(arrayDeDados);

// 4. Log de tempo
console.time('operacao');
// ... código a ser medido ...
console.timeEnd('operacao');

// 5. Log condicional
console.assert(valor > 0, 'Valor deve ser positivo');
```

#### **Breakpoints e Debugging**
```javascript
// 1. Breakpoint manual
function minhaFuncao() {
    debugger; // Pausa execução aqui
    // ... resto do código
}

// 2. Logging estratégico
function procesarDados(dados) {
    console.log('Entrada:', dados);
    
    const processados = dados.map(item => {
        console.log('Processando item:', item);
        return transformarItem(item);
    });
    
    console.log('Saída:', processados);
    return processados;
}
```

---

## 📊 **MÉTRICAS E PERFORMANCE**

### **⚡ Medindo Performance**

```javascript
// 1. Tempo de execução
function medirTempoExecucao(funcao, ...args) {
    const inicio = performance.now();
    const resultado = funcao(...args);
    const fim = performance.now();
    
    console.log(`Execução levou ${fim - inicio} milissegundos`);
    return resultado;
}

// 2. Uso de memória (Chrome)
function medirMemoria() {
    if (performance.memory) {
        console.log('Memória usada:', performance.memory.usedJSHeapSize / 1024 / 1024, 'MB');
        console.log('Memória total:', performance.memory.totalJSHeapSize / 1024 / 1024, 'MB');
        console.log('Limite:', performance.memory.jsHeapSizeLimit / 1024 / 1024, 'MB');
    }
}

// 3. Contagem de operações DOM
let domOperations = 0;

function contarOperacaoDOM(tipo) {
    domOperations++;
    console.log(`Operação DOM #${domOperations}: ${tipo}`);
}

// Usar nos métodos DOM
const elemento = document.getElementById('test');
contarOperacaoDOM('getElementById');
```

### **🚀 Otimizações Aplicadas no Projeto**

#### **1. Minimização de DOM Queries**
```javascript
// ❌ INEFICIENTE - busca elemento múltiplas vezes:
function atualizarFormulario() {
    document.getElementById('campo1').value = 'valor1';
    document.getElementById('campo1').classList.add('ativo');
    document.getElementById('campo1').focus();
}

// ✅ EFICIENTE - busca uma vez e reutiliza:
function atualizarFormulario() {
    const campo1 = document.getElementById('campo1');
    campo1.value = 'valor1';
    campo1.classList.add('ativo');
    campo1.focus();
}
```

#### **2. Event Delegation**
```javascript
// ❌ INEFICIENTE - listener em cada botão:
document.querySelectorAll('.botao').forEach(botao => {
    botao.addEventListener('click', handleClick);
});

// ✅ EFICIENTE - um listener no container:
document.getElementById('container').addEventListener('click', function(e) {
    if (e.target.classList.contains('botao')) {
        handleClick(e);
    }
});
```

---

## 🎯 **DESAFIOS PARA PRATICAR**

### **🏆 Desafio 1: Melhorar Validação**
Implemente validações mais robustas:
- CPF válido para telefone
- Email válido para contato alternativo
- Data não pode ser futura para pets perdidos
- Upload e preview de foto do pet

### **🏆 Desafio 2: Funcionalidades Avançadas**
Adicione novas funcionalidades:
- Sistema de favoritos
- Busca por localização (GPS)
- Sistema de matches (pets perdidos vs encontrados)
- Notificações push

### **🏆 Desafio 3: Performance**
Otimize a aplicação:
- Virtualização da tabela para muitos registros
- Lazy loading de imagens
- Service Worker para cache
- Debouncing nos filtros de busca

### **🏆 Desafio 4: Acessibilidade**
Torne a aplicação acessível:
- Navegação por teclado
- ARIA labels apropriados
- Contraste de cores adequado
- Suporte a screen readers

---

## 📚 **RECURSOS PARA APROFUNDAMENTO**

### **📖 Documentação Oficial**
- [MDN Web Docs](https://developer.mozilla.org/) - Referência completa
- [W3C Standards](https://www.w3.org/) - Especificações web
- [Can I Use](https://caniuse.com/) - Compatibilidade de navegadores

### **🛠️ Ferramentas de Desenvolvimento**
- **Chrome DevTools**: Debug, performance, network
- **VSCode Extensions**: ESLint, Prettier, Live Server
- **Lighthouse**: Auditoria de qualidade e performance

### **📚 Conceitos para Estudar Mais**
1. **JavaScript Avançado**: Promises, Async/Await, Modules
2. **Design Patterns**: Observer, Factory, Singleton
3. **Testing**: Unit tests, Integration tests, E2E
4. **Build Tools**: Webpack, Vite, Rollup
5. **Frameworks**: React, Vue, Angular (para comparação)

---

**🎉 Parabéns por chegar até aqui!** Este guia fornece uma base sólida para entender e expandir o sistema de cadastro de pets. Continue praticando e experimentando com os conceitos apresentados!