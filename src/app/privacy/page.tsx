
'use client';

import { Navbar } from '@/components/common/navbar';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 sm:p-6 md:p-8 selection:bg-accent/30 selection:text-accent-foreground">
        <div className="container mx-auto">
          <div className="mb-6">
            <Button variant="outline" asChild>
              <Link href="/home">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
           <div className="bg-card p-6 sm:p-8 md:p-10 rounded-xl shadow-xl">
            <div className="flex items-center mb-6">
              <ShieldCheck className="h-10 w-10 text-primary mr-4" strokeWidth={1.5} />
              <h1 className="text-3xl sm:text-4xl font-headline font-bold text-primary tracking-tight">
                Privacy Policy
              </h1>
            </div>
            <div className="prose prose-lg max-w-none text-foreground/90 font-body space-y-4">
              <p>Your privacy is important to us. It is ArtNFT Marketplace's policy to respect your privacy regarding any information we may collect from you across our website.</p>
              
              <h2 className="text-xl font-semibold text-primary">1. Information We Collect</h2>
              <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.</p>
              <p>Information we may collect includes:</p>
              <ul className="list-disc list-inside ml-4">
                <li>Email address (for account creation and communication)</li>
                <li>Username (for your public profile)</li>
                <li>Wallet address (for transactions and NFT ownership)</li>
                <li>Usage data (how you interact with our service)</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>

              <h2 className="text-xl font-semibold text-primary">2. How We Use Your Information</h2>
              <p>We use the information we collect in various ways, including to:</p>
              <ul className="list-disc list-inside ml-4">
                <li>Provide, operate, and maintain our website</li>
                <li>Improve, personalize, and expand our website</li>
                <li>Understand and analyze how you use our website</li>
                <li>Develop new products, services, features, and functionality</li>
                <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes (with your consent where required)</li>
                <li>Process your transactions and manage your orders</li>
                <li>Find and prevent fraud and other security issues</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2 className="text-xl font-semibold text-primary">3. Log Files and Analytics</h2>
              <p>ArtNFT Marketplace follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.</p>
              <p>We may also use third-party analytics services (like Google Analytics) that collect, monitor and analyze this type of information in order to increase our Service's functionality. These third-party service providers have their own privacy policies addressing how they use such information.</p>
              
              <h2 className="text-xl font-semibold text-primary">4. Cookies and Web Beacons</h2>
              <p>Like any other website, ArtNFT Marketplace uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.</p>

              <h2 className="text-xl font-semibold text-primary">5. Security of Your Information</h2>
              <p>We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification. However, remember that no method of transmission over the Internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.</p>
              
              <h2 className="text-xl font-semibold text-primary">6. Links to Other Sites</h2>
              <p>Our website may link to external sites that are not operated by us. Please be aware that we have no control over the content and practices of these sites, and cannot accept responsibility or liability for their respective privacy policies. We strongly advise you to review the Privacy Policy of every site you visit.</p>

              <h2 className="text-xl font-semibold text-primary">7. Children's Privacy</h2>
              <p>Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13. In the case we discover that a child under 13 has provided us with personal information, we immediately delete this from our servers. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that we will be able to do necessary actions.</p>

              <h2 className="text-xl font-semibold text-primary">8. Changes to This Privacy Policy</h2>
              <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. We will let you know via email and/or a prominent notice on our Service, prior to the change becoming effective and update the "effective date" at the top of this Privacy Policy.</p>
              <p>You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>

              <p className="mt-8 text-sm text-muted-foreground">This is a placeholder Privacy Policy document. For a real application, consult with a legal professional and tailor it to your specific data practices.</p>
            </div>
          </div>
        </div>
      </main>
      <Toaster />
    </>
  );
}
