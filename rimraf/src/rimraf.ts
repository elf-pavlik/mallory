import { createVocabulary } from 'rdf-vocabulary'
import dereference from 'rdf-dereference-store';
import type { Session } from '@uvdsl/solid-oidc-client-browser';
import type { DatasetCore } from '@rdfjs/types'

const safetyRegex = /^https:\/\/mallory-says-[^.]+\.solidcommunity\.net\/$/

const space = createVocabulary('http://www.w3.org/ns/pim/space#', 'storage')
const ldp = createVocabulary('http://www.w3.org/ns/ldp#', 'contains')

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function discoverStorage(webId: string): Promise<string | undefined> {
  const { store } = await dereference(webId)
  //@ts-ignore
  return [...store.match(null, space.terms.storage)][0].object.value
}

async function getMembers(dataset: DatasetCore): Promise<string[]> {
  return [...dataset.match(null, ldp.terms.contains)].map(q => q.object.value)
}

async function rm(url: string, session: Session): Promise<void> {
  if (url.match(/\/$/)) {
    const { store } = await dereference(url, { fetch: session.authFetch.bind(session) })
    //@ts-ignore
    const members = await getMembers(store)
    await Promise.all(members.map(m => rm(m, session)))
  }
  console.log(url)
  await session.authFetch(url, { method: 'DELETE' })
}

export async function rimraf(session: Session): Promise<string | undefined> {
  console.log(session.webId)
  if (!session.webId) {
    console.error('Session has no WebID!')
    return
  }

  const root = await discoverStorage(session.webId)
  console.log(root)

  if (!root) {
    console.error('Could not discover storage root')
    return
  }
  if (!root.match(safetyRegex)) throw new Error('Unsafe experiment!')
  await rm(root, session)
  return root
}

