import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyBLAdRB3VXA-B4wR7eE3IVrpBJbB_AEQy8");

export async function getTreeRecommendations(data) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  let prompt;

  if (data.userMessage) {
    if (data.temperature) {
      // If environmental data is available, include it in the context
      prompt = `Given the following environmental conditions:
      - Temperature: ${data.temperature}°C
      - Humidity: ${data.humidity}%
      - Wind Speed: ${data.windSpeed} m/s
      - Precipitation: ${data.precipitation} mm
      - Air Quality Index: ${data.airQuality}
      - Number of Trees Desired: ${data.numTrees}
      - Area Available: ${data.area} hectares

      Please answer this question about tree planting: ${data.userMessage}
      
      Provide a clear, detailed response focusing specifically on the question asked.`;
    } else {
      // For general questions without environmental data
      prompt = `As a tree planting expert, please answer this question: ${data.userMessage}
      
      Provide a clear, detailed response focusing on tree planting and environmental impact.`;
    }
  } else {
    // Initial recommendations prompt (requires environmental data)
    prompt = `As a tree planting expert, provide detailed recommendations for planting trees based on the following conditions:
    - Temperature: ${data.temperature}°C
    - Humidity: ${data.humidity}%
    - Wind Speed: ${data.windSpeed} m/s
    - Precipitation: ${data.precipitation} mm
    - Air Quality Index: ${data.airQuality}
    - Number of Trees Desired: ${data.numTrees}
    - Area Available: ${data.area} hectares

    Please provide specific recommendations including:
    1. Best tree species for these conditions
    2. Planting strategy and spacing
    3. Care and maintenance tips
    4. Environmental impact predictions
    
    Format the response in clear, separate points.`;
  }

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = await response.text();

  // Split the response into separate recommendations
  return text.split("\n").filter(line => line.trim().length > 0);
}
