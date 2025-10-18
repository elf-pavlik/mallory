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

// Set up the login button
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
        const result = await cuckoo(session.get())
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
      background: var(--_container-color);
    }
    .content {
      display: flex;
      flex-direction: column;
      flex: 1;
      justify-content: space-between;
      padding: 1rem;
      gap: 1rem;
      font-size: 1.2rem;
    }
  `
  render() {
    return html`
      <md-filled-card>
        <div class="content">Mallory says: <em>"Not quite yet!"</em></div>
      </md-filled-card>
    `
  }
}

@customElement('mallory-board')
export class MalloryBoard extends LitElement {
  static styles = css`
    :host {
      background: var(--_container-color);
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
    board.addEventListener("movestart", (e) => {
      e.detail.setTargets(
        game.moves({ square: e.detail.from, verbose: true }).map((m) => m.to)
      )
    })

    board.addEventListener("moveend", (e) => {
      const move = game.move({
        from: e.detail.from,
        to: e.detail.to
      })
      if (move === null) {
        e.preventDefault()
      }
    })

    board.addEventListener("movefinished", (e) => {
      board.fen = game.fen();
      board.turn = game.turn() === "w" ? "white" : "black";
    });
  }

  render() {
    return html`
      <g-chess-board fen="start" interactive turn="white"></g-chess-board>
    `
  }
}

@customElement('solid-signin')
export class SolidSignin extends LitElement {
  render() {
    return html`
      <md-filled-tonal-button @click=${login}>
        Sign in
        <svg slot="icon" width="120" height="48" viewBox="0 0 352 322" xmlns="http://www.w3.org/2000/svg">
          <g fill-rule="nonzero" fill="none">
            <path d="M87.97296 282.3527L27.24133 177.02207c-5.62041-9.75765-5.62041-21.77908 0-31.53674L87.97296 40.2328c5.64643-9.78367 16.08061-15.79439 27.32143-15.79439h121.3852c11.26684 0 21.72704 6.01072 27.32143 15.7944l60.75765 105.30458c5.62041 9.75766 5.62041 21.77909 0 31.53674l-60.73163 105.33061c-5.64643 9.78367-16.08061 15.79439-27.32143 15.79439H115.37245c-11.31888-.05204-21.72704-6.08878-27.3995-15.84643z" fill="#FFF"/>
            <path d="M93.15102 275.19708l-57.1148-99.0597c-5.30816-9.1852-5.30816-20.50408 0-29.66326l57.1148-99.08572c5.33418-9.21122 15.14388-14.85765 25.73418-14.85765h114.2296c10.5903 0 20.42602 5.64643 25.73418 14.85765l57.16684 99.03368c5.30816 9.1852 5.30816 20.50408 0 29.66326L258.875 275.2231c-5.33418 9.21122-15.14388 14.85765-25.73418 14.85765H118.93724c-10.64234 0-20.45204-5.67245-25.78622-14.88367z" fill="#7C4DFF"/>
            <path d="M118.46888 142.2328h117.53418c1.48316 0 2.65408-1.19695 2.65408-2.65409v-22.03928c0-14.6495-11.89132-26.54085-26.54081-26.54085h-70.56735c-20.5301-.026-37.15722 16.60105-37.15722 37.13115-.02594 7.83214 6.271 14.10306 14.07712 14.10306zM129.99592 239.60116H200.225c21.20663 0 38.43214-17.22551 38.43214-38.43214 0-7.07755-5.72449-12.82806-12.82806-12.82806H106.94184c-1.45715 0-2.55005 1.17091-2.55005 2.55v23.05408c-.02597 14.18112 11.47505 25.65612 25.60413 25.65612z" fill="#F7F7F7"/>
            <path d="M109.59592 139.3185l87.66275 87.66276c5.80255 5.80255 15.19592 5.80255 20.99847 0l15.19592-15.19592c5.80255-5.80255 5.80255-15.19591 0-20.99847l-87.63673-87.66275c-5.80255-5.80255-15.19592-5.80255-20.99847 0l-15.19592 15.19592c-5.8546 5.80255-5.8546 15.22194-.02602 20.99847z" fill="#F7F7F7"/>
            <path fill="#444" opacity=".3" d="M198.6898 228.46443l-51.4944-40.12347h11.39695zM144.35918 101.66698l40.56582 40.56581h13.7648z"/>
          </g>
        </svg>
      </md-filled-tonal-button>
    `
  }
}
