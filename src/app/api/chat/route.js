import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getWeather } from '@/lib/services/weather';
import { recommendPlants } from '@/lib/services/plants';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { history, message, imageBase64 } = await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Formatting history for the prompt context
    const chatContext = history.map(m => m.role + ": " + (m.text || "[Image]")).join('\n');

    const promptText = `You are a professional AI Gardening Planner and Consultant. 
    You have three main capabilities:
    1. "recommendation": Suggesting new plants based on the user's location, spaceType (Indoor, Balcony, Terrace, Backyard), and spaceSize (Small, Medium, Large).
    2. "diagnosis": Identifying plant diseases or pests from an uploaded image.
    3. "general_qa": Answering general gardening questions (e.g. watering schedules, soil types).

    The user just said: "${message}" ${imageBase64 ? "[USER ATTACHED AN IMAGE]" : ""}
    
    Here is the conversation history:
    ${chatContext}
    
    Analyze the user's latest message and return a STRICT JSON response (no markdown blocks, no extra text) with the following structure:
    {
      "intent": "recommendation" | "diagnosis" | "general_qa",
      "reply": "Your conversational response to the user. If they attached an image, diagnose it. If they asked a question, answer it. If they want plant recommendations, ask for missing info or introduce the suggestions.",
      "extracted": {
        "location": "City name or null",
        "spaceType": "Indoor | Balcony | Terrace | Backyard or null",
        "spaceSize": "Small | Medium | Large or null"
      },
      "isComplete": true/false (Set to true ONLY if intent is 'recommendation' AND all 3 extracted fields are NOT null. Otherwise false.)
    }`;

    // If an image was passed, we pass it dynamically to Gemini Vision capabilities
    let contentParts = [promptText];
    if (imageBase64) {
      // Expecting a base64 string starting like "data:image/jpeg;base64,/9j... "
      const mimeType = imageBase64.split(';')[0].split(':')[1];
      const base64Data = imageBase64.split(',')[1];
      contentParts.push({
        inlineData: {
          data: base64Data,
          mimeType
        }
      });
    }

    const result = await model.generateContent(contentParts);
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

    // If it's a perfectly completed recommendation intent
    if (parsedResult.intent === 'recommendation' && parsedResult.isComplete) {
      const ext = parsedResult.extracted;
      
      try {
        const weatherData = await getWeather(ext.location);
        const recommendedPlants = recommendPlants({
          temp: weatherData.temp,
          space: ext.spaceType,
          size: ext.spaceSize
        });

        return NextResponse.json({
          reply: parsedResult.reply + " Here are your tailored suggestions based on the climate!",
          isComplete: true,
          weather: weatherData,
          plants: recommendedPlants,
          extracted: ext
        });
      } catch (err) {
        return NextResponse.json({
          reply: "I found everything I need, but I had trouble checking the weather for that location. Are you sure it's correct? " + err.message,
          isComplete: false,
          extracted: { ...ext, location: null } // reset location to force asking again
        });
      }
    } 

    // For general Q&A, Diagnosis, or incomplete Recommendations, just return the reply
    return NextResponse.json({
      reply: parsedResult.reply,
      isComplete: false,
      extracted: parsedResult.extracted || { location: null, spaceType: null, spaceSize: null }
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
