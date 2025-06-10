
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/signup"> {/* Or wherever user came from */}
            <ChevronLeft className="h-4 w-4 mr-2" /> Back
          </Link>
        </Button>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold font-headline">Terms and Conditions</CardTitle>
            <CardDescription>Last updated: {new Date().toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>Welcome to ArtNFT!</p>
            <p>These terms and conditions outline the rules and regulations for the use of ArtNFT's Website, located at artnft.com.</p>
            <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use ArtNFT if you do not agree to take all of the terms and conditions stated on this page.</p>
            
            <h2>1. Introduction</h2>
            <p>Placeholder for introduction...</p>

            <h2>2. Intellectual Property Rights</h2>
            <p>Other than the content you own, under these Terms, ArtNFT and/or its licensors own all the intellectual property rights and materials contained in this Website.</p>
            
            <h2>3. Restrictions</h2>
            <p>You are specifically restricted from all of the following:</p>
            <ul>
              <li>Publishing any Website material in any other media;</li>
              <li>Selling, sublicensing and/or otherwise commercializing any Website material;</li>
              <li>Publicly performing and/or showing any Website material;</li>
              {/* Add more restrictions as needed */}
            </ul>

            <h2>4. Your Content</h2>
            <p>In these Website Standard Terms and Conditions, “Your Content” shall mean any audio, video text, images or other material you choose to display on this Website. By displaying Your Content, you grant ArtNFT a non-exclusive, worldwide irrevocable, sub licensable license to use, reproduce, adapt, publish, translate and distribute it in any and all media.</p>
            
            <h2>5. No warranties</h2>
            <p>This Website is provided “as is,” with all faults, and ArtNFT express no representations or warranties, of any kind related to this Website or the materials contained on this Website. Also, nothing contained on this Website shall be interpreted as advising you.</p>

            {/* Add more sections as needed: Limitation of liability, Indemnification, Severability, Variation of Terms, Assignment, Entire Agreement, Governing Law & Jurisdiction */}

            <p>Please read these terms carefully. This is a placeholder document.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
