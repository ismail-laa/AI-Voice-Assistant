/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import Vapi from "@vapi-ai/web";
import { Mic, MicOff, Loader2 } from "lucide-react";

const PUBLIC_KEY = "a9e25b9d-0684-4d8e-945d-8c18b2d9cdde";
const ASSISTANT_ID = "7382ad90-0ecc-4bc6-bcd9-422405992f78";

// Initialize Vapi instance outside the component so it's not recreated on every render
const vapi = new Vapi(PUBLIC_KEY);

export default function App() {
  const [callStatus, setCallStatus] = useState<"inactive" | "loading" | "active">("inactive");

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus("active");
    };

    const onCallEnd = () => {
      setCallStatus("inactive");
    };

    const onError = (e: any) => {
      console.error("Vapi Error:", e);
      setCallStatus("inactive");
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("error", onError);
    };
  }, []);

  const toggleCall = async () => {
    if (callStatus === "active") {
      setCallStatus("loading");
      vapi.stop();
    } else if (callStatus === "inactive") {
      setCallStatus("loading");
      try {
        await vapi.start(ASSISTANT_ID);
      } catch (error) {
        console.error("Failed to start call:", error);
        setCallStatus("inactive");
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-900 rounded-3xl p-8 shadow-2xl border border-zinc-800 flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-zinc-800 rounded-full flex items-center justify-center mb-6 relative">
          {callStatus === "active" && (
            <div className="absolute inset-0 rounded-full animate-ping bg-emerald-500/20" />
          )}
          <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-300 z-10 ${callStatus === "active" ? "bg-emerald-500 text-zinc-950" : "bg-zinc-700 text-zinc-400"}`}>
            {callStatus === "loading" ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : callStatus === "active" ? (
              <Mic className="w-8 h-8" />
            ) : (
              <MicOff className="w-8 h-8" />
            )}
          </div>
        </div>
        
        <h1 className="text-2xl font-semibold text-zinc-100 mb-2">
          AI Assistant
        </h1>
        <p className="text-zinc-400 mb-8">
          {callStatus === "active" 
            ? "Listening... Speak now." 
            : callStatus === "loading"
            ? "Connecting..."
            : "Tap the button below to start talking."}
        </p>

        <button
          onClick={toggleCall}
          disabled={callStatus === "loading"}
          className={`w-full py-4 rounded-2xl font-medium text-lg transition-all duration-200 flex items-center justify-center gap-2 ${
            callStatus === "active"
              ? "bg-red-500 hover:bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]"
              : callStatus === "loading"
              ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
              : "bg-emerald-500 hover:bg-emerald-600 text-zinc-950 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          }`}
        >
          {callStatus === "active" ? (
            "End Call"
          ) : callStatus === "loading" ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Connecting...
            </>
          ) : (
            "Start Call"
          )}
        </button>
      </div>
    </div>
  );
}
