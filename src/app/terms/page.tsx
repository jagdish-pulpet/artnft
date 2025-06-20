
'use client';

import { Navbar } from '@/components/common/navbar';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText } from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
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
              <FileText className="h-10 w-10 text-primary mr-4" strokeWidth={1.5} />
              <h1 className="text-3xl sm:text-4xl font-headline font-bold text-primary tracking-tight">
                Terms of Service
              </h1>
            </div>
            <div className="prose prose-lg max-w-none text-foreground/90 font-body space-y-4">
              <p>Welcome to ArtNFT Marketplace! These terms and conditions outline the rules and regulations for the use of ArtNFT Marketplace's Website.</p>
              
              <h2 className="text-xl font-semibold text-primary">1. Introduction</h2>
              <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use ArtNFT Marketplace if you do not agree to take all of the terms and conditions stated on this page.</p>
              <p>The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements: "Client", "You" and "Your" refers to you, the person log on this website and compliant to the Company’s terms and conditions. "The Company", "Ourselves", "We", "Our" and "Us", refers to our Company. "Party", "Parties", or "Us", refers to both the Client and ourselves. All terms refer to the offer, acceptance and consideration of payment necessary to undertake the process of our assistance to the Client in the most appropriate manner for the express purpose of meeting the Client’s needs in respect of provision of the Company’s stated services, in accordance with and subject to, prevailing law of Netherlands. Any use of the above terminology or other words in the singular, plural, capitalization and/or he/she or they, are taken as interchangeable and therefore as referring to same.</p>

              <h2 className="text-xl font-semibold text-primary">2. Intellectual Property Rights</h2>
              <p>Other than the content you own, under these Terms, ArtNFT Marketplace and/or its licensors own all the intellectual property rights and materials contained in this Website. You are granted limited license only for purposes of viewing the material contained on this Website.</p>
              
              <h2 className="text-xl font-semibold text-primary">3. Restrictions</h2>
              <p>You are specifically restricted from all of the following:</p>
              <ul className="list-disc list-inside ml-4">
                <li>Publishing any Website material in any other media.</li>
                <li>Selling, sublicensing and/or otherwise commercializing any Website material.</li>
                <li>Publicly performing and/or showing any Website material.</li>
                <li>Using this Website in any way that is or may be damaging to this Website.</li>
                <li>Using this Website in any way that impacts user access to this Website.</li>
                <li>Using this Website contrary to applicable laws and regulations, or in any way may cause harm to the Website, or to any person or business entity.</li>
                <li>Engaging in any data mining, data harvesting, data extracting or any other similar activity in relation to this Website.</li>
                <li>Using this Website to engage in any advertising or marketing.</li>
              </ul>
              <p>Certain areas of this Website are restricted from being access by you and ArtNFT Marketplace may further restrict access by you to any areas of this Website, at any time, in absolute discretion. Any user ID and password you may have for this Website are confidential and you must maintain confidentiality as well.</p>
              
              <h2 className="text-xl font-semibold text-primary">4. Your Content</h2>
              <p>In these Website Standard Terms and Conditions, “Your Content” shall mean any audio, video text, images or other material you choose to display on this Website. By displaying Your Content, you grant ArtNFT Marketplace a non-exclusive, worldwide irrevocable, sub licensable license to use, reproduce, adapt, publish, translate and distribute it in any and all media.</p>
              <p>Your Content must be your own and must not be invading any third-party’s rights. ArtNFT Marketplace reserves the right to remove any of Your Content from this Website at any time without notice.</p>

              <h2 className="text-xl font-semibold text-primary">5. No warranties</h2>
              <p>This Website is provided “as is,” with all faults, and ArtNFT Marketplace express no representations or warranties, of any kind related to this Website or the materials contained on this Website. Also, nothing contained on this Website shall be interpreted as advising you.</p>

              <h2 className="text-xl font-semibold text-primary">6. Limitation of liability</h2>
              <p>In no event shall ArtNFT Marketplace, nor any of its officers, directors and employees, shall be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract. ArtNFT Marketplace, including its officers, directors and employees shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this Website.</p>
              
              <h2 className="text-xl font-semibold text-primary">7. Indemnification</h2>
              <p>You hereby indemnify to the fullest extent ArtNFT Marketplace from and against any and/or all liabilities, costs, demands, causes of action, damages and expenses arising in any way related to your breach of any of the provisions of these Terms.</p>

              <p className="mt-8 text-sm text-muted-foreground">This is a placeholder Terms of Service document. For a real application, consult with a legal professional and tailor it to your specific data practices.</p>
            </div>
          </div>
        </div>
      </main>
      <Toaster />
    </>
  );
}
