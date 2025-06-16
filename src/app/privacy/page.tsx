
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
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
            <CardTitle className="text-3xl font-bold font-headline">Privacy Policy</CardTitle>
            <CardDescription>Last updated: {new Date().toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>ArtNFT ("us", "we", or "our") operates the artnft.com website (the "Service").</p>
            <p>This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data. This is a placeholder Privacy Policy.</p>

            <h2>1. Information Collection and Use</h2>
            <p>We collect several different types of information for various purposes to provide and improve our Service to you.</p>
            <h3>Types of Data Collected</h3>
            <h4>Personal Data</h4>
            <p>While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to:</p>
            <ul>
              <li>Email address</li>
              <li>First name and last name</li>
              <li>Cookies and Usage Data</li>
            </ul>
            
            <h2>2. Use of Data</h2>
            <p>ArtNFT uses the collected data for various purposes:</p>
            <ul>
              <li>To provide and maintain the Service</li>
              <li>To notify you about changes to our Service</li>
              {/* Add more uses */}
            </ul>

            <h2>3. Security of Data</h2>
            <p>The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.</p>

            {/* Add more sections as needed: Transfer Of Data, Disclosure Of Data, Service Providers, Links To Other Sites, Children's Privacy, Changes To This Privacy Policy, Contact Us */}

            <p>This is a placeholder document for the Privacy Policy.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
