// ========================================
// SISTEMA DE AUTENTICAÇÃO E GESTÃO DE USUÁRIOS
// ========================================

// Simulação de Banco de Dados com Local Storage
class DatabaseSimulator {
    constructor() {
        this.initializeDefaultUsers();
    }

    // Inicializar usuários padrão se não existirem
    initializeDefaultUsers() {
        if (!localStorage.getItem('fastwork_users')) {
            const defaultUsers = [
                {
                    id: 1,
                    email: 'admin@fastwork.com',
                    password: 'admin123',
                    type: 'admin',
                    name: 'Administrador',
                    avatar: 'https://ui-avatars.com/api/?name=Admin&background=1976d2&color=fff',
                    createdAt: new Date().toISOString(),
                    lastLogin: null,
                    permissions: ['read', 'write', 'delete', 'manage_users']
                },
                {
                    id: 2,
                    email: 'empresa@exemplo.com',
                    password: 'empresa123',
                    type: 'empresa',
                    name: 'TechCorp Solutions',
                    cnpj: '12.345.678/0001-90',
                    avatar: 'https://ui-avatars.com/api/?name=TechCorp&background=28a745&color=fff',
                    createdAt: new Date().toISOString(),
                    lastLogin: null,
                    permissions: ['read', 'write', 'post_jobs']
                },
                {
                    id: 3,
                    email: 'joao@email.com',
                    password: 'joao123',
                    type: 'profissional',
                    name: 'João Silva',
                    cpf: '123.456.789-00',
                    profissao: 'Desenvolvedor Frontend',
                    avatar: 'https://ui-avatars.com/api/?name=João+Silva&background=dc3545&color=fff',
                    createdAt: new Date().toISOString(),
                    lastLogin: null,
                    permissions: ['read', 'apply_jobs']
                },
                {
                    id: 4,
                    email: 'maria@email.com',
                    password: 'maria123',
                    type: 'profissional',
                    name: 'Maria Santos',
                    cpf: '987.654.321-00',
                    profissao: 'Designer UX/UI',
                    avatar: 'https://ui-avatars.com/api/?name=Maria+Santos&background=6f42c1&color=fff',
                    createdAt: new Date().toISOString(),
                    lastLogin: null,
                    permissions: ['read', 'apply_jobs']
                }
            ];
            localStorage.setItem('fastwork_users', JSON.stringify(defaultUsers));
        }

        // Inicializar sessões ativas se não existir
        if (!localStorage.getItem('fastwork_sessions')) {
            localStorage.setItem('fastwork_sessions', JSON.stringify([]));
        }
    }

    // Obter todos os usuários
    getAllUsers() {
        return JSON.parse(localStorage.getItem('fastwork_users') || '[]');
    }

    // Obter usuário por email
    getUserByEmail(email) {
        const users = this.getAllUsers();
        return users.find(user => user.email.toLowerCase() === email.toLowerCase());
    }

    // Obter usuário por ID
    getUserById(id) {
        const users = this.getAllUsers();
        return users.find(user => user.id === parseInt(id));
    }

    // Salvar usuários
    saveUsers(users) {
        localStorage.setItem('fastwork_users', JSON.stringify(users));
    }

    // Adicionar novo usuário
    addUser(userData) {
        const users = this.getAllUsers();
        const newUser = {
            id: Date.now(),
            ...userData,
            createdAt: new Date().toISOString(),
            lastLogin: null
        };
        users.push(newUser);
        this.saveUsers(users);
        return newUser;
    }

    // Atualizar último login
    updateLastLogin(userId) {
        const users = this.getAllUsers();
        const userIndex = users.findIndex(user => user.id === parseInt(userId));
        if (userIndex !== -1) {
            users[userIndex].lastLogin = new Date().toISOString();
            this.saveUsers(users);
        }
    }
}

// ========================================
// SISTEMA DE AUTENTICAÇÃO
// ========================================

class AuthenticationSystem {
    constructor() {
        this.db = new DatabaseSimulator();
        this.currentUser = null;
        this.initializeAuth();
    }

    // Inicializar sistema de autenticação
    initializeAuth() {
        const sessionToken = localStorage.getItem('fastwork_session_token');
        if (sessionToken) {
            this.validateSession(sessionToken);
        }
    }

