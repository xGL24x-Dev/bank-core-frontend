<template>
  <div class="home">

    <NavBar />

    <HeroBanner badge="🇨🇴 Banca Digital Colombiana"
      title="Gestiona tus finanzas<br/><span class='gradient-text'>con total confianza</span>"
      subtitle="NexoFin es el sistema bancario digital diseñado para colombianos. Consulta saldos, realiza transferencias, solicita préstamos y controla tus movimientos desde cualquier lugar del país."
      primaryText="Abrir mi cuenta" primaryLink="/register" secondaryText="Ingresar a mi cuenta" secondaryLink="/login"
      :stats="heroStats" :transactions="heroTransactions" />

    <FeatureGrid badge="🏦 Nuestros Servicios" title="Todo lo que necesitas en un solo lugar"
      subtitle="Productos financieros pensados para los colombianos" :features="features" />

    <SecuritySection badge="🔒 Seguridad Bancaria" title="Tu dinero protegido bajo la normativa colombiana"
      subtitle="Cumplimos con la Superintendencia Financiera de Colombia y aplicamos los más altos estándares de seguridad para proteger cada operación."
      :items="securityItems" :badges="securityBadges" />

    <AccountTypes badge="💼 Tipos de Cuenta" title="Elige la cuenta que se adapta a ti"
      subtitle="Productos diseñados para cada etapa de tu vida financiera" :accounts="accountTypes" />

    <CtaBanner title="¿Listo para gestionar tus finanzas en Colombia?"
      subtitle="Únete a miles de colombianos que ya confían en NexoFin" buttonText="Abrir mi cuenta ahora — es gratis"
      link="/register" />

    <ContactSection badge="📞 Atención al Cliente" title="¿Necesitas ayuda?"
      subtitle="Estamos disponibles para atenderte en todo Colombia" :contacts="contacts" />

    <!-- ACCESO ADMIN -->
    <section class="admin-section">
      <div class="admin-container">
        <div class="admin-icon">👑</div>
        <h3 class="admin-title">¿Eres administrador?</h3>
        <p class="admin-sub">Accede al panel de control de NexoFin para gestionar usuarios, cuentas y transacciones.</p>
        <div class="admin-btns">
          <router-link to="/admin/login" class="btn-admin-login">Ingresar como Admin</router-link>
          <router-link to="/admin/register" class="btn-admin-register">Registrar nuevo Admin</router-link>
        </div>
      </div>
    </section>

    <AppFooter />

  </div>
</template>

<script setup>
import NavBar from '@/components/layout/NavBar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import HeroBanner from '@/components/home/HeroBanner.vue'
import FeatureGrid from '@/components/home/FeatureGrid.vue'
import SecuritySection from '@/components/home/SecuritySection.vue'
import AccountTypes from '@/components/home/AccountTypes.vue'
import CtaBanner from '@/components/home/CtaBanner.vue'
import ContactSection from '@/components/home/ContactSection.vue'

const heroStats = [
  { number: '+5.000', label: 'Usuarios activos' },
  { number: '$500M+', label: 'En transacciones COP' },
  { number: '99.9%', label: 'Disponibilidad' },
]

const heroTransactions = [
  { id: 1, icon: '🛒', name: 'Éxito Chapinero', date: 'Hoy 10:30', amount: '-$45.000', type: 'debit' },
  { id: 2, icon: '💼', name: 'Nómina empresa', date: 'Ayer 09:00', amount: '+$2.500.000', type: 'credit' },
  { id: 3, icon: '⚡', name: 'EPM Servicios', date: '28 Mar', amount: '-$80.000', type: 'debit' },
]

