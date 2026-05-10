import { LitElement, html, css } from "lit";

class Header extends LitElement {
  static properties = {
    menuAbierto: { type: Boolean },
    dropdownAbierto: { type: Boolean },
    usuario: { type: Object },
  };

  constructor() {
    super();

    this.menuAbierto = false;
    this.dropdownAbierto = false;
    this.usuario = JSON.parse(localStorage.getItem("usuario")) || null;
  }

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  toggleDropdown() {
    this.dropdownAbierto = !this.dropdownAbierto;
  }

  cerrarDropdown() {
    this.dropdownAbierto = false;
  }

  cerrarSesion() {
    localStorage.removeItem("usuario");
    window.location.href = "/";
  }

  static styles = css`
    :host {
      display: block;
    }

    header {
      background: linear-gradient(135deg, #1a1a2e, #16213e);
      padding: 0 40px;
      height: 70px;

      display: flex;
      justify-content: space-between;
      align-items: center;

      position: sticky;
      top: 0;
      z-index: 998;

      box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
    }

    .logo {
      color: white;
      font-size: 1.8rem;
      font-weight: bold;
      text-decoration: none;
    }

    .logo span {
      color: #e94560;
    }

    nav {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    nav a {
      color: #ccc;
      text-decoration: none;
      padding: 8px 14px;
      border-radius: 8px;
      transition: 0.3s;
      font-size: 0.95rem;
    }

    nav a:hover {
      color: white;
      background: rgba(255, 255, 255, 0.08);
    }

    .btn-login {
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: white;
    }

    .btn-login:hover {
      border-color: white;
    }

    .btn-register {
      background: #e94560;
      color: white;
      box-shadow: 0 4px 15px rgba(233, 69, 96, 0.3);
    }

    .btn-register:hover {
      background: #c73652;
    }

    .usuario-info {
      display: flex;
      align-items: center;
      gap: 8px;
      color: white;
    }

    .avatar {
      width: 34px;
      height: 34px;

      background: #e94560;
      border-radius: 50%;

      display: flex;
      align-items: center;
      justify-content: center;

      color: white;
      font-weight: bold;
      font-size: 0.9rem;
    }

    .dropdown {
      position: relative;
    }

    .dropdown-toggle {
      background: none;
      border: none;

      color: #ccc;
      padding: 8px 14px;

      border-radius: 8px;

      cursor: pointer;

      transition: 0.3s;

      font-size: 0.95rem;
    }

    .dropdown-toggle:hover {
      color: white;
      background: rgba(255, 255, 255, 0.08);
    }

    .dropdown-menu {
      position: absolute;

      top: 110%;
      right: 0;

      min-width: 180px;

      background: #16213e;

      border-radius: 12px;

      padding: 10px;

      display: none;
      flex-direction: column;
      gap: 5px;

      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);

      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .dropdown-menu.abierto {
      display: flex;
    }

    .dropdown-menu a,
    .logout-btn {
      color: #ccc;

      text-decoration: none;

      padding: 10px 14px;

      border-radius: 8px;

      transition: 0.3s;

      display: flex;
      align-items: center;
      gap: 10px;

      font-size: 0.95rem;

      background: none;
      border: none;

      cursor: pointer;

      width: 100%;
    }

    .dropdown-menu a:hover,
    .logout-btn:hover {
      color: white;
      background: rgba(255, 255, 255, 0.08);
    }

    .divider-nav,
    .mobile-divider {
      height: 1px;
      background: rgba(255, 255, 255, 0.08);
      margin: 5px 0;
    }

    .hamburger {
      display: none;

      flex-direction: column;
      gap: 5px;

      background: none;
      border: none;

      cursor: pointer;
    }

    .hamburger span {
      width: 25px;
      height: 3px;

      background: white;

      border-radius: 5px;
    }

    .mobile-menu {
      display: none;

      flex-direction: column;

      background: #16213e;

      padding: 20px;

      gap: 10px;
    }

    .mobile-menu.abierto {
      display: flex;
    }

    .mobile-menu a,
    .mobile-menu button {
      color: #ccc;

      text-decoration: none;

      padding: 12px;

      border-radius: 8px;

      transition: 0.3s;

      background: none;
      border: none;

      font-size: 1rem;

      text-align: left;

      cursor: pointer;
    }

    .mobile-menu a:hover,
    .mobile-menu button:hover {
      color: white;
      background: rgba(255, 255, 255, 0.08);
    }

    @media (max-width: 768px) {
      header {
        padding: 0 20px;
      }

      nav {
        display: none;
      }

      .hamburger {
        display: flex;
      }
    }
  `;

  render() {
    return html`
      <header>
        <a class="logo" href="/"> Travel<span>Match</span> </a>

        <nav>
          <a href="/">Inicio</a>

          <a href="/destinations">Destinos</a>

          ${this.usuario
            ? html`
                <div class="usuario-info">
                  <div class="avatar">
                    ${this.usuario.nombre.charAt(0).toUpperCase()}
                  </div>
                </div>

                <div class="dropdown" @mouseleave=${this.cerrarDropdown}>
                  <button class="dropdown-toggle" @click=${this.toggleDropdown}>
                    ${this.usuario.nombre} ▾
                  </button>

                  <div
                    class="dropdown-menu ${this.dropdownAbierto
                      ? "abierto"
                      : ""}"
                  >
                    <a href="/dashboard" @click=${this.cerrarDropdown}>
                      Mi Cuenta
                    </a>
                    <a href="/test">¿Qué viajero eres?</a>
                    <div class="divider-nav"></div>
                    <button class="logout-btn" @click=${this.cerrarSesion}>
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              `
            : html`
                <a class="btn-login" href="/login"> Iniciar sesión </a>

                <a class="btn-register" href="/register"> Registrarse </a>
              `}
        </nav>

        <button class="hamburger" @click=${this.toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </header>

      <div class="mobile-menu ${this.menuAbierto ? "abierto" : ""}">
        <a href="/">🏠 Inicio</a>

        <a href="/destinations"> 🌍 Destinos </a>

        <div class="mobile-divider"></div>

        ${this.usuario
          ? html`
              <a href="/dashboard"> ❤️ Mis favoritos </a>

              <button @click=${this.cerrarSesion}>🚪 Cerrar sesión</button>
            `
          : html`
              <a href="/login"> Iniciar sesión </a>

              <a href="/register"> Registrarse </a>
            `}
      </div>
    `;
  }
}

customElements.define("mi-header", Header);
