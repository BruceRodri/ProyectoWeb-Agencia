import { LitElement, html, css } from "lit";

class RegisterPage extends LitElement {
  static properties = {
    error: { type: String },
    success: { type: String },
  };

  constructor() {
    super();
    this.error = "";
    this.success = "";
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
      background: linear-gradient(to right, #1a1a2e, #16213e);
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 40px 20px;
    }

    .form-box {
      background: white;
      padding: 40px;
      border-radius: 16px;
      width: 100%;
      max-width: 420px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    h2 {
      text-align: center;
      color: #1a1a2e;
      font-size: 2rem;
      margin-bottom: 8px;
    }

    span {
      color: #e94560;
    }

    .divider {
      width: 60px;
      height: 4px;
      background: #e94560;
      margin: 0 auto 25px auto;
      border-radius: 10px;
    }

    .input-group {
      margin-bottom: 20px;
    }

    label {
      display: block;
      color: #333;
      margin-bottom: 6px;
      font-size: 0.95rem;
    }

    input {
      width: 100%;
      padding: 12px 15px;
      border: 2px solid #ddd;
      border-radius: 8px;
      font-size: 1rem;
      transition: border 0.3s;
      outline: none;
    }

    input:focus {
      border-color: #e94560;
    }

    .error {
      color: #e94560;
      font-size: 0.9rem;
      margin-bottom: 15px;
      text-align: center;
    }

    .success {
      color: #28a745;
      font-size: 0.9rem;
      margin-bottom: 15px;
      text-align: center;
    }

    button {
      width: 100%;
      padding: 14px;
      background: #e94560;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: bold;
      cursor: pointer;
      transition: background 0.3s;
    }

    button:hover {
      background: #c73652;
    }

    .login-link {
      text-align: center;
      margin-top: 20px;
      color: #666;
      font-size: 0.95rem;
    }

    .login-link a {
      color: #e94560;
      text-decoration: none;
      font-weight: bold;
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

    try {
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        this.success = "Cuenta creada correctamente, ya puedes iniciar sesión";
        this.error = "";
      } else {
        this.error = data.error || "Error al crear la cuenta";
        this.success = "";
      }
    } catch (error) {
      this.error = "Error al conectar con el servidor";
      this.success = "";
    }
  }

  render() {
    return html`
      <div class="container">
        <div class="form-box">
          <h2>Crear <span>Cuenta</span></h2>
          <div class="divider"></div>

          ${this.error ? html`<p class="error">${this.error}</p>` : ""}
          ${this.success ? html`<p class="success">${this.success}</p>` : ""}

          <div class="input-group">
            <label>Nombre completo</label>
            <input type="text" id="nombre" placeholder="Tu nombre" />
          </div>

          <div class="input-group">
            <label>Correo electrónico</label>
            <input type="email" id="email" placeholder="tu@correo.com" />
          </div>

          <div class="input-group">
            <label>Contraseña</label>
            <input type="password" id="password" placeholder="••••••••" />
          </div>

          <button @click=${this.handleRegister}>Registrarse</button>

          <div class="login-link">
            <p>¿Ya tienes cuenta? <a href="/login">Inicia sesión</a></p>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("register-page", RegisterPage);
