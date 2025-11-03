import { HttpRouter, HttpServer, HttpServerRequest, HttpServerResponse } from '@effect/platform'
import { NodeHttpServer, NodeRuntime } from '@effect/platform-node'
import { Effect, Layer, Schema } from 'effect'
import { createServer } from 'node:http'
import * as dereferenceStore from 'rdf-dereference-store'
import { Console } from 'effect/Console'
import { createVocabulary } from 'rdf-vocabulary'
import { DataFactory } from 'n3'
import fs from 'node:fs'
import { createTree } from './createTree.ts'

const data = new Set(JSON.parse(fs.readFileSync('data.json', 'utf8')) as string[])

// @ts-ignore
const dereference = dereferenceStore.default.default as typeof dereferenceStore.default

const solid = createVocabulary('http://www.w3.org/ns/solid/terms#', 'oidcIssuer')
const malloryOp = 'https://auth.mallory.monster/'

const CuckooPayload = Schema.Struct({
  webId: Schema.String.pipe(
    Schema.filter(
      (url) => {
        try {
          const parsed = new URL(url)
          return parsed.protocol === 'https:'
        } catch {
          return false
        }
      },
      { message: () => 'webId must be a valid URL with https scheme' },
    ),
  ),
})

type CuckooPayloadType = Schema.Schema.Type<typeof CuckooPayload>

// Error handling helper for route handlers
const withErrorHandling = <A, E, R>(effect: Effect.Effect<A, E, R>) =>
  effect.pipe(
    Effect.catchTag('ParseError', (error) =>
      Effect.gen(function* () {
        return yield* HttpServerResponse.json({ error: 'Validation failed', details: error.message }, { status: 400 })
      }),
    ),
    Effect.catchAll((error) =>
      Effect.gen(function* () {
        console.error(error)
        if (error._tag === 'RequestError') {
          return yield* HttpServerResponse.json({ error: 'Invalid request body' }, { status: 400 })
        }

        return yield* HttpServerResponse.json({ error: 'Internal server error' }, { status: 500 })
      }),
    ),
  )

// Define the router with a single route for the root URL
const router = HttpRouter.empty.pipe(
  HttpRouter.post(
    '/leaks',
    withErrorHandling(
      Effect.gen(function* () {
        const req = yield* HttpServerRequest.HttpServerRequest
        const body = yield* req.json
        const { webId } = yield* Schema.decodeUnknown(CuckooPayload)(body)
        const tree = yield* Effect.promise(() => createTree(webId))
        return yield* HttpServerResponse.json({ tree }, { status: 200 })
      }),
    ),
  ),
  HttpRouter.post(
    '/cuckoo',
    withErrorHandling(
      Effect.gen(function* () {
        const req = yield* HttpServerRequest.HttpServerRequest
        const body = yield* req.json
        const { webId } = yield* Schema.decodeUnknown(CuckooPayload)(body)
        const { store } = yield* Effect.promise(() => dereference(webId, { headers: { Accept: 'text/turtle' } }))
        const cuckooStatement = yield* Effect.sync(
          () => [...store.match(DataFactory.namedNode(webId), solid.oidcIssuer, DataFactory.namedNode(malloryOp))][0]
        )
        if (cuckooStatement) {
          if (!data.has(webId)) {
            data.add(webId)
            yield * Effect.promise(() => fs.promises.writeFile('data.json', JSON.stringify(Array.from(data), null, 2), 'utf8'))
          }
          return yield* HttpServerResponse.json({ success: true }, { status: 200 })
        } else {
          return yield* HttpServerResponse.json({ success: false }, { status: 400 })
        }
      }),
    ),
  ),
)

// Set up the application server with logging
const app = router.pipe(HttpServer.serve(), HttpServer.withLogAddress)

// Specify the port
const port = 3000

// Create a server layer with the specified port
const ServerLive = NodeHttpServer.layer(() => createServer(), { port })

// Run the application
NodeRuntime.runMain(Layer.launch(Layer.provide(app, ServerLive)))
