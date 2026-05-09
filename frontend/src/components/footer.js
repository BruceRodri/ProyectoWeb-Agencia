import { LitElement, html, css } from "lit";

class Footer extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    footer {
      background-color: #1a1a2e;
      color: white;
      text-align: center;
      padding: 20px;
      font-size: 0.9rem;
    }

    span {
      color: #e94560;
    }
  `;
  render() {
    return html`
      <footer>
        <p>© 2025 <span>TravelMatch</span> — Todos los derechos reservados</p>
      </footer>
    `;
  }
}

customElements.define("mi-footer", Footer);
