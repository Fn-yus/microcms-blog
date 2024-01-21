// 管理者用画面にBasic認証を実装するため

import { NextRequest, NextResponse } from 'next/server';

export const config = {
 //  matcher: ['/admin']
};

export default function middleware(req: NextRequest) {
  const basicAuth = req.headers.get('authorization');

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    const [user, password] = atob(authValue).split(':');

    if (user === process.env.USERNAME && password === process.env.PASSWORD) {
      return NextResponse.next();
    }
  }

  return new NextResponse('Unauthorized.', {
    status: 401,
    headers: {
      'WWW-authenticate': 'Basic realm="Secure Area"'
    }
  });
}
