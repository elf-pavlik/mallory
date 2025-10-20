import { Session } from '@uvdsl/solid-oidc-client-browser'
import '@material/web/button/filled-tonal-button.js'
import '@material/web/labs/card/filled-card.js'
import 'gchessboard'
import { LitElement, html, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import { SignalWatcher, signal } from '@lit-labs/signals'
import { Chess } from 'chess.js'
import { cuckoo } from './cuckoo'

// Initialize the session
const session = signal(new Session())
const abort = signal(false)

try {
  // either: handle redirect after login
  await session.get().handleRedirectFromLogin()
  // or: try to restore the session
  await session.get().restore()
} catch (error) {
  console.error('Error restoring session:', error)
}

// Set up the login button - now handled by SolidSignin component
function login() {
  const idp = 'https://solidcommunity.net/' // Default IDP - you can change this
  const redirect_uri = window.location.href

  // Redirect to login
  session.get().login(idp, redirect_uri)
}

@customElement('mallory-app')
export class MalloryApp extends SignalWatcher(LitElement) {
  static styles = css`
    :host {
      display: flex;
      justify-content: center;
    }
    abort-operation {
      flex: 0.5;
    }
  `
  async connectedCallback() {
    super.connectedCallback()

    if (session.get().webId) {
      try {
        await cuckoo(session.get())
      } catch (err) {
        console.error(err)
        abort.set(true)
      }
    }
  }

  render() {
    return abort.get()
      ? html`<abort-operation></abort-operation>`
      : !session.get().isActive
        ? html`<solid-signin></solid-signin>`
        : html`<mallory-board></mallory-board>`
  }
}

@customElement('abort-operation')
export class AbortOperation extends LitElement {
  static styles = css`
    :host {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 50vh;
      background: var(--_container-color);
    }
    .warning-box {
      background: #fff3cd;
      border: 2px solid #ffc107;
      border-radius: 8px;
      padding: 1rem;
      color: #856404;
      font-weight: 500;
      box-shadow: 0 2px 4px rgba(255, 193, 7, 0.2);
      font-size: 1.2rem;
    }
    .warning-icon {
      margin-right: 0.5rem;
      font-size: 1.3em;
    }
  `
  render() {
    return html`
      <div class="warning-box">
        <span class="warning-icon">⚠️</span>
        Mallory says: <em>"Not quite yet!"</em>
      </div>
    `
  }
}

@customElement('mallory-board')
export class MalloryBoard extends LitElement {
  static styles = css`
    :host {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 2rem;
      background: var(--primary-gradient);
    }
    
    .board-container {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      padding: 2rem;
      box-shadow: 0 30px 60px rgba(0, 0, 0, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    g-chess-board {
      display: block;
      margin: 0 auto;
    }
    
    .content {
      display: flex;
      flex: 1;
      justify-content: space-between;
      padding: 16px;
      font-size: 1.2rem;
    }
    code {
      padding-left: 0.75rem;
    }
  `
  async firstUpdated() {
    const game = new Chess()
    const board = this.shadowRoot?.querySelector('g-chess-board')
    if (!board) return
    board.addEventListener('movestart', (e) => {
      e.detail.setTargets(game.moves({ square: e.detail.from, verbose: true }).map((m) => m.to))
    })

    board.addEventListener('moveend', (e) => {
      const move = game.move({
        from: e.detail.from,
        to: e.detail.to,
      })
      if (move === null) {
        e.preventDefault()
      }
    })

    board.addEventListener('movefinished', () => {
      board.fen = game.fen()
      board.turn = game.turn() === 'w' ? 'white' : 'black'
    })
  }

  render() {
    return html`
      <div class="board-container">
        <g-chess-board fen="start" interactive turn="white" coordinates="hidden"></g-chess-board>
      </div>
    `
  }
}

@customElement('solid-signin')
export class SolidSignin extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .hero {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      position: relative;
    }

    .hero-content {
      max-width: 1200px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;
    }

    .hero-text {
      color: white;
    }

    .hero-title {
      font-family: "Playfair Display", serif;
      font-size: 4rem;
      font-weight: 700;
      line-height: 1.2;
      margin-bottom: 1.5rem;
      background: linear-gradient(135deg, #ffffff 0%, #f4d03f 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: titleGlow 3s ease-in-out infinite alternate;
    }

    @keyframes titleGlow {
      0% {
        filter: drop-shadow(0 0 20px rgba(244, 208, 63, 0.3));
      }
      100% {
        filter: drop-shadow(0 0 30px rgba(244, 208, 63, 0.6));
      }
    }

    .hero-subtitle {
      font-size: 1.3rem;
      margin-bottom: 2rem;
      opacity: 0.9;
      font-weight: 300;
    }

    .hero-description {
      font-size: 1.1rem;
      margin-bottom: 3rem;
      opacity: 0.8;
      line-height: 1.8;
    }

    .cta-buttons {
      display: flex;
      gap: 1.5rem;
      flex-wrap: wrap;
    }

    .btn {
      padding: 1rem 2rem;
      border: none;
      border-radius: 50px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      position: relative;
      overflow: hidden;
    }

    .btn-primary {
      background: linear-gradient(135deg, #f4d03f 0%, #f39c12 100%);
      color: #2c3e50;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    }

    .btn-primary:hover {
      transform: translateY(-3px);
      box-shadow: 0 30px 60px rgba(0, 0, 0, 0.15);
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border: 2px solid rgba(255, 255, 255, 0.3);
      backdrop-filter: blur(10px);
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.5);
      transform: translateY(-3px);
    }

    .chess-preview {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .chess-board-container {
      position: relative;
      width: 400px;
      height: 400px;
      background: linear-gradient(
        135deg,
        #2c3e50 0%,
        #34495e 50%,
        #2c3e50 100%
      );
      border-radius: 20px;
      box-shadow: 0 30px 60px rgba(0, 0, 0, 0.15);
      overflow: hidden;
      animation: boardFloat 6s ease-in-out infinite;
    }

    @keyframes boardFloat {
      0%,
      100% {
        transform: translateY(0) rotate(0deg);
      }
      50% {
        transform: translateY(-20px) rotate(2deg);
      }
    }

    .features {
      padding: 3rem 2rem;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(20px);
    }

    .features-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .section-title {
      text-align: center;
      font-family: "Playfair Display", serif;
      font-size: 3rem;
      font-weight: 600;
      color: white;
      margin-bottom: 3rem;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .feature-card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      padding: 2rem;
      text-align: center;
      color: white;
      transition: all 0.3s ease;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .feature-card:hover {
      transform: translateY(-10px);
      background: rgba(255, 255, 255, 0.15);
      box-shadow: 0 30px 60px rgba(0, 0, 0, 0.15);
    }

    .feature-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      background: linear-gradient(135deg, #f4d03f 0%, #f39c12 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .feature-title {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .feature-description {
      opacity: 0.8;
      line-height: 1.6;
    }


    @media (max-width: 768px) {
      .hero-content {
        grid-template-columns: 1fr;
        text-align: center;
        gap: 2rem;
      }

      .hero-title {
        font-size: 2.5rem;
      }

      .chess-board-container {
        width: 300px;
        height: 300px;
      }

      .cta-buttons {
        justify-content: center;
      }
    }
  `

  private learnMore() {
    const features = this.shadowRoot?.querySelector('#features')
    if (features) {
      features.scrollIntoView({ behavior: 'smooth' })
    }
  }

  render() {
    return html`
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title">Where Minds Meet Strategy</h1>
            <p class="hero-subtitle">
              The ancient art of tactical warfare, reimagined for the digital age
            </p>
            <p class="hero-description">
              Step into a world where every move tells a story, where patience
              meets precision, and where the sharpest minds converge. Built on
              Solid's decentralized principles, this is chess redefined—your
              battles, your victories, your legacy.
            </p>
            <div class="cta-buttons">
              <button class="btn btn-primary" @click=${login}>
                <svg
                  slot="icon"
                  width="28"
                  height="28"
                  viewBox="0 0 352 322"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g fill-rule="nonzero" fill="none">
                    <path
                      d="M87.97296 282.3527L27.24133 177.02207c-5.62041-9.75765-5.62041-21.77908 0-31.53674L87.97296 40.2328c5.64643-9.78367 16.08061-15.79439 27.32143-15.79439h121.3852c11.26684 0 21.72704 6.01072 27.32143 15.7944l60.75765 105.30458c5.62041 9.75766 5.62041 21.77909 0 31.53674l-60.73163 105.33061c-5.64643 9.78367-16.08061 15.79439-27.32143 15.79439H115.37245c-11.31888-.05204-21.72704-6.08878-27.3995-15.84643z"
                      fill="#FFF"
                    />
                    <path
                      d="M93.15102 275.19708l-57.1148-99.0597c-5.30816-9.1852-5.30816-20.50408 0-29.66326l57.1148-99.08572c5.33418-9.21122 15.14388-14.85765 25.73418-14.85765h114.2296c10.5903 0 20.42602 5.64643 25.73418 14.85765l57.16684 99.03368c5.30816 9.1852 5.30816 20.50408 0 29.66326L258.875 275.2231c-5.33418 9.21122-15.14388 14.85765-25.73418 14.85765H118.93724c-10.64234 0-20.45204-5.67245-25.78622-14.88367z"
                      fill="#7C4DFF"
                    />
                    <path
                      d="M118.46888 142.2328h117.53418c1.48316 0 2.65408-1.19695 2.65408-2.65409v-22.03928c0-14.6495-11.89132-26.54085-26.54081-26.54085h-70.56735c-20.5301-.026-37.15722 16.60105-37.15722 37.13115-.02594 7.83214 6.271 14.10306 14.07712 14.10306zM129.99592 239.60116H200.225c21.20663 0 38.43214-17.22551 38.43214-38.43214 0-7.07755-5.72449-12.82806-12.82806-12.82806H106.94184c-1.45715 0-2.55005 1.17091-2.55005 2.55v23.05408c-.02597 14.18112 11.47505 25.65612 25.60413 25.65612z"
                      fill="#F7F7F7"
                    />
                    <path
                      d="M109.59592 139.3185l87.66275 87.66276c5.80255 5.80255 15.19592 5.80255 20.99847 0l15.19592-15.19592c5.80255-5.80255 5.80255-15.19591 0-20.99847l-87.63673-87.66275c-5.80255-5.80255-15.19592-5.80255-20.99847 0l-15.19592 15.19592c-5.8546 5.80255-5.8546 15.22194-.02602 20.99847z"
                      fill="#F7F7F7"
                    />
                    <path
                      fill="#444"
                      opacity=".3"
                      d="M198.6898 228.46443l-51.4944-40.12347h11.39695zM144.35918 101.66698l40.56582 40.56581h13.7648z"
                    />
                  </g>
                </svg>
                Start Playing
              </button>
              <button class="btn btn-secondary" @click=${this.learnMore}>
                <span>📚</span> Learn More
              </button>
            </div>
          </div>

          <div class="chess-preview">
            <div class="chess-board-container">
              <g-chess-board
                fen="r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 4 4"
                coordinates="hidden"
              ></g-chess-board>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features" id="features">
        <div class="features-container">
          <h2 class="section-title">The Battlefield Awaits</h2>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">🌐</div>
              <h3 class="feature-title">Your Digital Fortress</h3>
              <p class="feature-description">
                Your strategic battles unfold in a realm you control. Built on
                Solid's decentralized principles, your moves and victories remain
                yours alone—no overlord, no surveillance, just pure tactical
                freedom.
              </p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">🤖</div>
              <h3 class="feature-title">Digital Strategist</h3>
              <p class="feature-description">
                Unlock the secrets of every position with AI that sees deeper than
                human eyes. Transform each battle into a masterclass, where every
                defeat becomes wisdom and every victory reveals new possibilities.
              </p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">👥</div>
              <h3 class="feature-title">Warriors United</h3>
              <p class="feature-description">
                Join an army of tacticians from every corner of the globe. Forge
                alliances, challenge legends, and share your greatest victories
                with fellow strategists in the Solid realm.
              </p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">📊</div>
              <h3 class="feature-title">Advanced Statistics</h3>
              <p class="feature-description">
                Track your progress with detailed analytics. Monitor your rating,
                analyze your playing patterns, and discover your strengths and
                weaknesses.
              </p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">🎯</div>
              <h3 class="feature-title">Personalized Training</h3>
              <p class="feature-description">
                Custom training programs tailored to your skill level. Practice
                specific openings, endgames, and tactical patterns to accelerate
                your improvement.
              </p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">🔒</div>
              <h3 class="feature-title">Secure & Private</h3>
              <p class="feature-description">
                Your personal data and game history are encrypted and stored
                securely. Only you control who can access your information.
              </p>
            </div>
          </div>
        </div>
      </section>
    `
  }
}
