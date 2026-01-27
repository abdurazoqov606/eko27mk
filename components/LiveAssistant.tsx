
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { Mic, X, Sparkles, Volume2, Loader2, PlayCircle, AlertCircle } from 'lucide-react';

// Audio Encoding/Decoding
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
  }
  return buffer;
}

const LiveAssistant: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [step, setStep] = useState<'ready' | 'connecting' | 'active'>('ready');
  const [error, setError] = useState<string | null>(null);
  const [aiTranscription, setAiTranscription] = useState('');
  
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sessionRef = useRef<any>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const stopSession = () => {
    try {
      if (sessionRef.current) sessionRef.current.then((s: any) => s.close());
      inputAudioContextRef.current?.close();
      outputAudioContextRef.current?.close();
      sourcesRef.current.forEach(s => { try { s.stop(); } catch(e){} });
    } catch (e) {}
    setStep('ready');
  };

  useEffect(() => {
    return () => stopSession();
  }, []);

  const startSession = async () => {
    setStep('connecting');
    setError(null);

    const API_KEY = process.env.API_KEY;
    if (!API_KEY) {
      setError("Tizimda API kalit topilmadi.");
      setStep('ready');
      return;
    }

    try {
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const ai = new GoogleGenAI({ apiKey: API_KEY });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setStep('active');
            const source = inputAudioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              const pcmBlob = { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
              setAiTranscription(prev => prev + message.serverContent!.outputTranscription!.text);
            }
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && outputAudioContextRef.current) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContextRef.current.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContextRef.current, 24000, 1);
              const source = outputAudioContextRef.current.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputAudioContextRef.current.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }
          },
          onerror: (e: any) => {
            console.error('AI Error:', e);
            setError("Ulanishda xatolik.");
            setStep('ready');
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          systemInstruction: 'Siz Abbos loyihasining ovozli yordamchisisiz. Qisqa va o\'zbekcha gapiring.'
        }
      });
      sessionRef.current = sessionPromise;
    } catch (err) {
      setError("Mikrofonga ruxsat berilmagan.");
      setStep('ready');
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl" onClick={onClose} />
      <div className="relative bg-white rounded-[48px] p-10 max-w-lg w-full text-center shadow-3xl animate-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-slate-300 hover:text-slate-900"><X /></button>
        
        <div className="mb-10">
          <div className={`w-32 h-32 rounded-full mx-auto flex items-center justify-center transition-all duration-500 ${step === 'active' ? 'bg-emerald-500 shadow-3xl animate-pulse' : 'bg-slate-100'}`}>
            {step === 'active' ? <Volume2 size={48} className="text-white" /> : <Sparkles size={48} className="text-emerald-500" />}
          </div>
        </div>

        <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter italic">Abbos AI Assistant</h3>
        <p className="text-slate-500 font-medium mb-10">Ovozli suhbatni boshlash uchun tugmani bosing.</p>

        {error && <div className="mb-6 p-4 bg-rose-50 text-rose-600 rounded-2xl font-bold flex items-center justify-center gap-2"><AlertCircle size={20} /> {error}</div>}

        {step === 'ready' ? (
          <button onClick={startSession} className="w-full py-6 bg-emerald-600 text-white rounded-3xl font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-4">
            <PlayCircle size={24} /> Boshlash
          </button>
        ) : step === 'connecting' ? (
          <div className="flex items-center justify-center gap-4 text-emerald-600 font-black">
            <Loader2 className="animate-spin" /> Ulanmoqda...
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-emerald-600 font-black animate-pulse italic">Sizni eshityapman...</p>
            {aiTranscription && <div className="p-4 bg-slate-50 rounded-2xl text-sm font-medium italic">{aiTranscription}</div>}
            <button onClick={stopSession} className="w-full py-4 bg-rose-50 text-rose-600 rounded-2xl font-black text-sm uppercase tracking-widest">To'xtatish</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveAssistant;
