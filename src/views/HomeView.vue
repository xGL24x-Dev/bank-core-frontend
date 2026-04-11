<template>
  <div class="home">

    <!-- NAVBAR -->
    <nav class="navbar">
      <div class="nav-brand">
        <img src="@/assets/nexofin_logo.png" alt="NexoFin" class="nav-logo" />
      </div>
      <div class="nav-links">
        <a href="#servicios" class="nav-link">Servicios</a>
        <a href="#seguridad" class="nav-link">Seguridad</a>
        <a href="#contacto" class="nav-link">Contacto</a>
        <router-link to="/login" class="btn-login">Iniciar sesión</router-link>
        <router-link to="/register" class="btn-register">Abrir cuenta</router-link>
      </div>
    </nav>

    <!-- HERO -->
    <section class="hero">
      <div class="hero-bg">
        <div class="orb orb--1"></div>
        <div class="orb orb--2"></div>
        <div class="orb orb--3"></div>
        <div class="grid"></div>
      </div>
      <div class="hero-content">
        <div class="hero-badge">🇨🇴 Banca Digital Colombiana</div>
        <h1 class="hero-title">
          Gestiona tus finanzas<br/>
          <span class="gradient-text">con total confianza</span>
        </h1>
        <p class="hero-subtitle">
          NexoFin es el sistema bancario digital diseñado para colombianos.
          Consulta saldos, realiza transferencias, solicita préstamos y
          controla tus movimientos desde cualquier lugar del país.
        </p>
        <div class="hero-actions">
          <router-link to="/register" class="btn-primary">
            Abrir mi cuenta
            <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
          </router-link>
          <router-link to="/login" class="btn-outline">
            Ingresar a mi cuenta
          </router-link>
        </div>
        <div class="hero-stats">
          <div class="stat">
            <span class="stat-number">+5.000</span>
            <span class="stat-label">Usuarios activos</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-number">$500M+</span>
            <span class="stat-label">En transacciones COP</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-number">99.9%</span>
            <span class="stat-label">Disponibilidad</span>
          </div>
        </div>
      </div>
      <div class="hero-visual">
        <div class="card-mockup">
          <div class="mockup-card">
            <div class="mockup-card-top">
              <span class="mockup-bank">NexoFin</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="mockup-chip">
                <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3v4M8 3v4M2 11h20"/>
              </svg>
            </div>
            <div class="mockup-number">4242 •••• •••• 8821</div>
            <div class="mockup-bottom">
              <div>
                <div class="mockup-label">Titular</div>
                <div class="mockup-value">Carlos Díaz</div>
              </div>
              <div>
                <div class="mockup-label">Vence</div>
                <div class="mockup-value">12/28</div>
              </div>
            </div>
          </div>
          <div class="mockup-balance">
            <div class="balance-label">Saldo disponible</div>
            <div class="balance-amount">$12.450.800</div>
            <div class="balance-change">↑ +2.4% este mes</div>
          </div>
          <div class="mockup-transactions">
            <div class="tx" v-for="tx in transactions" :key="tx.id">
              <div class="tx-icon">{{ tx.icon }}</div>
              <div class="tx-info">
                <div class="tx-name">{{ tx.name }}</div>
                <div class="tx-date">{{ tx.date }}</div>
              </div>
              <div class="tx-amount" :class="tx.type">{{ tx.amount }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SERVICIOS -->
    <section class="features" id="servicios">
      <div class="section-header">
        <div class="section-badge">🏦 Nuestros Servicios</div>
        <h2 class="section-title">Todo lo que necesitas en un solo lugar</h2>
        <p class="section-sub">Productos financieros pensados para los colombianos</p>
      </div>
      <div class="features-grid">
        <div class="feature-card" v-for="f in features" :key="f.title">
          <div class="feature-icon">{{ f.icon }}</div>
          <h3 class="feature-title">{{ f.title }}</h3>
          <p class="feature-desc">{{ f.desc }}</p>
        </div>
      </div>
    </section>

    <!-- SEGURIDAD -->
    <section class="security" id="seguridad">
      <div class="security-content">
        <div class="section-badge">🔒 Seguridad Bancaria</div>
        <h2 class="section-title">Tu dinero protegido bajo la normativa colombiana</h2>
        <p class="section-sub">
          Cumplimos con la Superintendencia Financiera de Colombia y aplicamos
          los más altos estándares de seguridad para proteger cada operación.
        </p>
        <div class="security-list">
          <div class="security-item" v-for="s in security" :key="s">
            <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
            {{ s }}
          </div>
        </div>
        <router-link to="/register" class="btn-primary">Abrir cuenta segura</router-link>
      </div>
      <div class="security-visual">
        <div class="shield-box">
          <div class="shield-icon">🛡️</div>
          <div class="shield-title">Protección 24/7</div>
          <div class="shield-sub">Monitoreo permanente de todas tus operaciones bancarias</div>
          <div class="shield-badges">
            <span class="badge">SSL 256-bit</span>
            <span class="badge">2FA</span>
            <span class="badge">JWT Auth</span>
            <span class="badge">Cifrado</span>
            <span class="badge">SFC</span>
          </div>
        </div>
      </div>
    </section>

    <!-- TIPOS DE CUENTA -->
    <section class="accounts-section">
      <div class="section-header">
        <div class="section-badge">💼 Tipos de Cuenta</div>
        <h2 class="section-title">Elige la cuenta que se adapta a ti</h2>
        <p class="section-sub">Productos diseñados para cada etapa de tu vida financiera</p>
      </div>
      <div class="accounts-grid">
        <div class="account-card" v-for="a in accountTypes" :key="a.name">
          <div class="account-icon">{{ a.icon }}</div>
          <h3 class="account-name">{{ a.name }}</h3>
          <p class="account-desc">{{ a.desc }}</p>
          <ul class="account-features">
            <li v-for="f in a.features" :key="f">✓ {{ f }}</li>
          </ul>
          <router-link to="/register" class="btn-account">Abrir esta cuenta</router-link>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta">
      <div class="cta-orb cta-orb--1"></div>
      <div class="cta-orb cta-orb--2"></div>
      <h2 class="cta-title">¿Listo para gestionar tus finanzas en Colombia?</h2>
      <p class="cta-sub">Únete a miles de colombianos que ya confían en NexoFin</p>
      <router-link to="/register" class="btn-primary btn-lg">
        Abrir mi cuenta ahora
      </router-link>
    </section>

    <!-- CONTACTO -->
    <section class="contact-section" id="contacto">
      <div class="section-header">
        <div class="section-badge">📞 Atención al Cliente</div>
        <h2 class="section-title">¿Necesitas ayuda?</h2>
        <p class="section-sub">Estamos disponibles para atenderte en todo Colombia</p>
      </div>
      <div class="contact-grid">
        <div class="contact-card" v-for="c in contacts" :key="c.title">
          <div class="contact-icon">{{ c.icon }}</div>
          <h3 class="contact-title">{{ c.title }}</h3>
          <p class="contact-info">{{ c.info }}</p>
          <p class="contact-hours">{{ c.hours }}</p>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="footer">
      <div class="footer-top">
        <div class="footer-brand">
          <img src="@/assets/nexofin_logo.png" alt="NexoFin" class="footer-logo" />
          <p>La banca digital colombiana que conecta tu futuro financiero.</p>
          <p class="footer-reg">NIT: 900.123.456-7 | Vigilado Superfinanciera</p>
        </div>
        <div class="footer-col">
          <h4>Servicios</h4>
          <a href="#">Cuentas de ahorro</a>
          <a href="#">Cuentas corrientes</a>
          <a href="#">Préstamos</a>
          <a href="#">Transferencias</a>
        </div>
        <div class="footer-col">
          <h4>Legal</h4>
          <a href="#">Política de privacidad</a>
          <a href="#">Términos y condiciones</a>
          <a href="#">Tarifas y costos</a>
          <a href="#">SARLAFT</a>
        </div>
        <div class="footer-col">
          <h4>Contacto</h4>
          <a href="#">Línea gratuita: 01 8000 123 456</a>
          <a href="#">contacto@nexofin.com.co</a>
          <a href="#">Bogotá, Colombia</a>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2025 NexoFin S.A.S. Todos los derechos reservados.</span>
        <span>Vigilado por la Superintendencia Financiera de Colombia</span>
      </div>
    </footer>

  </div>
</template>

<script setup>
const transactions = [
  { id: 1, icon: '🛒', name: 'Éxito', date: 'Hoy 10:30', amount: '-$45.000', type: 'debit' },
  { id: 2, icon: '💼', name: 'Nómina empresa', date: 'Ayer 09:00', amount: '+$2.500.000', type: 'credit' },
  { id: 3, icon: '⚡', name: 'Celsia', date: '28 Mar', amount: '-$80.000', type: 'debit' },
]

const features = [
  { icon: '💳', title: 'Cuenta de Ahorros', desc: 'Abre tu cuenta de ahorros sin cuota de manejo y con rendimientos competitivos en pesos colombianos.' },
  { icon: '⚡', title: 'Transferencias PSE', desc: 'Envía y recibe dinero a cualquier banco colombiano de forma inmediata y segura.' },
  { icon: '📊', title: 'Control de Gastos', desc: 'Visualiza tus movimientos en pesos y toma mejores decisiones financieras.' },
  { icon: '🏦', title: 'Créditos de Libre Inversión', desc: 'Solicita tu crédito con tasas en DTF y aprobación en minutos, sin papeleo.' },
  { icon: '🔔', title: 'Alertas por SMS y Correo', desc: 'Recibe notificaciones de cada transacción al instante en tu celular.' },
  { icon: '📱', title: 'Banca Móvil 24/7', desc: 'Accede a tus productos financieros desde cualquier lugar de Colombia.' },
]

const security = [
  'Vigilado por la Superintendencia Financiera de Colombia',
  'Cifrado SSL de 256 bits en todas las conexiones',
  'Autenticación de dos factores (2FA)',
  'Sistema de prevención de fraudes en tiempo real',
  'Cumplimiento con la Ley 1581 de Habeas Data',
  'Certificación PCI DSS para pagos con tarjeta',
]

const accountTypes = [
  {
    icon: '💰',
    name: 'Cuenta de Ahorros',
    desc: 'Ideal para guardar y hacer crecer tu dinero sin complicaciones.',
    features: ['Sin cuota de manejo', 'Rendimientos anuales', 'Tarjeta débito gratis', 'Retiros en cajeros Bancolombia'],
  },
  {
    icon: '🏢',
    name: 'Cuenta Corriente',
    desc: 'Perfecta para empresas y personas naturales con alto movimiento.',
    features: ['Chequera disponible', 'Sobregiro autorizado', 'Extracto mensual', 'Múltiples firmas'],
  },
  {
    icon: '🎓',
    name: 'Cuenta Universitaria',
    desc: 'Diseñada para estudiantes universitarios colombianos.',
    features: ['Cero cuota de manejo', 'Descuentos en aliados', 'App móvil gratuita', 'Sin saldo mínimo'],
  },
]

const contacts = [
  { icon: '📞', title: 'Línea Gratuita Nacional', info: '01 8000 123 456', hours: 'Lunes a viernes 8am - 5pm' },
  { icon: '💬', title: 'Chat en Línea', info: 'nexofin.com.co/chat', hours: 'Disponible 24/7' },
  { icon: '📧', title: 'Correo Electrónico', info: 'contacto@nexofin.com.co', hours: 'Respuesta en menos de 24 horas' },
  { icon: '📍', title: 'Oficina Principal', info: 'Cra 7 # 32-16, Bogotá D.C.', hours: 'Lunes a viernes 8am - 5pm' },
]
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
.home { font-family: 'Inter', sans-serif; color: #212529; background: #fff; overflow-x: hidden; }

/* NAVBAR */
.navbar { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 0.9rem 4rem; background: rgba(255,255,255,0.92); backdrop-filter: blur(16px); border-bottom: 1px solid rgba(0,123,255,0.08); box-shadow: 0 1px 12px rgba(0,0,0,0.06); }
.nav-logo { height: 42px; width: auto; }
.nav-links { display: flex; align-items: center; gap: 2rem; }
.nav-link { color: #6C757D; text-decoration: none; font-size: 0.9rem; font-weight: 500; transition: color 0.2s; }
.nav-link:hover { color: #007BFF; }
.btn-login { color: #007BFF; text-decoration: none; font-size: 0.9rem; font-weight: 600; }
.btn-login:hover { color: #0056b3; }
.btn-register { background: #007BFF; color: #fff; text-decoration: none; font-size: 0.88rem; font-weight: 600; padding: 0.55rem 1.25rem; border-radius: 8px; transition: background 0.2s, transform 0.15s; }
.btn-register:hover { background: #0069d9; transform: translateY(-1px); }

/* HERO */
.hero { min-height: 100vh; display: flex; align-items: center; justify-content: space-between; padding: 7rem 4rem 4rem; position: relative; overflow: hidden; background: linear-gradient(135deg, #eef2ff 0%, #f0fdf4 50%, #eff6ff 100%); gap: 3rem; }
.hero-bg { position: absolute; inset: 0; pointer-events: none; }
.orb { position: absolute; border-radius: 50%; filter: blur(80px); }
.orb--1 { width: 500px; height: 500px; background: radial-gradient(circle, rgba(0,123,255,0.15), transparent 70%); top: -100px; left: -100px; }
.orb--2 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(40,167,69,0.12), transparent 70%); bottom: -80px; right: -80px; }
.orb--3 { width: 300px; height: 300px; background: radial-gradient(circle, rgba(0,86,255,0.08), transparent 70%); top: 40%; left: 50%; }
.grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(0,86,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,86,255,0.03) 1px, transparent 1px); background-size: 48px 48px; }

.hero-content { position: relative; z-index: 1; max-width: 560px; }
.hero-badge { display: inline-flex; align-items: center; gap: 0.4rem; background: rgba(0,123,255,0.08); color: #007BFF; font-size: 0.82rem; font-weight: 600; padding: 0.4rem 0.9rem; border-radius: 99px; border: 1px solid rgba(0,123,255,0.15); margin-bottom: 1.5rem; }
.hero-title { font-size: 3.2rem; font-weight: 800; color: #1a202c; line-height: 1.15; letter-spacing: -0.04em; margin-bottom: 1.25rem; }
.gradient-text { background: linear-gradient(135deg, #007BFF, #28A745); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.hero-subtitle { font-size: 1rem; color: #6C757D; line-height: 1.75; margin-bottom: 2rem; }
.hero-actions { display: flex; gap: 1rem; margin-bottom: 2.5rem; flex-wrap: wrap; }

.btn-primary { display: inline-flex; align-items: center; gap: 0.5rem; background: linear-gradient(135deg, #007BFF, #0056d6); color: #fff; text-decoration: none; font-size: 0.95rem; font-weight: 700; padding: 0.85rem 1.75rem; border-radius: 10px; transition: transform 0.15s, box-shadow 0.15s; box-shadow: 0 4px 18px rgba(0,86,255,0.3); border: none; cursor: pointer; }
.btn-primary svg { width: 16px; height: 16px; }
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,86,255,0.4); }
.btn-primary.btn-lg { font-size: 1.05rem; padding: 1rem 2.25rem; }
.btn-outline { display: inline-flex; align-items: center; color: #007BFF; text-decoration: none; font-size: 0.95rem; font-weight: 600; padding: 0.85rem 1.75rem; border-radius: 10px; border: 1.5px solid #007BFF; transition: background 0.15s, transform 0.15s; }
.btn-outline:hover { background: #f0f7ff; transform: translateY(-2px); }

.hero-stats { display: flex; align-items: center; gap: 1.5rem; }
.stat { display: flex; flex-direction: column; }
.stat-number { font-size: 1.5rem; font-weight: 800; color: #1a202c; letter-spacing: -0.02em; }
.stat-label { font-size: 0.75rem; color: #6C757D; }
.stat-divider { width: 1px; height: 36px; background: #dee2e6; }

/* MOCKUP */
.hero-visual { position: relative; z-index: 1; flex-shrink: 0; }
.card-mockup { display: flex; flex-direction: column; gap: 1rem; width: 320px; }
.mockup-card { background: linear-gradient(135deg, #007BFF, #0041a8); border-radius: 18px; padding: 1.5rem; color: #fff; box-shadow: 0 20px 50px rgba(0,86,255,0.3); }
.mockup-card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.mockup-bank { font-size: 1.1rem; font-weight: 700; }
.mockup-chip { width: 28px; height: 28px; opacity: 0.8; }
.mockup-number { font-size: 1rem; letter-spacing: 0.12em; margin-bottom: 1.25rem; opacity: 0.9; }
.mockup-bottom { display: flex; justify-content: space-between; }
.mockup-label { font-size: 0.68rem; opacity: 0.65; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 0.2rem; }
.mockup-value { font-size: 0.9rem; font-weight: 600; }
.mockup-balance { background: #fff; border-radius: 14px; padding: 1.1rem 1.25rem; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
.balance-label { font-size: 0.75rem; color: #6C757D; margin-bottom: 0.3rem; }
.balance-amount { font-size: 1.6rem; font-weight: 800; color: #1a202c; letter-spacing: -0.03em; }
.balance-change { font-size: 0.78rem; color: #28A745; font-weight: 600; margin-top: 0.2rem; }
.mockup-transactions { background: #fff; border-radius: 14px; padding: 1rem 1.25rem; box-shadow: 0 4px 20px rgba(0,0,0,0.08); display: flex; flex-direction: column; gap: 0.75rem; }
.tx { display: flex; align-items: center; gap: 0.75rem; }
.tx-icon { width: 36px; height: 36px; background: #f8f9fa; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; }
.tx-info { flex: 1; }
.tx-name { font-size: 0.83rem; font-weight: 600; color: #1a202c; }
.tx-date { font-size: 0.72rem; color: #6C757D; }
.tx-amount { font-size: 0.85rem; font-weight: 700; }
.tx-amount.credit { color: #28A745; }
.tx-amount.debit { color: #dc3545; }

/* FEATURES */
.features { padding: 6rem 4rem; background: #fff; }
.section-header { text-align: center; margin-bottom: 3.5rem; }
.section-badge { display: inline-flex; align-items: center; gap: 0.4rem; background: rgba(0,123,255,0.08); color: #007BFF; font-size: 0.82rem; font-weight: 600; padding: 0.4rem 0.9rem; border-radius: 99px; border: 1px solid rgba(0,123,255,0.15); margin-bottom: 1rem; }
.section-title { font-size: 2.2rem; font-weight: 800; color: #1a202c; letter-spacing: -0.03em; margin-bottom: 0.75rem; }
.section-sub { font-size: 1rem; color: #6C757D; }
.features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; max-width: 1100px; margin: 0 auto; }
.feature-card { background: #f8faff; border: 1px solid #e9ecef; border-radius: 16px; padding: 2rem; transition: transform 0.2s, box-shadow 0.2s; }
.feature-card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,86,255,0.1); border-color: rgba(0,123,255,0.2); }
.feature-icon { font-size: 2rem; margin-bottom: 1rem; }
.feature-title { font-size: 1rem; font-weight: 700; color: #1a202c; margin-bottom: 0.5rem; }
.feature-desc { font-size: 0.875rem; color: #6C757D; line-height: 1.6; }

/* SECURITY */
.security { padding: 6rem 4rem; background: linear-gradient(135deg, #f8faff, #f0fdf4); display: flex; align-items: center; gap: 4rem; }
.security-content { flex: 1; }
.security-list { display: flex; flex-direction: column; gap: 0.85rem; margin: 1.75rem 0 2rem; }
.security-item { display: flex; align-items: center; gap: 0.75rem; font-size: 0.9rem; color: #374151; font-weight: 500; }
.security-item svg { width: 18px; height: 18px; color: #28A745; flex-shrink: 0; }
.security-visual { flex-shrink: 0; }
.shield-box { background: #fff; border-radius: 20px; padding: 2.5rem; text-align: center; box-shadow: 0 8px 40px rgba(0,86,255,0.1); border: 1px solid rgba(0,123,255,0.1); width: 300px; }
.shield-icon { font-size: 3.5rem; margin-bottom: 1rem; }
.shield-title { font-size: 1.1rem; font-weight: 700; color: #1a202c; margin-bottom: 0.5rem; }
.shield-sub { font-size: 0.82rem; color: #6C757D; line-height: 1.5; margin-bottom: 1.5rem; }
.shield-badges { display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; }
.badge { background: rgba(0,123,255,0.08); color: #007BFF; font-size: 0.75rem; font-weight: 600; padding: 0.3rem 0.7rem; border-radius: 99px; border: 1px solid rgba(0,123,255,0.15); }

/* ACCOUNTS */
.accounts-section { padding: 6rem 4rem; background: #fff; }
.accounts-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; max-width: 1100px; margin: 0 auto; }
.account-card { border: 1.5px solid #e9ecef; border-radius: 16px; padding: 2rem; transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; display: flex; flex-direction: column; gap: 0.75rem; }
.account-card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,86,255,0.1); border-color: #007BFF; }
.account-icon { font-size: 2.5rem; }
.account-name { font-size: 1.1rem; font-weight: 700; color: #1a202c; }
.account-desc { font-size: 0.875rem; color: #6C757D; line-height: 1.6; }
.account-features { list-style: none; display: flex; flex-direction: column; gap: 0.4rem; margin: 0.5rem 0; }
.account-features li { font-size: 0.82rem; color: #374151; font-weight: 500; }
.btn-account { display: block; text-align: center; background: #f0f7ff; color: #007BFF; text-decoration: none; font-size: 0.88rem; font-weight: 600; padding: 0.65rem; border-radius: 8px; border: 1.5px solid rgba(0,123,255,0.2); transition: background 0.2s; margin-top: auto; }
.btn-account:hover { background: #007BFF; color: #fff; }

/* CTA */
.cta { padding: 6rem 4rem; background: linear-gradient(135deg, #007BFF, #0041a8); text-align: center; position: relative; overflow: hidden; }
.cta-orb { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; }
.cta-orb--1 { width: 400px; height: 400px; background: rgba(255,255,255,0.1); top: -100px; left: -100px; }
.cta-orb--2 { width: 300px; height: 300px; background: rgba(255,255,255,0.08); bottom: -80px; right: -80px; }
.cta-title { font-size: 2.5rem; font-weight: 800; color: #fff; letter-spacing: -0.03em; margin-bottom: 1rem; position: relative; }
.cta-sub { font-size: 1rem; color: rgba(255,255,255,0.8); margin-bottom: 2.5rem; position: relative; }
.cta .btn-primary { background: #fff; color: #007BFF; box-shadow: 0 4px 20px rgba(0,0,0,0.2); position: relative; }
.cta .btn-primary:hover { background: #f0f7ff; }

/* CONTACTO */
.contact-section { padding: 6rem 4rem; background: #f8faff; }
.contact-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; max-width: 1100px; margin: 0 auto; }
.contact-card { background: #fff; border-radius: 16px; padding: 1.75rem; text-align: center; border: 1px solid #e9ecef; transition: transform 0.2s, box-shadow 0.2s; }
.contact-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,86,255,0.08); }
.contact-icon { font-size: 2rem; margin-bottom: 0.75rem; }
.contact-title { font-size: 0.95rem; font-weight: 700; color: #1a202c; margin-bottom: 0.4rem; }
.contact-info { font-size: 0.85rem; color: #007BFF; font-weight: 600; margin-bottom: 0.3rem; }
.contact-hours { font-size: 0.78rem; color: #6C757D; }

/* FOOTER */
.footer { background: #1a202c; padding: 3rem 4rem 1.5rem; }
.footer-top { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 2rem; margin-bottom: 2rem; }
.footer-brand { display: flex; flex-direction: column; gap: 0.75rem; }
.footer-logo { height: 36px; filter: brightness(0) invert(1); opacity: 0.8; width: fit-content; }
.footer-brand p { color: rgba(255,255,255,0.5); font-size: 0.82rem; line-height: 1.6; }
.footer-reg { color: rgba(255,255,255,0.3) !important; font-size: 0.72rem !important; }
.footer-col { display: flex; flex-direction: column; gap: 0.6rem; }
.footer-col h4 { color: #fff; font-size: 0.9rem; font-weight: 700; margin-bottom: 0.5rem; }
.footer-col a { color: rgba(255,255,255,0.5); text-decoration: none; font-size: 0.82rem; transition: color 0.2s; }
.footer-col a:hover { color: #fff; }
.footer-bottom { border-top: 1px solid rgba(255,255,255,0.08); padding-top: 1.5rem; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; }
.footer-bottom span { color: rgba(255,255,255,0.3); font-size: 0.75rem; }

@media (max-width: 1024px) {
  .features-grid, .accounts-grid { grid-template-columns: repeat(2, 1fr); }
  .contact-grid { grid-template-columns: repeat(2, 1fr); }
  .footer-top { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 900px) {
  .navbar { padding: 0.9rem 1.5rem; }
  .nav-link { display: none; }
  .hero { flex-direction: column; padding: 6rem 1.5rem 3rem; text-align: center; }
  .hero-title { font-size: 2.2rem; }
  .hero-actions { justify-content: center; }
  .hero-stats { justify-content: center; }
  .hero-visual { display: none; }
  .features, .security, .accounts-section, .contact-section, .cta { padding: 4rem 1.5rem; }
  .features-grid, .accounts-grid { grid-template-columns: 1fr; }
  .security { flex-direction: column; }
  .shield-box { width: 100%; }
  .contact-grid { grid-template-columns: 1fr 1fr; }
  .footer { padding: 2.5rem 1.5rem 1.5rem; }
  .footer-top { grid-template-columns: 1fr; }
  .cta-title { font-size: 1.8rem; }
  .footer-bottom { flex-direction: column; text-align: center; }
}
</style>