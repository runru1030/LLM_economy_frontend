import type { NextRequest } from "next/server";

const PROXY_URL = (process.env.NEXT_PROXY_API_URL || "").replace(/\/+$/, "");

export const runtime = "nodejs";

async function router(req: NextRequest) {
  req.headers.delete("transfer-encoding");
  req.headers.delete("host");
  req.headers.delete("origin");
  req.headers.delete("referer");
  req.headers.delete("content-length");
  
  const path = req.nextUrl.pathname.replace(/^\/api/, "");
  const search = req.nextUrl.search;
  const targetUrl = `${PROXY_URL}${path}${search}`;
  const body = req.method !== "GET" ? await req.blob() : ({ size: 0 } as Blob);

  const res = await fetch(targetUrl, {
    method: req.method,
    body: body.size ? body : undefined,
    headers: req.headers,
    next: { revalidate: 0 },
  });

  const headers = new Headers(res.headers);
  const cookies: string | null = headers.get("set-cookie");
  if (cookies) {
    headers.set("set-cookie", cookies.replace(/Domain.+?;/, ""));
  }

  // nextjs가 본문 요청 길이가 0인 경우 요청 길이를 제거하고 transfer-encoding을 추가하여 프론트에서 파싱 오류가 생김.
  let resBody: typeof res.body | string = res.body;
  if (
    req.nextUrl.href.includes("api") &&
    headers.get("Content-Length") === "0"
  ) {
    resBody = "{}";
    headers.set("Content-Length", "2");
  }

  return new Response(resBody, {
    status: res.status,
    headers: headers,
    statusText: res.statusText,
  });
}

export async function GET(req: NextRequest) {
  return router(req);
}

export async function POST(req: NextRequest) {
  return router(req);
}

export async function PATCH(req: NextRequest) {
  return router(req);
}

export async function PUT(req: NextRequest) {
  return router(req);
}

export async function DELETE(req: NextRequest) {
  return router(req);
}
