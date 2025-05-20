
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { jobTitle, jobDescription, numberOfQuestions = 5 } = await req.json();
    const hfToken = Deno.env.get('HUGGINGFACE_API_TOKEN');
    
    if (!hfToken) {
      return new Response(
        JSON.stringify({ error: 'Huggingface API token not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const hf = new HfInference(hfToken);
    
    const prompt = `Generate ${numberOfQuestions} professional interview questions for a ${jobTitle} position based on this job description: "${jobDescription}". 
    The questions should assess relevant skills, experience and cultural fit. 
    Format the response as a JSON array of strings, with each string being a separate question. 
    Do not include any explanations, just the JSON array.
    Example format: ["Question 1?", "Question 2?", "Question 3?"]`;
    
    // Use a suitable text generation model from Huggingface
    const response = await hf.textGeneration({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      inputs: prompt,
      parameters: {
        max_new_tokens: 1024,
        temperature: 0.7,
        top_p: 0.95,
      }
    });
    
    // Extract JSON array from the response
    const text = response.generated_text;
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    
    if (jsonMatch) {
      try {
        const questions = JSON.parse(jsonMatch[0]);
        return new Response(
          JSON.stringify({ questions }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (error) {
        console.error("JSON parsing error:", error);
        // Fallback: extract questions from the text
        const fallbackQuestions = extractQuestionsFromText(text);
        return new Response(
          JSON.stringify({ questions: fallbackQuestions }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else {
      // Fallback: extract questions from the text
      const fallbackQuestions = extractQuestionsFromText(text);
      return new Response(
        JSON.stringify({ questions: fallbackQuestions }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error in generate-interview-questions function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Helper function to extract questions from text if JSON parsing fails
function extractQuestionsFromText(text: string): string[] {
  // Look for text that appears to be a question (ends with ? or has question number)
  const questionMatches = text.match(/[^.!?]*\?/g) || [];
  return questionMatches
    .map(q => q.trim())
    .filter(q => q.length > 10) // Filter out very short matches
    .slice(0, 5); // Limit to 5 questions
}
