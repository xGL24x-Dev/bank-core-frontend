<template>
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
</template>

<script setup>
</script>

<style scoped>
.footer {
    background: #1a202c;
    padding: 3rem 4rem 1.5rem;
}

.footer-top {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
}

.footer-brand {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.footer-logo {
    height: 48px;
    width: auto;
    max-width: 180px;
    object-fit: contain;
}

.footer-brand p {
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.82rem;
    line-height: 1.6;
    font-family: 'Inter', sans-serif;
}

.footer-reg {
    color: rgba(255, 255, 255, 0.3) !important;
    font-size: 0.72rem !important;
}

.footer-col {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
}

.footer-col h4 {
    color: #fff;
    font-size: 0.9rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    font-family: 'Inter', sans-serif;
}

.footer-col a {
    color: rgba(255, 255, 255, 0.5);
    text-decoration: none;
    font-size: 0.82rem;
    font-family: 'Inter', sans-serif;
    transition: color 0.2s;
}

.footer-col a:hover {
    color: #fff;
}

.footer-bottom {
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    padding-top: 1.5rem;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.footer-bottom span {
    color: rgba(255, 255, 255, 0.3);
    font-size: 0.75rem;
    font-family: 'Inter', sans-serif;
}

@media (max-width: 900px) {
    .footer {
        padding: 2.5rem 1.5rem 1.5rem;
    }

    .footer-top {
        grid-template-columns: 1fr;
    }

    .footer-bottom {
        flex-direction: column;
        text-align: center;
    }
}
</style>