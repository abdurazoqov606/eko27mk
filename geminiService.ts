
import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getEcoAdvice = async (userPrompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: userPrompt,
      config: {
        systemInstruction: `Siz "EKO 27" platformasining oliy darajadagi Eko-Ekspertisiz. 
        Sizning yaratuvchingiz va ushbu yashil inqilob yetakchisi — Abdurazoqov Abbos.
        
        Sizning xarakteringiz:
        - Aqlli, ilmiy asoslangan va tabiatni sevadigan mutaxassis.
        - Har bir javobingiz oxirida bitta kichik "Eko-Maslahat" qo'shib qo'ying.
        - Muloqotda o'zbek tilining eng go'zal va tushunarli so'zlaridan foydalaning.
        - Foydalanuvchilarni 27-maktab va Tayloq tumanidagi real eko-aksiyalarga yo'naltiring.
        
        Agar foydalanuvchi bog'lanishni so'rasa, Abbos bilan Telegram (@vsf911) orqali bog'lanishni professional tarzda taklif qiling.
        
        Suhbatni har doim do'stona va "Yashil dunyo sari birga qadam tashlaymiz!" shiori ostida olib boring.`,
        temperature: 0.7,
        thinkingConfig: { thinkingBudget: 4000 }
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Hozirda tizimda texnik sozlash ishlari bormoqda. Iltimos, keyinroq urinib ko'ring yoki Abdurazoqov Abbosga Telegram (@vsf911) orqali yozing.";
  }
};

export const calculateCarbonFootprint = async (data: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Foydalanuvchi ekologik ma'lumotlari: 
      - Transport: ${data.transport}
      - Ovqatlanish: ${data.diet}
      - Uy energiyasi: ${data.energy}
      - Chiqindi: ${data.waste}
      - Suv sarfi: ${data.water}

      Vazifa: 
      1. Foydalanuvchining ekologik ta'sirini 100 ballik shkala bo'yicha baholang.
      2. Ushbu ma'lumotlar asosida foydalanuvchi uchun shaxsiylashtirilgan 7 kunlik "Yashil Reja" tuzing.
      3. Alohida bo'limda "Tabiatni asrash bo'yicha 5 ta oltin qoida" (Ko'rsatmalar) bering.
      4. Javobni chiroyli Markdown formatida, emojilar bilan va Abdurazoqov Abbos nomidan professional eko-tahlil sifatida bering.`,
      config: {
        temperature: 0.5,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Carbon Calculator Error:", error);
    return "Kechirasiz, tahlil jarayonida xatolik yuz berdi.";
  }
};

export const generateEcoSpeech = async (text: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Salom! Men EKO 27 AI yordamchisiman. Abdurazoqov Abbos tomonidan yaratilganman. Quyida sizning ekologik tahlilingiz natijasi: ${text.substring(0, 500)}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // Clear and professional voice
          },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
};