    // Gerar token de sessão
    generateSessionToken() {
        return btoa(Date.now() + Math.random().toString(36)).replace(/[^a-zA-Z0-9]/g, '');
    }

    // Validar sessão
    validateSession(token) {
        const sessions = JSON.parse(localStorage.getItem('fastwork_sessions') || '[]');
        const session = sessions.find(s => s.token === token && s.expiresAt > Date.now());
        
        if (session) {
            this.currentUser = this.db.getUserById(session.userId);
            this.updateUserInterface();
            return true;
        } else {
            this.logout();
            return false;
        }
    }

    // Fazer login
    async login(email, password) {
        try {
            const user = this.db.getUserByEmail(email);
            
            if (!user) {
                throw new Error('Usuário não encontrado');
            }

            if (user.password !== password) {
                throw new Error('Senha incorreta');
            }

            // Criar sessão
            const token = this.generateSessionToken();
            const sessions = JSON.parse(localStorage.getItem('fastwork_sessions') || '[]');
            
            // Remover sessões expiradas
            const validSessions = sessions.filter(s => s.expiresAt > Date.now());
            
            // Adicionar nova sessão (24 horas)
            validSessions.push({
                token: token,
                userId: user.id,
                createdAt: Date.now(),
                expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
            });

            localStorage.setItem('fastwork_sessions', JSON.stringify(validSessions));
            localStorage.setItem('fastwork_session_token', token);

            // Atualizar último login
            this.db.updateLastLogin(user.id);
            
            this.currentUser = user;
            this.updateUserInterface();

            return {
                success: true,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    type: user.type,
                    avatar: user.avatar
                },
                message: `Bem-vindo(a), ${user.name}!`
            };

        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Fazer logout
    logout() {
        const token = localStorage.getItem('fastwork_session_token');
        if (token) {
            // Remover sessão específica
            const sessions = JSON.parse(localStorage.getItem('fastwork_sessions') || '[]');
            const filteredSessions = sessions.filter(s => s.token !== token);
            localStorage.setItem('fastwork_sessions', JSON.stringify(filteredSessions));
        }

        localStorage.removeItem('fastwork_session_token');
        this.currentUser = null;
        this.updateUserInterface();
        
        // Redirecionar para página de login
        if (window.location.pathname !== '/login.html') {
            window.location.href = 'login.html';
        }
    }

    // Verificar se usuário está logado
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Obter usuário atual
    getCurrentUser() {
        return this.currentUser;
    }

    // Verificar permissões
    hasPermission(permission) {
        if (!this.currentUser) return false;
        return this.currentUser.permissions && this.currentUser.permissions.includes(permission);
    }

    // Atualizar interface baseada no usuário
    updateUserInterface() {
        if (this.currentUser) {
            this.showUserProfile();
            this.updateMenuBasedOnUserType();
        } else {
            this.showLoginOptions();
        }
    }

    // Mostrar perfil do usuário
    showUserProfile() {
        const userProfileElements = document.querySelectorAll('.user-profile-display');
        userProfileElements.forEach(element => {
            element.innerHTML = `
                <div class="user-info">
                    <img src="${this.currentUser.avatar}" alt="Avatar" class="user-avatar">
                    <div class="user-details">
                        <strong>${this.currentUser.name}</strong>
                        <small>${this.currentUser.type.charAt(0).toUpperCase() + this.currentUser.type.slice(1)}</small>
                    </div>
                    <button onclick="authSystem.logout()" class="btn-logout">
                        <i class="bi bi-box-arrow-right"></i>
                    </button>
                </div>
            `;
        });
    }

    // Mostrar opções de login
    showLoginOptions() {
        const userProfileElements = document.querySelectorAll('.user-profile-display');
        userProfileElements.forEach(element => {
            element.innerHTML = `
                <button onclick="window.location.href='login.html'" class="btn-login">
                    <i class="bi bi-box-arrow-in-right"></i> Entrar
                </button>
            `;
        });
    }

    // Atualizar menu baseado no tipo de usuário
    updateMenuBasedOnUserType() {
        if (!this.currentUser) return;

        const dynamicMenuElements = document.querySelectorAll('.dynamic-menu');
        dynamicMenuElements.forEach(menu => {
            let menuItems = '';

            switch (this.currentUser.type) {
                case 'admin':
                    menuItems = `
                        <a href="ts1.html"><i class="bi bi-house"></i> Página Principal</a>
                        <a href="dashboard.html"><i class="bi bi-speedometer2"></i> Dashboard</a>
                        <a href="empregos.html"><i class="bi bi-briefcase"></i> Gerenciar Vagas</a>
                        <a href="sobre.html"><i class="bi bi-people"></i> Gerenciar Usuários</a>
                    `;
                    break;
                case 'empresa':
                    menuItems = `
                        <a href="ts1.html"><i class="bi bi-house"></i> Página Principal</a>
                        <a href="dashboard.html"><i class="bi bi-speedometer2"></i> Dashboard</a>
                        <a href="empregos.html"><i class="bi bi-plus-circle"></i> Publicar Vaga</a>
                        <a href="cadastroem.html"><i class="bi bi-building"></i> Perfil da Empresa</a>
                    `;
                    break;
                case 'profissional':
                    menuItems = `
                        <a href="ts1.html"><i class="bi bi-house"></i> Página Principal</a>
                        <a href="dashboard.html"><i class="bi bi-speedometer2"></i> Dashboard</a>
                        <a href="empregos.html"><i class="bi bi-search"></i> Buscar Vagas</a>
                        <a href="formu.html"><i class="bi bi-person-gear"></i> Meu Perfil</a>
                    `;
                    break;
            }

            menu.innerHTML = menuItems;
        });
    }
}

// ========================================
// CONSUMO DE APIs EXTERNAS
// ========================================

class APIService {
    constructor() {
        this.baseUrls = {
            cep: 'https://viacep.com.br/ws',
            quotes: 'https://api.quotable.io',
            github: 'https://api.github.com',
            jobsMock: 'https://jsonplaceholder.typicode.com'
        };
    }

