/* Interactive JS: menu, chat "IA", contact form, utilities */

document.addEventListener('DOMContentLoaded', () => {
  // NAV hamburger
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  hamburger && hamburger.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!expanded));
    navMenu.classList.toggle('open');
  });

  // Theme toggle
  const themeToggle = document.getElementById('themeToggle');
  themeToggle && themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const icon = themeToggle.querySelector('i');
    if (document.body.classList.contains('dark')) icon.className = 'fas fa-sun';
    else icon.className = 'fas fa-moon';
  });

  // Current year in footer
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Back to top visibility
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) backToTop.style.display = 'block';
    else backToTop.style.display = 'none';
  });

  // Contact form (simulado)
  const contactForm = document.getElementById('contactForm');
  contactForm && contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Enviando...';
    setTimeout(() => {
      alert('Mensagem enviada! Vou responder o mais rápido possível.');
      contactForm.reset();
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Mensagem';
    }, 1000);
  });

  // Copy email button
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  copyEmailBtn && copyEmailBtn.addEventListener('click', async () => {
    const email = document.getElementById('emailCopy').textContent.trim();
    try {
      await navigator.clipboard.writeText(email);
      copyEmailBtn.innerHTML = '<i class="fas fa-check"></i>';
      setTimeout(() => copyEmailBtn.innerHTML = '<i class="far fa-copy"></i>', 1500);
    } catch {
      alert('Não foi possível copiar. Use seleção manual.');
    }
  });

  /* ===== CHATBOT SIMULADO (IA) ===== */
  const chatToggle = document.getElementById('chatToggle');
  const chatWindow = document.getElementById('chatWindow');
  const chatClose = document.getElementById('chatClose');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatMessages = document.getElementById('chatMessages');

  const openChat = () => {
    chatWindow.hidden = false;
    chatInput.focus();
    if (!chatMessages.innerHTML) addBotMessage('Olá! Eu sou o assistente do Filipe. Pergunte algo sobre experiência, idiomas, disponibilidade ou como contratar.');
  };
  const closeChat = () => { chatWindow.hidden = true; };

  chatToggle && chatToggle.addEventListener('click', () => {
    if (chatWindow.hidden) openChat(); else closeChat();
  });
  chatClose && chatClose.addEventListener('click', closeChat);

  // Predefined answers
  const ANSWERS = [
    {
      keywords: ['onde trabalhou','empresas','trabalhou','experiências'],
      reply: `Já trabalhei em 4 empresas:
1. Paco Services (Assistente Virtual) — Out 2025 - Atual
2. Intertrade Nutrição (Vendedor Call Center) — Ago 2025 - Out 2025
3. Euro Exim Bank (Consultor de Vendas) — Ago 2024 - Out 2025
4. RWS Group (Atendimento & Suporte) — Set 2024 - 2025
Todas as posições foram em regime remoto quando indicado. Quer detalhes de alguma?`
    },
    {
      keywords: ['paco','paco services','assistente virtual'],
      reply: `Paco Services — Assistente Virtual (Out 2025 - Atual):
- Gestão de contactos com empresas e fornecedores
- Organização de arquivos e dados (Google Workspace, Trello)
- Pesquisa e suporte operacional diário`
    },
    {
      keywords: ['intertrade','nutrição','vendedor','call center'],
      reply: `Intertrade Nutrição — Vendedor Call Center (Ago 2025 - Out 2025):
- Vendas consultivas de produtos de saúde
- Identificação de necessidades e follow-up para fidelização`
    },
    {
      keywords: ['euro exim','consultor','euro'],
      reply: `Euro Exim Bank — Consultor de Vendas (Ago 2024 - Out 2025):
- Desenvolvimento de estratégias de vendas
- Uso de CRM para aumentar conversões e retenção`
    },
    {
      keywords: ['rws','rws group','suporte em vendas','atendimento'],
      reply: `RWS Group — Atendimento & Suporte em Vendas (Set 2024 - 2025):
- Atendimento multicanal (email/telefone)
- Apoio à conversão e resolução de solicitações`
    },
    {
      keywords: ['idioma','idiomas','falar','línguas','lingua'],
      reply: `Falo 3 idiomas:
- Português — Nativo / Fluente
- Lingala — Fluente
- Francês — Básico`
    },
    {
      keywords: ['crm','google workspace','trello','ferramentas'],
      reply: `Principais ferramentas: Google Workspace, Trello, sistemas CRM e e-mail comercial. Uso diário para organização, acompanhamento e suporte ao cliente.`
    },
    {
      keywords: ['disponível','home','remoto','remote'],
      reply: `Sim — Disponível para oportunidades remotas (Home Office). Aberto a colaborar com equipes multiculturais.`
    },
    {
      keywords: ['curriculo','cv','resumo','pdf','download'],
      reply: `Você pode baixar o currículo clicando em "Baixar Currículo" (botão no topo) ou acessar: assets/curriculo.pdf`
    },
    {
      keywords: ['como','contratar','contratação','contratar o filipe','contratar filipe'],
      reply: `Para contratar, entre em contato por e-mail (seu.email@provedor.com) ou preencha o formulário de contato na seção "Contato". Posso também agendar uma conversa via WhatsApp se preferir.`
    }
  ];

  function addMessage(text, who='bot') {
    const div = document.createElement('div');
    div.className = `msg ${who === 'user' ? 'user' : 'bot'}`;
    div.textContent = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function addBotMessage(text) {
    // simulate typing with small delay
    const typing = document.createElement('div');
    typing.className = 'msg bot';
    typing.textContent = '...';
    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    setTimeout(() => {
      chatMessages.removeChild(typing);
      addMessage(text, 'bot');
    }, 700 + Math.random() * 700);
  }

  function findAnswer(message) {
    const msg = message.toLowerCase();
    for (const item of ANSWERS) {
      if (item.keywords.some(k => msg.includes(k))) return item.reply;
    }
    // fallback suggestions
    if (msg.includes('oi') || msg.includes('olá') || msg.includes('ola')) return 'Olá! Como posso ajudar? Pergunte sobre experiência, idiomas, disponibilidade ou currículo.';
    return `Desculpe, não entendi perfeitamente. Você pode perguntar, por exemplo: "Quais idiomas?", "Onde trabalhou?", "Tem experiência com CRM?" ou enviar seu e-mail pelo formulário de contato.`;
  }

  chatForm && chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;
    addMessage(text, 'user');
    chatInput.value = '';
    const answer = findAnswer(text);
    addBotMessage(answer);
  });

  // Preload welcome message if user opens chat
  // (Handled in openChat)

});