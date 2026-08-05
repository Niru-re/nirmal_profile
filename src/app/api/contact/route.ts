import nodemailer from "nodemailer";

const CONTACT_EMAIL = process.env.CONTACT_EMAIL?.trim();
const SMTP_HOST = process.env.SMTP_HOST?.trim();
const SMTP_PORT = Number(process.env.SMTP_PORT ?? 587);
const SMTP_USER = process.env.SMTP_USER?.trim();
const SMTP_PASS = process.env.SMTP_PASS?.trim();
const DEST_EMAIL = CONTACT_EMAIL || SMTP_USER;

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const submissionHistory = new Map<string, number[]>();

function getClientIp(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  return req.headers.get("x-real-ip") ?? "unknown";
}

function sanitizeHeaderValue(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }
  return value.replace(/\r|\n/g, " ").trim();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .trim();
}

function validateEmail(email: string) {
  const cleaned = email.trim();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(cleaned);
}

function getRateLimitedResponse(ip: string) {
  const now = Date.now();
  const timestamps = submissionHistory.get(ip) ?? [];
  const windowed = timestamps.filter((timestamp) => now - timestamp <= RATE_LIMIT_WINDOW_MS);

  windowed.push(now);
  submissionHistory.set(ip, windowed);

  if (windowed.length > RATE_LIMIT_MAX_REQUESTS) {
    return new Response(
      JSON.stringify({ error: "Too many contact requests from this IP. Please try again later." }),
      { status: 429 }
    );
  }

  return null;
}