    // Buscar CEP
    async buscarCEP(cep) {
        try {
            const cleanCep = cep.replace(/\D/g, '');
            if (cleanCep.length !== 8) {
                throw new Error('CEP deve ter 8 dígitos');
            }

            const response = await fetch(`${this.baseUrls.cep}/${cleanCep}/json/`);
            const data = await response.json();

            if (data.erro) {
                throw new Error('CEP não encontrado');
            }

            return {
                success: true,
                data: {
                    cep: data.cep,
                    logradouro: data.logradouro,
                    complemento: data.complemento,
                    bairro: data.bairro,
                    localidade: data.localidade,
                    uf: data.uf,
                    ibge: data.ibge,
                    gia: data.gia,
                    ddd: data.ddd,
                    siafi: data.siafi
                }
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Obter citação motivacional
    async obterCitacaoMotivacional() {
        try {
            const response = await fetch(`${this.baseUrls.quotes}/random?tags=motivational|inspirational`);
            const data = await response.json();

            return {
                success: true,
                data: {
                    content: data.content,
                    author: data.author,
                    tags: data.tags
                }
            };
        } catch (error) {
            return {
                success: false,
                message: 'Erro ao buscar citação motivacional',
                data: {
                    content: 'O sucesso é a soma de pequenos esforços repetidos dia após dia.',
                    author: 'Robert Collier',
                    tags: ['motivacional']
                }
            };
        }
    }

    // Buscar usuário do GitHub
    async buscarUsuarioGitHub(username) {
        try {
            const response = await fetch(`${this.baseUrls.github}/users/${username}`);
            if (!response.ok) {
                throw new Error('Usuário não encontrado');
            }

            const data = await response.json();
            
            return {
                success: true,
                data: {
                    login: data.login,
                    name: data.name,
                    avatar_url: data.avatar_url,
                    bio: data.bio,
                    public_repos: data.public_repos,
                    followers: data.followers,
                    following: data.following,
                    html_url: data.html_url,
                    created_at: data.created_at,
                    location: data.location,
                    company: data.company
                }
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Simular busca de vagas (usando JSONPlaceholder como mock)
    async buscarVagas() {
        try {
            const response = await fetch(`${this.baseUrls.jobsMock}/posts`);
            const posts = await response.json();

            // Transformar posts em vagas simuladas
            const vagas = posts.slice(0, 10).map((post, index) => ({
                id: post.id,
                titulo: this.gerarTituloVaga(index),
                empresa: this.gerarNomeEmpresa(index),
                descricao: post.body.substring(0, 100) + '...',
                salario: this.gerarSalario(),
                localizacao: this.gerarLocalizacao(index),
                tipo: this.gerarTipoVaga(index),
                nivel: this.gerarNivelVaga(index),
                publicadoEm: this.gerarDataPublicacao(),
                tags: this.gerarTags(index)
            }));

            return {
                success: true,
                data: vagas
            };
        } catch (error) {
            return {
                success: false,
                message: 'Erro ao buscar vagas'
            };
        }
    }

    // Métodos auxiliares para simulação de vagas
    gerarTituloVaga(index) {
        const titulos = [
            'Desenvolvedor Frontend React',
            'Designer UX/UI',
            'Analista de Dados',
            'Desenvolvedor Backend Node.js',
            'Gerente de Projetos',
            'Especialista em Marketing Digital',
            'Desenvolvedor Full Stack',
            'Analista de Sistemas',
            'Product Manager',
            'DevOps Engineer'
        ];
        return titulos[index] || 'Vaga de Emprego';
    }

    gerarNomeEmpresa(index) {
        const empresas = [
            'TechCorp Solutions',
            'Innovate Brasil',
            'Digital Future',
            'CodeCraft',
            'DataMind',
            'WebSolutions',
            'NextGen Tech',
            'CloudFirst',
            'AgileWorks',
            'StartupHub'
        ];
        return empresas[index] || 'Empresa';
    }

    gerarSalario() {
        const salarios = ['R$ 3.000 - R$ 5.000', 'R$ 5.000 - R$ 8.000', 'R$ 8.000 - R$ 12.000', 'A combinar'];
        return salarios[Math.floor(Math.random() * salarios.length)];
    }

    gerarLocalizacao(index) {
        const localizacoes = [
            'São Paulo, SP',
            'Rio de Janeiro, RJ',
            'Belo Horizonte, MG',
            'Porto Alegre, RS',
            'Curitiba, PR',
            'Salvador, BA',
            'Fortaleza, CE',
            'Brasília, DF',
            'Recife, PE',
            'Remote'
        ];
        return localizacoes[index] || 'São Paulo, SP';
    }

    gerarTipoVaga(index) {
        const tipos = ['CLT', 'PJ', 'Freelancer', 'Estágio'];
        return tipos[index % tipos.length];
    }

    gerarNivelVaga(index) {
        const niveis = ['Júnior', 'Pleno', 'Sênior', 'Especialista'];
        return niveis[index % niveis.length];
    }

    gerarDataPublicacao() {
        const dias = Math.floor(Math.random() * 30) + 1;
        const data = new Date();
        data.setDate(data.getDate() - dias);
        return data.toISOString().split('T')[0];
    }

    gerarTags(index) {
        const todasTags = [
            ['React', 'JavaScript', 'CSS'],
            ['Figma', 'Adobe XD', 'Prototipagem'],
            ['Python', 'SQL', 'Power BI'],
            ['Node.js', 'MongoDB', 'API'],
            ['Scrum', 'Agile', 'Liderança'],
            ['SEO', 'Google Ads', 'Analytics'],
            ['Vue.js', 'PHP', 'MySQL'],
            ['Java', 'Spring', 'Microservices'],
            ['Product', 'Analytics', 'UX'],
            ['Docker', 'AWS', 'CI/CD']
        ];
        return todasTags[index] || ['Tecnologia'];
    }
}

// ========================================
// UTILITÁRIOS DE INTERFACE
// ========================================

class UIUtils {
    static showAlert(message, type = 'info') {
        const alertContainer = document.getElementById('alert-container') || document.body;
        
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.setAttribute('role', 'alert');
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;

        alertContainer.appendChild(alertDiv);

        // Auto-remover após 5 segundos
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }

    static showLoading(show = true) {
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.style.display = show ? 'block' : 'none';
        }
    }

    static formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('pt-BR');
    }

    static formatCPF(cpf) {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    static formatCNPJ(cnpj) {
        return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }

    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

// ========================================
// INICIALIZAÇÃO GLOBAL
// ========================================

// Instâncias globais
let authSystem;
let apiService;

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    authSystem = new AuthenticationSystem();
    apiService = new APIService();

    // Adicionar estilos CSS para componentes de autenticação
    addAuthStyles();

    console.log('Sistema de autenticação inicializado');
    console.log('Usuários disponíveis:', authSystem.db.getAllUsers());
});

// Adicionar estilos CSS
function addAuthStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .user-info {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px;
            background: rgba(255,255,255,0.1);
            border-radius: 10px;
        }

        .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            object-fit: cover;
        }

        .user-details {
            display: flex;
            flex-direction: column;
        }

        .user-details strong {
            font-size: 14px;
            color: var(--text-color, #333);
        }

        .user-details small {
            font-size: 12px;
            opacity: 0.8;
        }

        .btn-logout, .btn-login {
            background: transparent;
            border: 1px solid currentColor;
            padding: 8px 12px;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .btn-logout:hover, .btn-login:hover {
            background: rgba(255,255,255,0.1);
        }

        .dynamic-menu {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }

        .dynamic-menu a {
            padding: 10px 15px;
            text-decoration: none;
            color: inherit;
            border-radius: 5px;
            transition: background 0.3s ease;
        }

        .dynamic-menu a:hover {
            background: rgba(255,255,255,0.1);
        }

        .alert {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .alert-success {
            background-color: #d4edda;
            border-color: #c3e6cb;
            color: #155724;
        }

        .alert-danger {
            background-color: #f8d7da;
            border-color: #f5c6cb;
            color: #721c24;
        }

        .alert-info {
            background-color: #cce7ff;
            border-color: #b3d9ff;
            color: #004085;
        }

        #loading {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 99999;
        }

        #loading::after {
            content: '';
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    // Adicionar container de loading se não existir
    if (!document.getElementById('loading')) {
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'loading';
        document.body.appendChild(loadingDiv);
    }

    // Adicionar container de alertas se não existir
    if (!document.getElementById('alert-container')) {
        const alertContainer = document.createElement('div');
        alertContainer.id = 'alert-container';
        alertContainer.style.position = 'fixed';
        alertContainer.style.top = '20px';
        alertContainer.style.right = '20px';
        alertContainer.style.zIndex = '9999';
        document.body.appendChild(alertContainer);
    }
}

// ========================================
// FUNÇÕES GLOBAIS DE CONVENIÊNCIA
// ========================================

// Função para fazer login (usar em formulários)
async function fazerLogin(email, password) {
    UIUtils.showLoading(true);
    const result = await authSystem.login(email, password);
    UIUtils.showLoading(false);
    
    if (result.success) {
        UIUtils.showAlert(result.message, 'success');
        // Redirecionar baseado no tipo de usuário
        setTimeout(() => {
            // Redirecionar todos os usuários para a página principal
            window.location.href = 'ts1.html';
        }, 1500);
    } else {
        UIUtils.showAlert(result.message, 'danger');
    }
    
    return result;
}

// Função para logout
function fazerLogout() {
    authSystem.logout();
    UIUtils.showAlert('Logout realizado com sucesso!', 'info');
}

// Função para buscar CEP
async function buscarCEPUsuario(cep) {
    UIUtils.showLoading(true);
    const result = await apiService.buscarCEP(cep);
    UIUtils.showLoading(false);
    return result;
}

// Função para obter citação motivacional
async function obterCitacao() {
    UIUtils.showLoading(true);
    const result = await apiService.obterCitacaoMotivacional();
    UIUtils.showLoading(false);
    return result;
}

// Função para buscar usuário GitHub
async function buscarGitHub(username) {
    UIUtils.showLoading(true);
    const result = await apiService.buscarUsuarioGitHub(username);
    UIUtils.showLoading(false);
    return result;
}

// Função para buscar vagas
async function buscarVagasDisponiveis() {
    UIUtils.showLoading(true);
    const result = await apiService.buscarVagas();
    UIUtils.showLoading(false);
    return result;
}
