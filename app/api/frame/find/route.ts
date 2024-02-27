import { FrameRequest, getFrameMessage } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';


async function getResponse(req: NextRequest): Promise<NextResponse> {
const body: FrameRequest = await req.json();

const { isValid, message } = await getFrameMessage(body, {
    allowFramegear: true, 
  });
if (message?.input) {
    throw new Error("message input is undefined")
}
return new NextResponse(`<!DOCTYPE html><html><head>
  <title>Success Page</title>
  <meta property="og:image" content="http://localhost:3002/base.png?valid=${isValid}"/>
  <meta property="fc:frame" content="vNext" />
  <meta property="fc:frame:image" content="http://localhost:3002/base.png?fid=${message?.input}"/>
  <meta property="fc:frame:button:1" content="Complete" />
  <meta property="fc:frame:button:1:action" content="post"/>
  <meta property="fc:frame:post_url" content=""/>
  </head></html>`);
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';