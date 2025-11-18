
import { GoogleGenAI, Type } from "@google/genai";
import type { CandidateProfile } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Using a mock service.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    name: {
      type: Type.STRING,
      description: "The full name of the candidate.",
    },
    role: {
      type: Type.STRING,
      description: "The candidate's most recent or desired job title/role.",
    },
    summary: {
      type: Type.STRING,
      description: "A professional summary about the candidate, written in the first person, under 150 words.",
    },
    skills: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of 5-10 key technical and soft skills extracted from the CV."
    }
  },
  required: ["name", "role", "summary", "skills"],
};

export const analyzeCvText = async (cvText: string): Promise<Partial<CandidateProfile>> => {
  if (!process.env.API_KEY) {
    // Mock response for development without API key
    return new Promise(resolve => setTimeout(() => resolve({
      name: "John Doe (Mock)",
      role: "Senior Frontend Engineer",
      aboutMe: "A passionate senior frontend engineer with over 10 years of experience building modern, responsive web applications. Proficient in React, TypeScript, and Tailwind CSS. Always eager to learn new technologies and contribute to team success.",
      skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Node.js", "UI/UX Design", "Agile Methodologies"],
    }), 1500));
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the following CV text and extract the candidate's information according to the provided JSON schema. Create a compelling professional summary.
        
        CV TEXT:
        ---
        ${cvText}
        ---`,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const parsedJson = JSON.parse(response.text);
    return {
        name: parsedJson.name,
        role: parsedJson.role,
        aboutMe: parsedJson.summary,
        skills: parsedJson.skills
    };
  } catch (error) {
    console.error("Error analyzing CV with Gemini:", error);
    throw new Error("Failed to analyze CV. Please check the text and try again.");
  }
};
