import { TextImproverForm } from '@/components/content/TextImproverForm';

export default function ImproveTextPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <TextImproverForm />
    </div>
  );
}

export const metadata = {
  title: 'AI Text Improver - ArtNft',
  description: 'Use AI to improve your text for clarity, tone, and impact.',
};
