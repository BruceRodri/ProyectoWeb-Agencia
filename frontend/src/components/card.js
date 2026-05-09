import { LitElement, html, css } from "lit";

class DestinationCard extends LitElement {
  static properties = {
    destino: { type: Object },
    usuario: { type: Object },
  };

  constructor() {
    super();

    this.destino = {};
    this.usuario = null;
  }

  tipoIcon(tipo) {
    const icons = {
      playa: "🏖️",
      ciudad: "🏙️",
      aventura: "🏔️",
    };

    return icons[tipo] || "🌍";
  }

  presupuestoIcon(presupuesto) {
    const icons = {
      bajo: "💰",
      medio: "💳",
      alto: "💎",
    };

    return icons[presupuesto] || "💰";
  }

  async agregarFavorito() {
    if (!this.usuario) {
      alert("Debes iniciar sesión para guardar favoritos");
      window.location.href = "/login";
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario_id: this.usuario.id,
          destino_id: this.destino.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("❤️ Agregado a favoritos");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error al agregar favorito:", error);
    }
  }

  static styles = css`
    :host {
      display: block;
    }

    .card {
      background: white;

      border-radius: 16px;

      overflow: hidden;

      display: flex;
      flex-direction: column;

      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);

      transition: 0.3s;
    }

    .card:hover {
      transform: translateY(-8px);

      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
    }

    .card-header {
      background: linear-gradient(135deg, #1a1a2e, #16213e);

      padding: 25px 20px;

      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-icon {
      font-size: 2.5rem;
    }

    .card-pais {
      background: rgba(255, 255, 255, 0.1);

      color: white;

      padding: 5px 12px;

      border-radius: 20px;

      font-size: 0.8rem;
      font-weight: bold;
    }

    .card-body {
      padding: 20px;

      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .card-body h3 {
      color: #1a1a2e;

      font-size: 1.4rem;

      margin-bottom: 10px;
    }

    .card-body p {
      color: #777;

      line-height: 1.6;

      margin-bottom: 20px;

      flex: 1;
    }

    .badges {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;

      margin-bottom: 20px;
    }

    .badge {
      display: flex;
      align-items: center;
      gap: 5px;

      padding: 5px 12px;

      border-radius: 20px;

      font-size: 0.8rem;
      font-weight: bold;
    }

    .badge-clima {
      background: #e8f4fd;
      color: #0083b0;
    }

    .badge-presupuesto {
      background: #fde8ec;
      color: #e94560;
    }

    .badge-tipo {
      background: #e8f8e8;
      color: #28a745;
    }

    .btn-favorito {
      width: 100%;

      padding: 12px;

      border: none;
      border-radius: 10px;

      background: linear-gradient(135deg, #1a1a2e, #16213e);

      color: white;

      cursor: pointer;

      transition: 0.3s;

      font-weight: bold;
    }

    .btn-favorito:hover {
      background: linear-gradient(135deg, #e94560, #c73652);

      transform: translateY(-2px);
    }
  `;

  render() {
    return html`
      <div class="card">
        <div class="card-header">
          <span class="card-icon"> ${this.tipoIcon(this.destino.tipo)} </span>

          <span class="card-pais"> 📍 ${this.destino.pais} </span>
        </div>

        <div class="card-body">
          <h3>${this.destino.nombre}</h3>

          <p>${this.destino.descripcion}</p>

          <div class="badges">
            <span class="badge badge-clima"> 🌡️ ${this.destino.clima} </span>

            <span class="badge badge-presupuesto">
              ${this.presupuestoIcon(this.destino.presupuesto)}
              ${this.destino.presupuesto}
            </span>

            <span class="badge badge-tipo">
              ${this.tipoIcon(this.destino.tipo)} ${this.destino.tipo}
            </span>
          </div>

          <button class="btn-favorito" @click=${this.agregarFavorito}>
            ❤️ Guardar en favoritos
          </button>
        </div>
      </div>
    `;
  }
}

customElements.define("destination-card", DestinationCard);
