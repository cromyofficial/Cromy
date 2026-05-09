// PhonePe Payment Gateway helper.
// Handles OAuth token (with in-memory caching), payment creation, and status checks.

const ENV = (process.env.PHONEPE_ENV ?? "UAT").toUpperCase();

const HOSTS = {
  PROD: {
    auth: "https://api.phonepe.com/apis/identity-manager/v1/oauth/token",
    pay: "https://api.phonepe.com/apis/pg/checkout/v2/pay",
    status: (id: string) =>
      `https://api.phonepe.com/apis/pg/checkout/v2/order/${id}/status`,
  },
  UAT: {
    auth: "https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token",
    pay: "https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/pay",
    status: (id: string) =>
      `https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/order/${id}/status`,
  },
} as const;

const hosts = ENV === "PROD" ? HOSTS.PROD : HOSTS.UAT;

interface CachedToken {
  accessToken: string;
  expiresAt: number; // epoch ms
}

let cachedToken: CachedToken | null = null;

async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt - 60_000 > now) {
    return cachedToken.accessToken;
  }

  const clientId = process.env.PHONEPE_CLIENT_ID;
  const clientSecret = process.env.PHONEPE_CLIENT_SECRET;
  const clientVersion = process.env.PHONEPE_CLIENT_VERSION ?? "1";

  if (!clientId || !clientSecret) {
    throw new Error("PhonePe credentials are not configured");
  }

  const body = new URLSearchParams({
    client_id: clientId,
    client_version: clientVersion,
    client_secret: clientSecret,
    grant_type: "client_credentials",
  });

  const res = await fetch(hosts.auth, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PhonePe auth failed (${res.status}): ${text}`);
  }

  const data = (await res.json()) as {
    access_token: string;
    expires_in?: number;
    expires_at?: number;
  };

  // PhonePe sometimes returns expires_at (epoch seconds) and/or expires_in (seconds)
  const expiresAtMs = data.expires_at
    ? data.expires_at * 1000
    : now + (data.expires_in ?? 600) * 1000;

  cachedToken = { accessToken: data.access_token, expiresAt: expiresAtMs };
  return cachedToken.accessToken;
}

export interface CreatePaymentInput {
  merchantOrderId: string;
  amountInPaise: number;
  redirectUrl: string;
  message?: string;
  expireAfterSeconds?: number;
  metaInfo?: Record<string, string>;
}

export interface CreatePaymentResult {
  orderId: string;
  state: string;
  redirectUrl: string;
  expireAt?: number;
}

export async function createPhonePePayment(
  input: CreatePaymentInput
): Promise<CreatePaymentResult> {
  const token = await getAccessToken();

  const payload = {
    merchantOrderId: input.merchantOrderId,
    amount: input.amountInPaise,
    expireAfter: input.expireAfterSeconds ?? 1200,
    metaInfo: input.metaInfo,
    paymentFlow: {
      type: "PG_CHECKOUT",
      message: input.message ?? "Payment for order",
      merchantUrls: { redirectUrl: input.redirectUrl },
    },
  };

  const res = await fetch(hosts.pay, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `O-Bearer ${token}`,
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`PhonePe pay failed (${res.status}): ${text}`);
  }

  const data = JSON.parse(text) as CreatePaymentResult;
  return data;
}

export interface PhonePeOrderStatus {
  orderId: string;
  state: "PENDING" | "COMPLETED" | "FAILED" | string;
  amount?: number;
  paymentDetails?: Array<{
    transactionId?: string;
    paymentMode?: string;
    state?: string;
    amount?: number;
  }>;
  [k: string]: unknown;
}

export async function getPhonePeOrderStatus(
  merchantOrderId: string
): Promise<PhonePeOrderStatus> {
  const token = await getAccessToken();

  const res = await fetch(hosts.status(merchantOrderId), {
    method: "GET",
    headers: { Authorization: `O-Bearer ${token}` },
    cache: "no-store",
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`PhonePe status failed (${res.status}): ${text}`);
  }
  return JSON.parse(text) as PhonePeOrderStatus;
}
