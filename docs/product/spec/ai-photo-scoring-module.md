# Phase 1: AI Photo-Scoring Module

In a digital product, onboarding defines retention. Placing photo-scoring at the front creates an immediate **"Aha! Moment"** for the user. They receive an objective, scientific look at their skin condition within seconds. This builds the instant credibility needed to convert them into paying users for the subsequent protocol.

From an engineering perspective, this maps out your entire asynchronous, event-driven architecture (Next.js → R2 → NestJS → RabbitMQ → .NET → Third-Party Vision API → Redis → WebSockets). Once this pipeline is built, adding the protocol generator is just adding another worker subscriber.

---

## 1. Third-Party Vision API Strategy

Instead of training a custom model, the product will leverage **OpenAI's GPT-4o-mini** or **Anthropic's Claude 3.5 Sonnet** via API. 
* **Why:** They possess excellent spatial understanding, can detect textures, cost fractions of a cent per call, and require zero infrastructure maintenance.
* **The Implementation:** The system enforces **Structured Outputs (JSON Mode)** and a strict prompt to act as an expert digital aesthetician.

### The Data Schema (PostgreSQL / JSON Response)
The API must return a standardized JSON structure that maps directly to your database and your UI charts:

```json
{
  "cellulite_grade": 2,
  "confidence_score": 0.91,
  "metrics": {
    "dimple_count_density": 65,
    "skin_laxity": 40,
    "microcirculation_index": 55
  },
  "affected_zones": ["glutes_lower", "thigh_outer"],
  "clinical_justification": "Presença de ondulações superficiais visíveis apenas sob contração muscular ou compressão, características de Grau 2 (Edematosa/Fibrosa inicial)."
}
```

---

## 2. Technical Architecture Flow

To keep cloud costs near zero and handle image processing without blocking the main API thread, the architecture flows asynchronously:

[Next.js Client] ──(1. Presigned URL)──> [NestJS BFF]│├──(2. Direct Upload)──────────> [Cloudflare R2 Storage]│[Next.js Client] ──(3. Process Photo)──> [NestJS BFF] ──(4. Emit Event)──> [RabbitMQ]│[Next.js Client] <──(7. WebSocket WS)── [Redis Cache] <──(6. Save)─── [.NET Worker Service]│(5. Call Vision API)│[OpenAI / Anthropic]

1. **Secure Upload:** Next.js requests a secure, short-lived Presigned URL from NestJS. Next.js uploads the raw photo **directly** to Cloudflare R2. This bypasses the backend completely, saving server memory and bandwidth.
2. **The Message:** Next.js tells NestJS: *"The photo is ready at path X"*. NestJS drops a message into a RabbitMQ queue (`skin.analysis.v1`) and immediately responds `202 Accepted` to the client.
3. **The Worker Processing:** The `.NET Worker Service` consumes the message. It downloads the image from R2, optimizes it, sends it to the Third-Party Vision API with the custom system prompt, and receives the structured JSON analysis.
4. **The Real-Time Delivery:** The .NET worker saves the results to PostgreSQL, caches them in Redis, and emits a notification. NestJS reads this and pushes the final score to the Next.js frontend using **WebSockets (or Server-Sent Events)**. The user sees a loading spinner turn into a dynamic dashboard.

---

## 3. UX Design Challenges

Since this is the very first feature, the user experience will make or break your product launch.

* **The Guide Mask:** Users do not naturally know how to take a proper clinical photo. The UI must display an overlay outline (a silhouette) on the camera screen so they position their camera at the correct distance, angle, and lighting.
* **The Privacy Promise:** Before the camera opens, display a clear, reassuring modal: *"Sua privacidade é nossa prioridade. Suas fotos são criptografadas, nunca serão expostas, e você pode apagá-las quando quiser conforme a LGPD."*
* **The Post-Processing Delighter:** While the AI processes in the background (taking 3-5 seconds), do not show a boring spinner. Show a dynamic "Scanning Skin Layers..." animation with educational tooltips about cellulite types to keep them engaged.