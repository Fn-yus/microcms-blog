// VERCEL_URLは自動割当される

export const currentUrl = process.env.STATUS === "local" ? "http://localhost:3000" : `https://${process.env.VERCEL_URL}`