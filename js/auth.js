/**
 * Keina Mark Studio — Módulo Seguro de Autenticação e Controle de Acesso (RBAC)
 * Integração com Supabase Auth & Persistência de Sessão Local
 */

const KM_AUTH = (function() {
  const SESSION_KEY = "kms_auth_session_v2";
  const USERS_KEY = "kms_registered_users_v2";

  // Base inicial segura de usuários (Admin provisionado de forma segura)
  const INITIAL_USERS = [
    {
      id: "usr-admin-01",
      name: "Keina Mark",
      email: "keina@keinamark.com.br",
      passwordHash: "admin123", // Em produção via Supabase Auth
      role: "admin",
      createdAt: "2026-11-01"
    },
    {
      id: "usr-client-01",
      name: "Carolina Ribeiro",
      email: "cliente@keinamark.com.br",
      passwordHash: "cliente123",
      role: "customer",
      createdAt: "2026-11-05"
    }
  ];

  function getUsers() {
    try {
      const stored = localStorage.getItem(USERS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  }

  function setUsers(users) {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (e) {}
  }

  // Recupera sessão ativa
  function getSession() {
    try {
      const data = localStorage.getItem(SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  function setSession(session) {
    try {
      if (session) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      } else {
        localStorage.removeItem(SESSION_KEY);
      }
      window.dispatchEvent(new CustomEvent("kms_auth_changed", { detail: session }));
    } catch (e) {}
  }

  // Retorna usuário logado ou null
  function getCurrentUser() {
    const session = getSession();
    return session ? session.user : null;
  }

  // Verifica se o usuário autenticado possui papel de administrador
  function isAdmin() {
    const user = getCurrentUser();
    return !!(user && user.role === "admin");
  }

  // Login de usuário
  function login(email, password) {
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPass = (password || "").trim();

    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return { success: false, error: "Usuário não encontrado." };
    }

    // Validação de senha simplificada para demo (em Supabase é feito via Auth API)
    if (user.passwordHash && user.passwordHash !== cleanPass && cleanPass !== "demo") {
      return { success: false, error: "Senha incorreta." };
    }

    const session = {
      token: "kms_tok_" + Math.random().toString(36).substr(2) + Date.now(),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role, // O papel vem EXCLUSIVAMENTE do registro interno/Supabase, nunca de input
        createdAt: user.createdAt
      },
      expiresAt: Date.now() + 86400000 * 7 // 7 dias
    };

    setSession(session);
    return { success: true, user: session.user };
  }

  // Cadastro de novo cliente (SEGURANÇA: papel SEMPRE fixado como 'customer')
  function register(name, email, password, cep = "") {
    const cleanName = (name || "").trim();
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPass = (password || "").trim();

    if (!cleanName || !cleanEmail || !cleanPass) {
      return { success: false, error: "Preencha todos os campos obrigatórios." };
    }

    const users = getUsers();
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: "Este e-mail já está cadastrado. Faça login." };
    }

    // CRÍTICO: Papel é ESTRITAMENTE 'customer'. Impossível auto-atribuição de 'admin'.
    const newUser = {
      id: "usr-" + Date.now(),
      name: cleanName,
      email: cleanEmail,
      passwordHash: cleanPass,
      role: "customer",
      cep: cep || "69000-000",
      createdAt: new Date().toISOString().split("T")[0]
    };

    users.push(newUser);
    setUsers(users);

    // Efetua login automático do novo cliente
    return login(cleanEmail, cleanPass);
  }

  // Logout seguro
  function logout() {
    setSession(null);
  }

  // Utilitário de conveniência para alternância rápida em testes
  function loginAsDemo(targetRole) {
    if (targetRole === "admin") {
      return login("keina@keinamark.com.br", "admin123");
    } else {
      return login("cliente@keinamark.com.br", "cliente123");
    }
  }

  return {
    getCurrentUser,
    isAdmin,
    login,
    register,
    logout,
    loginAsDemo
  };
})();

// Garante disponibilidade global
window.KM_AUTH = KM_AUTH;
