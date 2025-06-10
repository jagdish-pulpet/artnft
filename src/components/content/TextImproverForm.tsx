'use client';

import React from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { improveTextAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Loader2 } from 'lucide-react';

const initialState = {
  message: null,
  errors: null,
  improvedText: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Improving...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Improve Text
        </>
      )}
    </Button>
  );
}

export function TextImproverForm() {
  const [state, formAction] = useFormState(improveTextAction, initialState);
  const [originalText, setOriginalText] = React.useState('');

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOriginalText(e.target.value);
  };

  return (
    <Card className="max-w-3xl mx-auto shadow-lg animate-subtle-appear">
      <CardHeader>
        <CardTitle className="text-2xl font-headline flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          AI Text Improver
        </CardTitle>
        <CardDescription>
          Enhance your writing with AI. Enter your text, choose a tone, and see the magic.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="text-input">Original Text</Label>
            <Textarea
              id="text-input"
              name="text"
              placeholder="Enter text to improve..."
              rows={8}
              required
              className="mt-1"
              value={originalText}
              onChange={handleTextChange}
            />
            {state?.errors?.text && (
              <p className="text-sm text-destructive mt-1">{state.errors.text[0]}</p>
            )}
          </div>

          <div>
            <Label htmlFor="tone-select">Desired Tone (Optional)</Label>
            <Select name="tone" defaultValue="neutral">
              <SelectTrigger id="tone-select" className="w-full md:w-[280px] mt-1">
                <SelectValue placeholder="Select a tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="neutral">Neutral</SelectItem>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="persuasive">Persuasive</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
              </SelectContent>
            </Select>
            {state?.errors?.tone && (
              <p className="text-sm text-destructive mt-1">{state.errors.tone[0]}</p>
            )}
          </div>

          {state?.message && !state.errors && !state.improvedText && (
             <p className={`text-sm ${state.message.includes("failed") || state.message.includes("error") ? "text-destructive" : "text-primary"}`}>{state.message}</p>
          )}
         
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-end gap-4">
           <SubmitButton />
        </CardFooter>
      </form>
      
      {state?.improvedText && (
        <div className="p-6 border-t animate-subtle-appear">
          <h3 className="text-lg font-semibold font-headline mb-2">Improved Text:</h3>
          <div className="p-4 bg-muted rounded-md whitespace-pre-wrap text-sm">
            {state.improvedText}
          </div>
        </div>
      )}
    </Card>
  );
}
