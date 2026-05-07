export { default } from "next-auth/middleware"

export const config = {
  // Protects the main page, chat, and scan routes
  matcher: [
    "/",
    "/chat/:path*",
    "/scan/:path*"
  ]
}
