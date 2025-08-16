import { createServerClientForRoute } from '@repo/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/dashboard'

  const supabase = await createServerClientForRoute()

  console.log('Code received:', code, next)

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    console.log('Exchange code for session result:', data)
    if (!error) {
      const { data: platformData } = await supabase
        .from('platform_registry')
        .select('id')
        .eq('platform_name', 'google_business')
        .single()

      const { error: err } = await supabase
        .from('platform_connections')
        .upsert({
          user_id: data.session?.user.id,
          //   access_token: data.session?.provider_token,
          //   refresh_token: data.session?.provider_refresh_token,
          access_token: data.session?.access_token,
          refresh_token: data.session?.refresh_token,
          is_active: true,
          platform_name: 'google_business',
          platform_id: platformData?.id,
        })
      console.log('Upsert provider result:', err, platformData)
      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/error`)
}
