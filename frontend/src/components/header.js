import { LitElement, html, css } from "lit";

class Header extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    header {
      background-color: #1a1a2e;
      padding: 15px 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .logo {
      color: #e94560;
      font-size: 1.8rem;
      font-weight: bold;
      text-decoration: none;
    }
    nav a {
      color: white;
      text-decoration: none;
      margin-left: 25px;
      font-size: 1rem;
      transition: color 0.3s;
    }

    nav a:hover {
      color: #e94560;
    }
  `;

  render() {
    return html`
      <header>
        <a class="logo" href="/">TravelMatch</a>
        <nav>
          <a href="/">Inicio</a>
          <a href="/destinations">Destinos</a>
          <a href="/login">Login</a>
          <a href="/register">Registro</a>
          <a href="/dashboard">Mi cuenta</a>
        </nav>
      </header>
    `;
  }
}

customElements.define("mi-header", Header);