const features = [
  { icon: '💳', title: 'Cuenta de Ahorros', desc: 'Abre tu cuenta sin cuota de manejo y con rendimientos en pesos colombianos.' },
  { icon: '⚡', title: 'Transferencias PSE', desc: 'Envía y recibe dinero a cualquier banco colombiano de forma inmediata.' },
  { icon: '📊', title: 'Control de Gastos', desc: 'Visualiza tus movimientos en pesos y toma mejores decisiones financieras.' },
  { icon: '🏦', title: 'Créditos de Libre Inversión', desc: 'Solicita tu crédito con tasas en DTF y aprobación en minutos.' },
  { icon: '🔔', title: 'Alertas por SMS y Correo', desc: 'Recibe notificaciones de cada transacción al instante en tu celular.' },
  { icon: '📱', title: 'Banca Móvil 24/7', desc: 'Accede a tus productos financieros desde cualquier lugar de Colombia.' },
]

const securityItems = [
  'Vigilado por la Superintendencia Financiera de Colombia',
  'Cifrado SSL de 256 bits en todas las conexiones',
  'Autenticación de dos factores (2FA)',
  'Sistema de prevención de fraudes en tiempo real',
  'Cumplimiento con la Ley 1581 de Habeas Data',
  'Certificación PCI DSS para pagos con tarjeta',
]

const securityBadges = ['SSL 256-bit', '2FA', 'JWT Auth', 'Cifrado', 'SFC']

const accountTypes = [
  { icon: '💰', name: 'Cuenta de Ahorros', desc: 'Ideal para guardar y hacer crecer tu dinero sin complicaciones.', features: ['Sin cuota de manejo', 'Rendimientos anuales', 'Tarjeta débito gratis', 'Retiros en cajeros'] },
  { icon: '🏢', name: 'Cuenta Corriente', desc: 'Perfecta para empresas y personas con alto movimiento.', features: ['Chequera disponible', 'Sobregiro autorizado', 'Extracto mensual', 'Múltiples firmas'] },
  { icon: '🎓', name: 'Cuenta Universitaria', desc: 'Diseñada para estudiantes universitarios colombianos.', features: ['Cero cuota de manejo', 'Descuentos en aliados', 'App móvil gratuita', 'Sin saldo mínimo'] },
]

const contacts = [
  { icon: '📞', title: 'Línea Gratuita Nacional', info: '01 8000 123 456', hours: 'Lunes a viernes 8am - 6pm' },
  { icon: '💬', title: 'Chat en Línea', info: 'nexofin.com.co/chat', hours: 'Disponible 24/7' },
  { icon: '📧', title: 'Correo Electrónico', info: 'contacto@nexofin.com.co', hours: 'Respuesta en menos de 24 horas' },
  { icon: '📍', title: 'Oficina Principal', info: 'Calle 5 # 62-00 Barrio Pampalinda ~ Santiago de Cali, Valle del Cauca.', hours: 'Lunes a viernes 8am - 5pm' },
]
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.home {
  font-family: 'Inter', sans-serif;
  color: #212529;
  background: #fff;
  overflow-x: hidden;
}

/* ADMIN SECTION */
.admin-section {
  background: #f8faff;
  border-top: 1px solid #e9ecef;
  padding: 3rem 2rem;
  text-align: center;
}

.admin-container {
  max-width: 480px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.admin-icon {
  font-size: 2.5rem;
}

.admin-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: #1a202c;
  font-family: 'Inter', sans-serif;
  letter-spacing: -0.02em;
}

.admin-sub {
  font-size: 0.875rem;
  color: #6C757D;
  font-family: 'Inter', sans-serif;
  line-height: 1.6;
  max-width: 380px;
}

.admin-btns {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.btn-admin-login {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: #1a202c;
  color: #fff;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 700;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-family: 'Inter', sans-serif;
  transition: transform 0.15s, box-shadow 0.15s;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
}

.btn-admin-login:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
}

.btn-admin-register {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: transparent;
  color: #1a202c;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-family: 'Inter', sans-serif;
  border: 1.5px solid #1a202c;
  transition: background 0.15s, color 0.15s;
}

.btn-admin-register:hover {
  background: #1a202c;
  color: #fff;
}
</style>