import { HttpRouter, HttpServer, HttpServerRequest, HttpServerResponse } from '@effect/platform'
import { NodeHttpServer, NodeRuntime } from '@effect/platform-node'
import { Effect, Layer, Schema } from 'effect'
import { createServer } from 'node:http'
import dereference from 'rdf-dereference-store'
import { Console } from 'effect/Console'
import { createVocabulary } from 'rdf-vocabulary'
import { DataFactory } from 'n3'

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

// Define the router with a single route for the root URL
const router = HttpRouter.empty.pipe(
  HttpRouter.post(
    '/cuckoo',
    Effect.gen(function* () {
      const req = yield* HttpServerRequest.HttpServerRequest
      const body = yield* req.json
      const { webId } = yield* Schema.decodeUnknown(CuckooPayload)(body)
      const { store } = yield* Effect.promise(() => dereference(webId, { headers: { Accept: 'text/turtle' } }))
      //   const cuckooStatement = yield* Effect.promise(
      //     () => store.match(DataFactory.namedNode(webId), solid.oidcIssuer, DataFactory.namedNode(malloryOp))[0],
      //   )
      //   console.log(cuckooStatement)

      return yield* HttpServerResponse.json({})
    }).pipe(
      Effect.catchTag('ParseError', (error) =>
        Effect.gen(function* () {
          return yield* HttpServerResponse.json({ error: 'Validation failed', details: error.message }, { status: 400 })
        }),
      ),
      Effect.catchAll((error) =>
        Effect.gen(function* () {
          //   console.error(error)
          if (error._tag === 'RequestError') {
            return yield* HttpServerResponse.json({ error: 'Invalid request body' }, { status: 400 })
          }

          return yield* HttpServerResponse.json({ error: 'Internal server error' }, { status: 500 })
        }),
      ),
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
