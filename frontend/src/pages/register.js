import { LitElement, html, css } from "lit";

class RegisterPage extends LitElement {
  static properties = {
    error: { type: String },
    success: { type: String },
    cargando: { type: Boolean },
  };

  constructor() {
    super();

    this.error = "";
    this.success = "";
    this.cargando = false;
  }

  static styles = css`
    :host {
      display: block;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    .container {
      min-height: 100vh;

      background: linear-gradient(
        135deg,
        #1a1a2e 0%,
        #16213e 50%,
        #0f3460 100%
      );

      display: flex;
      justify-content: center;
      align-items: center;

      padding: 40px 20px;

      position: relative;
      overflow: hidden;
    }

    .container::before {
      content: "";

      position: absolute;

      width: 500px;
      height: 500px;

      background: radial-gradient(circle, rgba(233, 69, 96, 0.1), transparent);

      top: -100px;
      right: -100px;

      border-radius: 50%;
    }

    .container::after {
      content: "";

      position: absolute;

      width: 400px;
      height: 400px;

      background: radial-gradient(circle, rgba(15, 52, 96, 0.5), transparent);

      bottom: -100px;
      left: -100px;

      border-radius: 50%;
    }

    .form-box {
      width: 100%;
      max-width: 440px;

      background: white;

      border-radius: 24px;

      padding: 50px 40px;

      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.3);

      position: relative;
      z-index: 1;
    }

    .header {
      text-align: center;
      margin-bottom: 35px;
    }

    .logo {
      font-size: 1.8rem;
      font-weight: 800;

      color: #1a1a2e;

      margin-bottom: 8px;
    }

    .logo span {
      color: #e94560;
    }

    h2 {
      font-size: 1.6rem;
      font-weight: 700;

      color: #1a1a2e;

      margin-bottom: 8px;
    }

    .subtitle {
      color: #888;
      font-size: 0.95rem;
    }

    .divider {
      width: 60px;
      height: 4px;

      background: #e94560;

      margin: 12px auto;

      border-radius: 10px;
    }

    .input-group {
      margin-bottom: 20px;
    }

    label {
      display: block;

      color: #333;

      margin-bottom: 8px;

      font-size: 0.9rem;
      font-weight: 600;
    }

    .input-wrapper {
      position: relative;
    }

    .input-icon {
      position: absolute;

      left: 14px;
      top: 50%;

      transform: translateY(-50%);

      font-size: 1rem;
    }

    input {
      width: 100%;

      padding: 13px 15px 13px 42px;

      border: 2px solid #eee;

      border-radius: 12px;

      background: #fafafa;

      font-size: 0.95rem;

      outline: none;

      transition: 0.3s;
    }

    input:focus {
      border-color: #e94560;

      background: white;

      box-shadow: 0 0 0 4px rgba(233, 69, 96, 0.08);
    }

    .error {
      background: #fde8ec;
      color: #e94560;

      padding: 12px 16px;

      border-radius: 10px;

      font-size: 0.9rem;

      margin-bottom: 20px;
    }

    .success {
      background: #e8f8e8;
      color: #28a745;

      padding: 12px 16px;

      border-radius: 10px;

      font-size: 0.9rem;

      margin-bottom: 20px;
    }

    button {
      width: 100%;

      padding: 15px;

      border: none;

      border-radius: 12px;

      background: linear-gradient(135deg, #e94560, #c73652);

      color: white;

      font-size: 1rem;
      font-weight: bold;

      cursor: pointer;

      transition: 0.3s;

      box-shadow: 0 5px 20px rgba(233, 69, 96, 0.3);

      margin-top: 5px;
    }

    button:hover {
      transform: translateY(-2px);

      box-shadow: 0 8px 25px rgba(233, 69, 96, 0.4);
    }

    button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
    }

    .login-link {
      margin-top: 25px;

      text-align: center;

      color: #888;

      font-size: 0.9rem;
    }

    .login-link a {
      color: #e94560;

      text-decoration: none;

      font-weight: bold;
    }

    .login-link a:hover {
      text-decoration: underline;
    }

    @media (max-width: 480px) {
      .form-box {
        padding: 35px 25px;
      }
    }
  `;

  async handleRegister() {
    const nombre = this.shadowRoot.getElementById("nombre").value;
    const email = this.shadowRoot.getElementById("email").value;
    const password = this.shadowRoot.getElementById("password").value;

    if (!nombre || !email || !password) {
      this.error = "Por favor completa todos los campos";
      this.success = "";
      return;
    }

    this.cargando = true;
    this.error = "";
    this.success = "";

    try {
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        this.success =
          "✅ Cuenta creada correctamente, ya puedes iniciar sesión";

        this.error = "";
      } else {
        this.error = data.error || "Error al crear la cuenta";
        this.success = "";
      }
    } catch (error) {
      this.error = "Error al conectar con el servidor";
      this.success = "";
    } finally {
      this.cargando = false;
    }
  }

  render() {
    return html`
      <div class="container">
        <div class="form-box">
          <div class="header">
            <div class="logo">Travel<span>Match</span></div>

            <div class="divider"></div>

            <h2>Crea tu cuenta</h2>

            <p class="subtitle">Empieza a guardar tus destinos favoritos</p>
          </div>

          ${this.error ? html` <div class="error">⚠️ ${this.error}</div> ` : ""}
          ${this.success
            ? html` <div class="success">${this.success}</div> `
            : ""}

          <div class="input-group">
            <label>Nombre completo</label>

            <div class="input-wrapper">
              <span class="input-icon">👤</span>

              <input type="text" id="nombre" placeholder="Tu nombre" />
            </div>
          </div>

          <div class="input-group">
            <label>Correo electrónico</label>

            <div class="input-wrapper">
              <span class="input-icon">📧</span>

              <input type="email" id="email" placeholder="tu@correo.com" />
            </div>
          </div>

          <div class="input-group">
            <label>Contraseña</label>

            <div class="input-wrapper">
              <span class="input-icon">🔒</span>

              <input type="password" id="password" placeholder="••••••••" />
            </div>
          </div>

          <button @click=${this.handleRegister} ?disabled=${this.cargando}>
            ${this.cargando ? "Creando cuenta..." : "Crear cuenta →"}
          </button>

          <div class="login-link">
            <p>
              ¿Ya tienes cuenta?
              <a href="/login">Inicia sesión</a>
            </p>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("register-page", RegisterPage);