function createTransporter() {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: false,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

function buildEmailHtml({
  name,
  email,
  subject,
  message,
  userAgent,
  ip,
  submittedAt,
}: {
  name: string;
  email: string;
  subject: string;
  message: string;
  userAgent: string;
  ip: string;
  submittedAt: string;
}) {
  return `
    <div style="font-family: Inter, system-ui, sans-serif; color: #111; line-height: 1.6;">
      <h1 style="font-size: 1.6rem; margin-bottom: 0.75rem;">New Portfolio Contact Message</h1>
      <p style="margin: 0 0 1.5rem; color: #4a5568;">A visitor submitted the contact form from your portfolio.</p>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 0.75rem 0; font-weight: 600; width: 160px;">Name</td>
          <td style="padding: 0.75rem 0;">${escapeHtml(name)}</td>
        </tr>
        <tr style="background: #f7fafc;">
          <td style="padding: 0.75rem 0; font-weight: 600;">Email</td>
          <td style="padding: 0.75rem 0;">${escapeHtml(email)}</td>
        </tr>
        <tr>
          <td style="padding: 0.75rem 0; font-weight: 600;">Subject</td>
          <td style="padding: 0.75rem 0;">${escapeHtml(subject)}</td>
        </tr>
        <tr style="background: #f7fafc;">
          <td style="padding: 0.75rem 0; font-weight: 600;">Date</td>
          <td style="padding: 0.75rem 0;">${escapeHtml(submittedAt)}</td>
        </tr>
        <tr>
          <td style="padding: 0.75rem 0; font-weight: 600;">IP Address</td>
          <td style="padding: 0.75rem 0;">${escapeHtml(ip)}</td>
        </tr>
        <tr style="background: #f7fafc;">
          <td style="padding: 0.75rem 0; font-weight: 600;">User Agent</td>
          <td style="padding: 0.75rem 0;">${escapeHtml(userAgent)}</td>
        </tr>
      </table>
      <div style="margin-top: 1.5rem; padding: 1rem; background: #edf2f7; border-radius: 0.75rem;">
        <h2 style="font-size: 1.05rem; margin-bottom: 0.5rem;">Message</h2>
        <p style="white-space: pre-wrap; margin: 0;">${escapeHtml(message).replace(/\r?\n/g, "<br />")}</p>
      </div>
    </div>
  `;
}

function buildAutoReplyHtml(name: string) {
  return `
    <div style="font-family: Inter, system-ui, sans-serif; color: #111; line-height: 1.7;">
      <div style="max-width: 600px; margin: 0 auto; padding: 1.25rem; background: #ffffff; border-radius: 1rem; border: 1px solid #e2e8f0;">
        <h1 style="font-size: 1.6rem; margin-bottom: 0.5rem;">Thanks for contacting Nirmal</h1>
        <p style="margin: 0 0 1rem; color: #4a5568;">Hi ${escapeHtml(name)},</p>
        <p style="margin: 0 0 1rem;">Thank you for reaching out through my portfolio. I have received your message and I will review it carefully.</p>
        <p style="margin: 0 0 1rem;">I will reply as soon as possible with a detailed response.</p>
        <p style="margin: 0;">Best regards,<br /><strong>Nirmal</strong><br />Nirmal Portfolio</p>
      </div>
    </div>
  `;
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rateLimitResponse = getRateLimitedResponse(ip);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  if (!DEST_EMAIL) {
    console.error("Missing CONTACT_EMAIL environment variable.");
    return new Response(
      JSON.stringify({ error: "Server configuration error: CONTACT_EMAIL is not set." }),
      { status: 500 }
    );
  }

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.error("Missing Gmail SMTP credentials.");
    return new Response(
      JSON.stringify({ error: "SMTP configuration is incomplete. Set SMTP_HOST, SMTP_USER, and SMTP_PASS." }),
      { status: 500 }
    );
  }

  const data = await req.json().catch(() => null);
  const name = sanitizeHeaderValue(data?.name);
  const email = sanitizeHeaderValue(data?.email);
  const subject = sanitizeHeaderValue(data?.subject);
  const message = typeof data?.message === "string" ? data.message.trim() : "";

  if (!name || !email || !subject || !message) {
    return new Response(JSON.stringify({ error: "All fields are required." }), { status: 400 });
  }

  if (!validateEmail(email)) {
    return new Response(JSON.stringify({ error: "Please provide a valid email address." }), { status: 400 });
  }

  if (message.length < 10) {
    return new Response(
      JSON.stringify({ error: "Message must be at least 10 characters." }),
      { status: 400 }
    );
  }

  if (message.length > 2000) {
    return new Response(
      JSON.stringify({ error: "Message must be 2000 characters or fewer." }),
      { status: 400 }
    );
  }

  const userAgent = req.headers.get("user-agent") ?? "Unknown";
  const submittedAt = new Date().toLocaleString("en-US", { timeZone: "UTC", hour12: true });

  try {
    const transporter = createTransporter();

    const contactHtml = buildEmailHtml({
      name,
      email,
      subject,
      message,
      userAgent,
      ip,
      submittedAt,
    });

    await transporter.sendMail({
      from: SMTP_USER,
      to: DEST_EMAIL,
      replyTo: `${name} <${email}>`,
      subject: "New Portfolio Contact Message",
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nDate: ${submittedAt}\nIP: ${ip}\nUser Agent: ${userAgent}\n\n${message}`,
      html: contactHtml,
    });

    await transporter.sendMail({
      from: SMTP_USER,
      to: email,
      subject: "Thanks for contacting Nirmal",
      text: `Hi ${name},\n\nThank you for contacting Nirmal. I received your message and will reply soon.\n\nBest regards,\nNirmal Portfolio`,
      html: buildAutoReplyHtml(name),
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (error: unknown) {
    const err = error as { message?: string; code?: string };
    console.error("Contact API error:", err);

    if (err?.code === "EAUTH" || /authentication/i.test(err?.message ?? "")) {
      return new Response(
        JSON.stringify({ error: "Gmail authentication failed. Use a Gmail App Password and confirm SMTP_USER/SMTP_PASS are correct." }),
        { status: 500 }
      );
    }

    return new Response(JSON.stringify({ error: "Unable to send email at this time. Please try again later." }), { status: 500 });
  }
}
