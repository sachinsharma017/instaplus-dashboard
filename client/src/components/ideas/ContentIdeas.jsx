import React, { useState, useEffect } from 'react';
import {
  Lightbulb, Film, Layers, Hash, MessageSquare,
  Calendar, Copy, Check, Key, Sparkles, Loader2,
  AlertCircle, Eye, EyeOff, ExternalLink
} from 'lucide-react';

function copyText(text, id, setCopied) {
  navigator.clipboard.writeText(text);
  setCopied(id);
  setTimeout(() => setCopied(null), 2000);
}

export default function ContentIdeas() {
  const [niche, setNiche] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ideas, setIdeas] = useState(null);
  const [copied, setCopied] = useState(null);

  // Load saved API key from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('groq_api_key');
    if (saved) setApiKey(saved);
  }, []);

  const saveKey = (val) => {
    setApiKey(val);
    localStorage.setItem('groq_api_key', val);
  };

  const generate = async () => {
    if (!niche.trim()) { setError('Apna niche/topic likho (e.g. Fashion, Food, Fitness).'); return; }
    if (!apiKey.trim()) { setError('Groq API key daalo pehle.'); return; }
    setError('');
    setLoading(true);
    setIdeas(null);
    try {
      const res = await fetch('http://localhost:5000/api/generate-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche: niche.trim(), apiKey: apiKey.trim() })
      });
      const data = await res.json();
      if (!res.ok || data.error) { setError(data.error || 'Error aa gaya. Dobara try karo.'); setLoading(false); return; }
      setIdeas(data.data);
    } catch (e) {
      setError('Server se connect nahi ho pa raha. Backend chal raha hai?');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">

      {/* Input Panel */}
      <div className="p-5 rounded-2xl border border-slate-700/60 bg-slate-900/80 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-extrabold text-base text-white">AI Content Ideas Generator</h2>
            <p className="text-xs text-slate-400">Apna niche daalo → Groq AI se real ideas milenge</p>
          </div>
          <a
            href="https://console.groq.com/keys"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 border border-sky-500/30 bg-sky-500/10 rounded-xl px-3 py-1.5 transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Free API Key Lao
          </a>
        </div>

        {/* Groq API Key Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-amber-400" />
            Groq API Key
            <span className="text-[10px] text-emerald-400 font-mono">(Free — console.groq.com)</span>
          </label>
          <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={e => saveKey(e.target.value)}
              placeholder="gsk_xxxxxxxxxxxxxxxxxxxxxxxx"
              className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-600 outline-none font-mono"
            />
            <button onClick={() => setShowKey(!showKey)} className="text-slate-500 hover:text-white transition">
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[11px] text-slate-600">Key localStorage me save hogi — page reload pe bhi rahegi.</p>
        </div>

        {/* Niche Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            Apna Niche / Topic
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={niche}
              onChange={e => { setNiche(e.target.value); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && generate()}
              placeholder="e.g. Fashion, Food, Fitness, Travel, Finance, Tech..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none focus:border-pink-500/50 transition"
            />
            <button
              onClick={generate}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-bold shadow-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {loading ? 'Generating...' : 'Generate Ideas'}
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1,2,3,4].map(i => (
            <div key={i} className="rounded-2xl border border-slate-700/60 bg-slate-900/80 p-5 space-y-3 animate-pulse">
              <div className="h-4 bg-slate-800 rounded-lg w-1/2" />
              <div className="h-3 bg-slate-800 rounded w-full" />
              <div className="h-3 bg-slate-800 rounded w-3/4" />
              <div className="h-3 bg-slate-800 rounded w-2/3" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !ideas && !error && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-pink-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">AI Ideas Generate Nahi Hue Abhi</h3>
            <p className="text-sm text-slate-400 mt-1">Upar Groq API key aur apna niche daalo, phir Generate dabao.</p>
          </div>
        </div>
      )}

      {/* Generated Content */}
      {ideas && !loading && (
        <>
          {/* Reel & Carousel Ideas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Reel Ideas */}
            {Array.isArray(ideas.reelIdeas) && (
              <div className="rounded-2xl border border-slate-700/60 bg-slate-900/80 p-5 shadow-xl space-y-3">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Film className="w-4 h-4 text-pink-400" />
                  High-Converting Reel Concepts
                </h3>
                <div className="space-y-3">
                  {ideas.reelIdeas.map((reel, idx) => (
                    <div key={idx} className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
                      <div className="flex justify-between items-start mb-1 gap-2">
                        <h4 className="font-semibold text-xs text-slate-100">{reel.title}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 font-mono shrink-0">{reel.virality}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mb-2">Hook: "{reel.hook}"</p>
                      <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between pt-2 border-t border-slate-700/40">
                        <span>Format: {reel.format}</span>
                        <button onClick={() => copyText(reel.title, `reel_${idx}`, setCopied)} className="text-pink-400 hover:text-pink-300 flex items-center gap-1">
                          {copied === `reel_${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copied === `reel_${idx}` ? 'Copied!' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Carousel Ideas */}
            {Array.isArray(ideas.carouselIdeas) && (
              <div className="rounded-2xl border border-slate-700/60 bg-slate-900/80 p-5 shadow-xl space-y-3">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  Educational Carousel Frameworks
                </h3>
                <div className="space-y-3">
                  {ideas.carouselIdeas.map((car, idx) => (
                    <div key={idx} className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
                      <div className="flex justify-between items-start mb-1 gap-2">
                        <h4 className="font-semibold text-xs text-slate-100">{car.title}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono shrink-0">{car.slides} Slides</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between pt-2 border-t border-slate-700/40 mt-2">
                        <span>Value: {car.value}</span>
                        <button onClick={() => copyText(car.title, `car_${idx}`, setCopied)} className="text-amber-400 hover:text-amber-300 flex items-center gap-1">
                          {copied === `car_${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copied === `car_${idx}` ? 'Copied!' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Hashtags & CTAs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Hashtags */}
            {Array.isArray(ideas.hashtags) && (
              <div className="rounded-2xl border border-slate-700/60 bg-slate-900/80 p-5 shadow-xl">
                <h3 className="font-bold text-sm text-white mb-3 flex items-center gap-2">
                  <Hash className="w-4 h-4 text-sky-400" />
                  High-Performing Hashtags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {ideas.hashtags.map((h, idx) => (
                    <button
                      key={idx}
                      onClick={() => copyText(h.tag, `hash_${idx}`, setCopied)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 hover:border-pink-500/50 text-xs font-mono text-slate-200 hover:text-pink-400 transition flex items-center gap-2"
                    >
                      <span>{h.tag}</span>
                      <span className="text-[10px] text-slate-500">({h.volume})</span>
                      {copied === `hash_${idx}` && <Check className="w-3 h-3 text-emerald-400" />}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => copyText(ideas.hashtags.map(h => h.tag).join(' '), 'all_hash', setCopied)}
                  className="mt-3 w-full py-2 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold hover:bg-sky-500/20 transition flex items-center justify-center gap-2"
                >
                  {copied === 'all_hash' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied === 'all_hash' ? 'Copied!' : 'Copy All Hashtags'}
                </button>
              </div>
            )}

            {/* CTAs */}
            {Array.isArray(ideas.ctas) && (
              <div className="rounded-2xl border border-slate-700/60 bg-slate-900/80 p-5 shadow-xl">
                <h3 className="font-bold text-sm text-white mb-3 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  High-Converting Caption CTAs
                </h3>
                <div className="space-y-2">
                  {ideas.ctas.map((cta, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-200 flex items-center justify-between gap-2">
                      <span>"{cta}"</span>
                      <button onClick={() => copyText(cta, `cta_${idx}`, setCopied)} className="text-emerald-400 hover:text-emerald-300 p-1 shrink-0">
                        {copied === `cta_${idx}` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 7-Day Calendar */}
          {Array.isArray(ideas.calendar) && (
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/80 p-5 shadow-xl">
              <h3 className="font-bold text-sm text-white mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-pink-400" />
                AI-Generated 7-Day Content Calendar
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
                {ideas.calendar.map((item, idx) => (
                  <div key={idx} className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/60 hover:border-pink-500/40 transition">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-extrabold text-xs text-pink-400 uppercase font-mono">{item.day}</span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">{item.type}</span>
                    </div>
                    <p className="text-[11px] font-medium text-slate-200 line-clamp-2 my-1.5">{item.title}</p>
                    <div className="text-[10px] font-mono text-emerald-400 pt-1 border-t border-slate-700/50">⏰ {item.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Regenerate Button */}
          <div className="flex justify-center">
            <button
              onClick={generate}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-700 bg-slate-800/80 text-slate-300 text-sm font-bold hover:border-pink-500/40 hover:text-pink-400 transition"
            >
              <Sparkles className="w-4 h-4" />
              Dobara Generate Karo (New Ideas)
            </button>
          </div>
        </>
      )}
    </div>
  );
}
