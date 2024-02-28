import { FrameRequest, getFrameMessage } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';


async function getResponse(req: NextRequest): Promise<NextResponse> {
const body: FrameRequest = await req.json();
let domainName: string = body.untrustedData.inputText;

let data = await fetchData(domainName) 
if (data.timeOut) {

}

let imageUrl = `https://3dns-domain-register-frame.vercel.app/og?domainName=${data.domainName}&&renewalFee=${data.renewalFee}&&firstYearRegistrationFee=${data.firstYearRegistrationFee}&&status=${data.status}`
if (data.status == "STATUS_UNAVAILABLE") {
    return new NextResponse(`<!DOCTYPE html><html><head>
            <title>Success Page</title>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="${imageUrl}"/>
            <meta property="fc:frame:button:1" content="Back" />
            <meta property="fc:frame:button:1:action" content="post"/>
            <meta property="fc:frame:post_url" content="https://3dns-domain-register-frame.vercel.app/api/frame/process"/>
            </head></html>`);
}

return new NextResponse(`<!DOCTYPE html><html><head>
  <title>Success Page</title>
  <meta property="fc:frame" content="vNext" />
  <meta property="fc:frame:image" content="${imageUrl}"/>
  <meta property="fc:frame:button:1" content="Back" />
  <meta property="fc:frame:button:1:action" content="post"/>
  <meta property="fc:frame:button:2" content="Purchase" />
  <meta property="fc:frame:button:2:action" content="post_redirect"/>
  <meta property="fc:frame:post_url" content="https://3dns-domain-register-frame.vercel.app/api/frame/process?domainName=${data.domainName}"/>
  </head></html>`);
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';


// const fetchData = async (domain: string) => {
//     let status;

    
//     try {
//       // Check if domain name contains a dot
//       if (!domain.includes('.')) {
//         // If not, concatenate ".com"
//         domain += '.com';
//       }
      
//       const response = await fetch(`https://api.3dns.xyz/api/v1/core_backend_service/domain/check_domain/${domain}`);
//       if (!response.ok) {
//         throw new Error('Failed to fetch data');
//       }
      
//       const data = await response.json();
//       status = data.status;

//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
  
//     return status;
//   };
  

// const fetchTimeout = <T>(url: string, options: RequestInit = {}, timeout = 5000): Promise<Response> => {
//     return new Promise((resolve, reject) => {
//       const timer = setTimeout(() => {
//         reject(new Error('Request timed out'));
//       }, timeout);
  
//       fetch(url, options)
//         .then(response => {
//           clearTimeout(timer);
//           resolve(response);
//         })
//         .catch(error => {
//           clearTimeout(timer);
//           reject(error);
//         });
//     });
// };
  

const fetchData = async (domain: string) => {
  let status;
  let firstYearRegistrationFee;
  let renewalFee;
  let domainName;
  let timeOut;
  
  try {
    // Check if domain name contains a dot
    if (!domain.includes('.')) {
      // If not, concatenate ".com"
      domain += '.com';
    }
    
    const response = await fetch(`https://api.3dns.xyz/api/v1/core_backend_service/domain/check_domain/${domain}`);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    status = data.status;
    firstYearRegistrationFee = data.price.CURRENCY_USD.firstYearRegistrationFee;
    renewalFee = data.price.CURRENCY_USD.renewalFee;
    domainName = data.domain;
  } catch (error) {
    console.error('Error fetching data:', error);
    timeOut = true;
  }

  return { status, firstYearRegistrationFee, renewalFee, domainName, timeOut};
};