
'use client';

import { useState, useEffect } from 'react';
import { getNftRecommendations, NftRecommendationsInput, NftRecommendationsOutput } from '@/ai/flows/personalized-nft-recommendations';
import NftCard from '@/components/nft-card';
import type { NFT, RecommendedNFT } from '@/types';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, AlertTriangle, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Helper to map RecommendedNFT to NFT for NftCard component
const mapRecommendedToNft = (recommended: RecommendedNFT): NFT => ({
  id: recommended.nftId, // Use nftId as id
  nftId: recommended.nftId,
  title: recommended.title,
  imageUrl: recommended.imageUrl,
  artist: recommended.artist,
  price: recommended.price,
  description: `Recommended artwork: ${recommended.title} by ${recommended.artist}. Priced at ${recommended.price} ETH.`, // Placeholder description
  artStyle: 'Recommendation', // Placeholder art style
});


export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Mock user data for the AI flow input
      const userInput: NftRecommendationsInput = {
        userViewingHistory: ['1', '3'], // Mock IDs of viewed NFTs
        userSavedNfts: ['2'],          // Mock IDs of saved NFTs
      };
      
      // Simulate a slight delay for AI processing if needed, or call directly
      // In a real app, this might take a few seconds
      // For now, we use mock data directly if the AI flow doesn't provide varied enough results or for testing
      
      // const aiOutput: NftRecommendationsOutput = await getNftRecommendations(userInput);
      // Using mock output to ensure UI diversity as per AI flow's placeholder nature
      const mockAiOutput: NftRecommendationsOutput = [
        { nftId: 'mock1', title: 'AI Abstract #1', imageUrl: 'https://placehold.co/600x600.png?a=1', artist: 'GenAI Bot', price: 1.2 },
        { nftId: 'mock2', title: 'Generated Landscape', imageUrl: 'https://placehold.co/600x700.png?a=2', artist: 'AlgoArtist', price: 0.8 },
        { nftId: 'mock3', title: 'Dream Sequence AI', imageUrl: 'https://placehold.co/500x500.png?a=3', artist: 'NeuralNet Painter', price: 2.1 },
        { nftId: 'mock4', title: 'AI Still Life', imageUrl: 'https://placehold.co/700x500.png?a=4', artist: 'SynthWave Studio', price: 1.5 },
      ];
      const aiOutput = mockAiOutput;


      if (aiOutput && aiOutput.length > 0) {
        setRecommendations(aiOutput.map(mapRecommendedToNft));
      } else {
        setRecommendations([]); // Set to empty if no recommendations
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Failed to load recommendations. Please try again.');
      setRecommendations([]); // Clear recommendations on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return (
    <div className="space-y-8">
      <Card className="bg-primary shadow-lg">
        <CardHeader className="text-center">
          <Sparkles className="w-12 h-12 text-primary-foreground mx-auto mb-3" />
          <CardTitle className="text-2xl sm:text-3xl font-headline font-bold text-primary-foreground">Your Personalized NFT Picks</CardTitle>
          <CardDescription className="text-primary-foreground/80">
            Discover artworks specially selected for you by our AI.
          </CardDescription>
        </CardHeader>
      </Card>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-accent mb-4" />
          <p className="text-lg text-muted-foreground">Generating your recommendations...</p>
        </div>
      )}

      {error && !isLoading && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-10 w-10 text-destructive mx-auto mb-3" />
            <p className="text-destructive font-semibold mb-2">{error}</p>
            <Button onClick={fetchRecommendations} variant="destructive">
              <RefreshCw className="mr-2 h-4 w-4" /> Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {!isLoading && !error && recommendations.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recommendations.map((nft) => (
            <NftCard key={nft.id} nft={nft} />
          ))}
        </div>
      )}

      {!isLoading && !error && recommendations.length === 0 && (
         <div className="text-center py-12">
            <p className="text-xl text-muted-foreground mb-4">No recommendations available at the moment.</p>
            <p className="text-sm text-muted-foreground">Try exploring more NFTs to help us learn your taste!</p>
            <Button onClick={fetchRecommendations} variant="outline" className="mt-4 text-accent border-accent hover:bg-accent hover:text-accent-foreground">
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh Recommendations
            </Button>
        </div>
      )}
    </div>
  );
}
