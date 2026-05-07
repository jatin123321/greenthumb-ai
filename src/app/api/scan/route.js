import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { imageBase64 } = await request.json();

    if (!imageBase64) {
      return NextResponse.json({ error: "No image provided." }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const promptText = `You are an expert Botanist and Plant Identifier. 
The user has uploaded an image. Your task is to identify if the image contains a plant, herb, tree, or flower.

Rules:
1. If the image DOES NOT contain a plant, tree, herb, or flower (e.g. it is a dog, a car, a person, furniture), you MUST respond exactly with this JSON:
{"error": "This does not appear to be a plant or herb."}

2. If the image DOES contain a plant, herb, tree, or flower, identify it to the best of your ability. Return a JSON response with the following structure:
{
  "name": "Common name of the plant",
  "scientificName": "Scientific name",
  "type": "Herb / Tree / Succulent / Indoor Plant etc.",
  "description": "A 2-3 sentence description of the plant and its notable characteristics.",
  "care": "Brief care instructions (e.g., watering frequency, light needs).",
  "funFact": "A fun or interesting fact about this plant."
}

Ensure the response is ONLY a valid JSON object without markdown wrappers like \`\`\`json.`;

    const mimeType = imageBase64.split(';')[0].split(':')[1];
    const base64Data = imageBase64.split(',')[1];

    const result = await model.generateContent([
      promptText,
      {
        inlineData: {
          data: base64Data,
          mimeType
        }
      }
    ]);

    let outputText = result.response.text().trim();
    
    // Strip markdown formatting if the model still returns it
    if (outputText.startsWith('\`\`\`json')) {
      outputText = outputText.replace(/^\`\`\`json\n?/, '').replace(/\n?\`\`\`$/, '');
    }
    if (outputText.startsWith('\`\`\`')) {
       outputText = outputText.replace(/^\`\`\`\n?/, '').replace(/\n?\`\`\`$/, '');
    }

    let parsedResult;
    try {
      parsedResult = JSON.parse(outputText);
    } catch (e) {
      console.error("Failed to parse Gemini output:", outputText);
      return NextResponse.json({ error: "Failed to parse AI response." }, { status: 500 });
    }

    return NextResponse.json(parsedResult);

  } catch (error) {
    console.error('Scanner API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
