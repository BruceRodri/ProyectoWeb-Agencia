import { LitElement, html, css } from "lit";

class HomePage extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    .hero {
      min-height: 100vh;
      background: linear-gradient(to right, #1a1a2e, #16213e);
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 40px 20px;
    }

    .content {
      color: white;
      max-width: 800px;
    }

    h1 {
      font-size: 3.5rem;
      margin-bottom: 15px;
    }

    span {
      color: #e94560;
    }

    .divider {
      width: 80px;
      height: 4px;
      background: #e94560;
      margin: 0 auto 25px auto;
      border-radius: 10px;
    }

    p {
      font-size: 1.2rem;
      margin-bottom: 30px;
      line-height: 1.8;
      color: #ccc;
    }

    a {
      text-decoration: none;
      background: #e94560;
      color: white;
      padding: 14px 35px;
      border-radius: 30px;
      font-weight: bold;
      font-size: 1rem;
      transition: 0.3s;
      display: inline-block;
    }

    a:hover {
      background: #c73652;
    }

    @media (max-width: 768px) {
      h1 {
        font-size: 2.5rem;
      }

      p {
        font-size: 1rem;
      }
    }
  `;

  render() {
    return html`
      <section class="hero">
        <div class="content">
          <h1>Descubre tu próximo <span>destino</span></h1>
          <div class="divider"></div>
          <p>
            TravelMatch te recomienda los mejores destinos según tus gustos,
            presupuesto y tipo de viaje que buscas.
          </p>
          <a href="/destinations">Explorar destinos</a>
        </div>
      </section>
    `;
  }
}
customElements.define("mi-home", HomePage);
