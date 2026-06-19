# Milestone: AI Photo-Scoring Pipeline

## 📊 Current Status
- [x] **Frontend Architecture**: Established feature-driven structure under `src/features/photo-scoring/`.
- [x] **UI Primitives**: Native, high-performance Shadcn-style `Button` primitive deployed.
- [x] **Client-Side Optimization**: HTML5 canvas engine compressing mobile images locally to reduce R2/Token overhead.
- [x] **State Machine**: Resilient UI engine routing states (`IDLE` ➔ `CAMERA_ACTIVE` ➔ `UPLOADING` ➔ `PROCESSING` ➔ `COMPLETED`).
- [ ] **BFF Integration**: Currently stubbed/blocked at the NestJS Presigned URL handshake (`/api/v1/photos/presigned-url`).

---

## 🗺️ Execution Roadmap (Next Steps)

### Epic 1: Next.js Mock Local Environment (Optional / Rapid UI Validation)
*Objective: Unblock front-end aesthetic iteration without waiting for full cloud infra.*
- [x] Create a local mock toggle inside `usePhotoScoring.ts` or a Next.js Route Handler (`src/app/api/v1/photos/mock/route.ts`).
- [x] Simulate a 3-second network processing lag to test the retention animations.
- [x] Inject dummy JSON payloads matching the clinical scale (Grades 1-4) to test UI color-state thresholds.

### Epic 2: NestJS BFF Secure Storage Gateway
*Objective: Implement the secure handshake protocol allowing clients to fetch authorization credentials.*
- [ ] **Controller Layer**: Define `POST /api/v1/photos/presigned-url` endpoint validating payload constraints (`userId`, `fileType`).
- [ ] **Service Layer (Cloudflare R2 Integration)**:
  - Install `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner` inside NestJS.
  - Implement S3 client connection mapping to your Cloudflare R2 bucket endpoint.
  - Write `getSignedUrl` wrapper with a 60-second expiration limit using deterministic, UUID-based `fileKey` paths (e.g., `uploads/{userId}/{uuid}.jpg`).
- [ ] **CORS Configuration**: Configure Cloudflare R2 bucket policies to explicitly accept `PUT` verbs from `http://localhost:3000`.

### Epic 3: Messaging Foundations (NestJS ➔ RabbitMQ)
*Objective: Offload heavy data orchestration smoothly out-of-band.*
- [ ] Create `POST /api/v1/photos/process` inside NestJS BFF.
- [ ] Initialize RabbitMQ client module using `@nestjs/microservices` (amqp protocol setup).
- [ ] Define the `skin.analysis.v1` message payload topology:
  ```json
  {
    "userId": "string",
    "fileKey": "string",
    "timestamp": "ISO-8601"
  }
  ```
- [ ] Push message safely into the processing queue and return a immediate `202 Accepted` back to the Next.js client.

### Epic 4: Real-time Communication Layer (WebSocket Gateway)
*Objective: Establish the push infrastructure to update clients reactively.*
- [ ] Create a NestJS WebSocket Gateway (`@nestjs/websockets`) utilizing `socket.io` or vanilla `ws`.
- [ ] Bind user client connections to room configurations indexed by `userId` parameters upon connection (`ws://.../onboarding?userId=X`).
- [ ] Setup a lightweight internal communication mechanism (or Redis Pub/Sub) so the worker handler can emit `skin.analysis.completed` events through the gateway.
