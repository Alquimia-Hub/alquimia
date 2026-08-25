import { randomUUID } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";

const PORT = Number(process.env.DISCORD_STUB_PORT ?? 4100);

const GUILD_ID = "1234567890";

const CLIENT_ID = "alquimia-local-discord";
const CLIENT_SECRET = "alquimia-local-discord-secret";

const USERS = [
  {
    id: "100000000000000001",
    username: "brian",
    global_name: "Brian Sasbon",
    email: "brian@alquimia.dev",
    member: true,
    roles: ["core"],
  },
  {
    id: "100000000000000002",
    username: "maria",
    global_name: "Maria Lopez",
    email: "maria@alquimia.dev",
    member: true,
    roles: [],
  },
  {
    id: "100000000000000003",
    username: "forastero",
    global_name: "Forastero",
    email: "forastero@example.com",
    member: false,
    roles: [],
  },
];

const BEARER_PREFIX = /^Bearer\s+/i;
const GUILD_MEMBER_PATH = /^\/api\/v10\/users\/@me\/guilds\/([^/]+)\/member$/;
const TOGGLE_MEMBER_PATH = /^\/__dev\/toggle-member\/([^/]+)$/;

const codes = new Map();

const TOKENS_FILE = new URL("./.discord-stub-tokens.json", import.meta.url);

const refreshTokens = new Map();

const stored = existsSync(TOKENS_FILE)
  ? JSON.parse(readFileSync(TOKENS_FILE, "utf8"))
  : { access: {}, refresh: {} };

const tokens = new Map(Object.entries(stored.access ?? {}));

for (const [token, userId] of Object.entries(stored.refresh ?? {})) {
  refreshTokens.set(token, userId);
}

const persistTokens = () => {
  writeFileSync(
    TOKENS_FILE,
    JSON.stringify({
      access: Object.fromEntries(tokens),
      refresh: Object.fromEntries(refreshTokens),
    })
  );
};

const json = (res, status, body) => {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(body));
};

const html = (res, body) => {
  res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  res.end(body);
};

const bearerUser = (req) => {
  const token = req.headers.authorization?.replace(BEARER_PREFIX, "");
  const userId = token ? tokens.get(token) : undefined;
  return USERS.find((user) => user.id === userId);
};

const readBody = (req) =>
  new Promise((resolve) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
    });
    req.on("end", () => resolve(raw));
  });

function handleAuthorize(url, res) {
  const redirectUri = url.searchParams.get("redirect_uri");
  const state = url.searchParams.get("state");
  const scope = url.searchParams.get("scope") ?? "";

  const buttons = USERS.map((user) => {
    const code = randomUUID();
    codes.set(code, { userId: user.id, redirectUri });

    const target = new URL(redirectUri);
    target.searchParams.set("code", code);

    if (state) {
      target.searchParams.set("state", state);
    }

    const tag = user.member ? "miembro del server" : "NO es miembro";

    return `<li><a data-testid="discord-user-${user.username}" href="${target}">
      <strong>${user.global_name}</strong> <span>@${user.username} — ${tag}</span>
    </a></li>`;
  }).join("");

  return html(
    res,
    `<!doctype html><html lang="es"><head><meta charset="utf-8">
    <title>Discord (stub local)</title>
    <style>
      body{font-family:system-ui;background:#1a1b1e;color:#eee;padding:40px;max-width:520px;margin:0 auto}
      h1{font-size:20px} p{color:#aaa;font-size:14px}
      ul{list-style:none;padding:0} li{margin:8px 0}
      a{display:block;padding:14px 16px;background:#2b2d31;border:1px solid #3a3d43;border-radius:8px;color:#eee;text-decoration:none}
      a:hover{border-color:#5865f2} span{color:#999;font-size:13px}
      code{background:#2b2d31;padding:2px 6px;border-radius:4px;font-size:12px}
    </style></head><body>
    <h1>Discord — stub local</h1>
    <p>Scopes pedidos: <code>${scope}</code></p>
    <p>Elegi con que cuenta autorizar:</p>
    <ul>${buttons}</ul>
    </body></html>`
  );
}

async function handleToken(req, res) {
  const params = new URLSearchParams(await readBody(req));
  const grantType = params.get("grant_type") ?? "authorization_code";

  const userId =
    grantType === "refresh_token"
      ? refreshTokens.get(params.get("refresh_token") ?? "")
      : codes.get(params.get("code") ?? "")?.userId;

  if (!userId) {
    return json(res, 400, { error: "invalid_grant" });
  }

  if (grantType === "authorization_code") {
    codes.delete(params.get("code"));
  }

  const basic = req.headers.authorization?.startsWith("Basic ")
    ? Buffer.from(req.headers.authorization.slice(6), "base64").toString()
    : "";
  const clientId = params.get("client_id") ?? basic.split(":")[0];
  const clientSecret = params.get("client_secret") ?? basic.split(":")[1];

  if (clientId !== CLIENT_ID || clientSecret !== CLIENT_SECRET) {
    return json(res, 401, { error: "invalid_client" });
  }

  const accessToken = randomUUID();
  const refreshToken = randomUUID();

  tokens.set(accessToken, userId);
  refreshTokens.set(refreshToken, userId);
  persistTokens();

  return json(res, 200, {
    access_token: accessToken,
    token_type: "Bearer",
    expires_in: 604_800,
    refresh_token: refreshToken,
    scope: "identify email guilds.members.read",
  });
}

function handleMe(req, res) {
  const user = bearerUser(req);

  if (!user) {
    return json(res, 401, { message: "401: Unauthorized", code: 0 });
  }

  return json(res, 200, {
    id: user.id,
    username: user.username,
    global_name: user.global_name,
    email: user.email,
    verified: true,
    avatar: null,
    discriminator: "0",
  });
}

function handleGuildMember(req, res, guildId) {
  const user = bearerUser(req);

  if (!user) {
    return json(res, 401, { message: "401: Unauthorized", code: 0 });
  }

  if (guildId !== GUILD_ID || !user.member) {
    return json(res, 404, { message: "Unknown Guild", code: 10_004 });
  }

  return json(res, 200, {
    user: { id: user.id, username: user.username },
    nick: null,
    roles: user.roles,
    joined_at: "2024-01-15T10:00:00.000Z",
  });
}

function handleToggleMember(res, username) {
  const target = USERS.find((item) => item.username === username);

  if (!target) {
    return json(res, 404, { message: "Unknown user" });
  }

  target.member = !target.member;

  return json(res, 200, { username: target.username, member: target.member });
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = url.pathname;
  const isGet = req.method === "GET";

  if (path === "/oauth2/authorize" && isGet) {
    return handleAuthorize(url, res);
  }

  if (path === "/api/v10/oauth2/token" && req.method === "POST") {
    return await handleToken(req, res);
  }

  if (path === "/api/v10/users/@me" && isGet) {
    return handleMe(req, res);
  }

  const memberMatch = path.match(GUILD_MEMBER_PATH);

  if (memberMatch && isGet) {
    return handleGuildMember(req, res, memberMatch[1]);
  }

  const toggleMatch = path.match(TOGGLE_MEMBER_PATH);

  if (toggleMatch) {
    return handleToggleMember(res, toggleMatch[1]);
  }

  return json(res, 404, { message: "404: Not Found", code: 0 });
});

server.listen(PORT, () => {
  process.stdout.write(
    `Discord stub escuchando en http://localhost:${PORT} (guild ${GUILD_ID})\n`
  );
});
