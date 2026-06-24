## 🏗️ Detailed Application Orchestration Steps
## 1. Next.js Client Interaction

* The user clicks "Desbloquear Via Pix Copia e Cola".
* The AuthBottomSheet appears. The user types their email.
* The Payload: The client sends the email AND the current anonymous report states (activeGrade, waterIntake, circulationProfile) to the NestJS BFF.
* Why? We cannot lose their diagnostic data! We must tie this quiz to their newly created account implicitly.

## 2. NestJS BFF (Backend For Frontend)

* Receives the payload.
* Generates a secure, short-lived cryptographic login token (e.g., valid for 15 minutes) and a temporary userId or registrationId.
* Instead of sending the email directly (which blocks the HTTP request and degrades UX), NestJS publishes a UserRegistrationRequested event to RabbitMQ.
* Instantly returns a 202 Accepted response code to the Next.js client, making the UI feel blazing fast.

## 3. RabbitMQ & .NET Worker Service

* RabbitMQ routes the event to the processing queue.
* The .NET Worker Service consumes the event.
* It saves the pending user profile and their quiz inputs into PostgreSQL.
* It constructs the target URL: https://your-app.com.
* It calls your transactional email provider API (like Resend, Mailgun, or AWS SES) to fire the Magic Link email using a beautiful, clean template.

## 4. The Activation Loop & Redirect (Next.js Callback)

* The user clicks the Magic Link in their email browser or mobile phone.
* They land on your Next.js API route (/api/auth/callback).
* The Next.js backend validates the token with NestJS/Redis, marks the email as verified, drops an HTTP-only secure cookie (session JWT), and smoothly redirects the user directly to the Payment Checkout Page populated with their Pix payload. [1, 2] 

------------------------------
## 🎨 UX & Growth Specialist Optimization Notes
Pre-fill checkout data: When redirecting to the payment gateway (like Asaas, Stripe, or Mercado Pago), pass the email as a query parameter so the user doesn't have to type it a second time on the bank/gateway screen.

Which transactional email provider you want to configure as the primary option if you prefer something other than Resend (e.g., AWS SES, Mailgun, Infobip)
