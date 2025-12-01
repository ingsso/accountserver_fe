import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // signin 페이지는 항상 허용 (무한 리디렉션 방지)
    if (req.nextUrl.pathname.startsWith('/account/signin') || 
        req.nextUrl.pathname.startsWith('/account/signout')) {
      return NextResponse.next()
    }
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // signin/signout 페이지는 항상 허용 (무한 리디렉션 방지)
        const pathname = req.nextUrl.pathname
        if (pathname.startsWith('/account/signin') || 
            pathname.startsWith('/account/signout') ||
            pathname.startsWith('/api/auth')) {
          return true
        }
        // 인증이 필요한 페이지는 토큰이 있어야 함
        return !!token
      },
    },
    pages: {
      signIn: '/account/signin',
    },
  }
)

export const config = {
  // signin 페이지는 matcher에서 제외 (명시적으로 제외하지 않아도 되지만 명확성을 위해)
  matcher: [
    '/admin/:path*', 
    '/mypage', 
    '/product/query',
    // signin/signout은 제외하지 않아도 authorized 콜백에서 처리됨
  ],
};
