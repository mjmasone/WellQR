'use client';

import { useState, useEffect, useCallback } from 'react';
import QRCode from 'qrcode';

// ── Defaults ──

const defaultZones = { top: [], bottom: [], left: [], right: [] };
const defaultIndexes = { top: 0, bottom: 0, left: 0, right: 0 };

function pickNext(messages, currentIndex) {
  if (!messages || messages.length === 0) return { message: '', nextIndex: 0 };
  const idx = currentIndex % messages.length;
  return { message: messages[idx], nextIndex: idx + 1 };
}

// ══════════════════════════════════════════════════════

export default function Home() {
  // null = loading, then 'config' | 'form' | 'output'
  const [screen, setScreen] = useState(null);

  // Zone message pools (shared via API)
  const [zones, setZones] = useState(defaultZones);
  const [indexes, setIndexes] = useState(defaultIndexes);
  const [activeMessages, setActiveMessages] = useState({ top: '', bottom: '', left: '', right: '' });
  const [saving, setSaving] = useState(false);

  // Event fields
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('12:00');
  const [duration, setDuration] = useState(60);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [qrUrl, setQrUrl] = useState('');

  // Output screen: toolbar visibility for mirrored displays
  const [toolbarVisible, setToolbarVisible] = useState(true);
  const [toolbarTimer, setToolbarTimer] = useState(null);

  // Default date = today
  useEffect(() => {
    setEventDate(new Date().toISOString().split('T')[0]);
  }, []);

  // Load zones from API — auto-skip to form if messages exist
  useEffect(() => {
    fetch('/api/zones')
      .then(res => res.json())
      .then(data => {
        const z = data.zones || defaultZones;
        const idx = data.indexes || defaultIndexes;
        setZones(z);
        setIndexes(idx);

        // If ?config in URL, always show config screen
        const params = new URLSearchParams(window.location.search);
        if (params.has('config')) {
          setScreen('config');
          return;
        }

        // Otherwise, skip to form if messages exist
        const hasMessages = z.top.length || z.bottom.length || z.left.length || z.right.length;
        setScreen(hasMessages ? 'form' : 'config');
      })
      .catch(err => {
        console.error('Failed to load zones:', err);
        setScreen('config');
      });
  }, []);

  // Auto-hide toolbar on output screen after 5 seconds
  useEffect(() => {
    if (screen === 'output') {
      const timer = setTimeout(() => setToolbarVisible(false), 5000);
      setToolbarTimer(timer);
      return () => clearTimeout(timer);
    } else {
      setToolbarVisible(true);
      if (toolbarTimer) clearTimeout(toolbarTimer);
    }
  }, [screen]);

  // Tap anywhere on output screen to toggle toolbar
  const handleOutputTap = () => {
    if (screen !== 'output') return;
    setToolbarVisible(prev => {
      if (!prev) {
        // Auto-hide again after 5 seconds
        const timer = setTimeout(() => setToolbarVisible(false), 5000);
        setToolbarTimer(timer);
      }
      return !prev;
    });
  };

  // Save zones to API
  const saveZones = useCallback(async (newZones) => {
    setSaving(true);
    try {
      await fetch('/api/zones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zones: newZones }),
      });
    } catch (err) {
      console.error('Failed to save zones:', err);
    }
    setSaving(false);
  }, []);

  // Save indexes to API
  const saveIndexes = useCallback(async (newIndexes) => {
    try {
      await fetch('/api/zones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ indexes: newIndexes }),
      });
    } catch (err) {
      console.error('Failed to save indexes:', err);
    }
  }, []);

  // ── Zone management ──

  const addMessage = async (zone, text) => {
    if (!text.trim()) return;
    const updated = { ...zones, [zone]: [...zones[zone], text.trim()] };
    setZones(updated);
    await saveZones(updated);
  };

  const removeMessage = async (zone, index) => {
    const list = [...zones[zone]];
    list.splice(index, 1);
    const updated = { ...zones, [zone]: list };
    setZones(updated);
    await saveZones(updated);
  };

  const clearZone = async (zone) => {
    const updated = { ...zones, [zone]: [] };
    const updatedIndexes = { ...indexes, [zone]: 0 };
    setZones(updated);
    setIndexes(updatedIndexes);
    await saveZones(updated);
    await saveIndexes(updatedIndexes);
  };

  // ── ICS helpers ──

  const formatDateForICS = (dateStr, timeStr) => {
    const [year, month, day] = dateStr.split('-');
    const [hours, minutes] = timeStr.split(':');
    return `${year}${month}${day}T${hours}${minutes}00`;
  };

  const addMinutes = (dateStr, timeStr, mins) => {
    const date = new Date(`${dateStr}T${timeStr}:00`);
    date.setMinutes(date.getMinutes() + parseInt(mins));
    const y = date.getFullYear();
    const mo = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const h = String(date.getHours()).padStart(2, '0');
    const mi = String(date.getMinutes()).padStart(2, '0');
    return `${y}${mo}${d}T${h}${mi}00`;
  };

  const generateICS = () => {
    if (!eventDate || !eventTime || !eventTitle) return '';
    const dtStart = formatDateForICS(eventDate, eventTime);
    const dtEnd = addMinutes(eventDate, eventTime, duration);
    const uid = `${Date.now()}@icsqrgenerator`;
    const dtstamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    let ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//ICS QR Generator//EN', 'METHOD:PUBLISH',
      'BEGIN:VEVENT', `UID:${uid}`, `DTSTAMP:${dtstamp}`, `DTSTART:${dtStart}`, `DTEND:${dtEnd}`,
      `SUMMARY:${eventTitle}`,
    ];
    if (location) ics.push(`LOCATION:${location}`);
    if (description) ics.push(`DESCRIPTION:${description.replace(/\n/g, '\\n')}`);
    ics.push('END:VEVENT', 'END:VCALENDAR');
    return ics.join('\r\n');
  };

  // ── Actions ──

  const handleGenerate = async () => {
    const ics = generateICS();
    if (!ics) return;

    // Generate QR code client-side — no data leaves the device
    try {
      const dataUrl = await QRCode.toDataURL(ics, {
        width: 300,
        margin: 2,
        errorCorrectionLevel: 'M',
      });
      setQrUrl(dataUrl);
    } catch (err) {
      console.error('QR generation failed:', err);
      return;
    }

    // Advance round-robin and save
    const newIndexes = { ...indexes };
    const newActive = {};
    for (const zone of ['top', 'bottom', 'left', 'right']) {
      const { message, nextIndex } = pickNext(zones[zone], newIndexes[zone]);
      newActive[zone] = message;
      newIndexes[zone] = nextIndex;
    }
    setActiveMessages(newActive);
    setIndexes(newIndexes);
    await saveIndexes(newIndexes);
    setScreen('output');
  };

  const downloadICS = () => {
    const ics = generateICS();
    if (!ics) return;
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${eventTitle.replace(/[^a-z0-9]/gi, '_')}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadQR = () => {
    if (!qrUrl) return;
    const a = document.createElement('a');
    a.href = qrUrl;
    a.download = `${eventTitle.replace(/[^a-z0-9]/gi, '_')}_qr.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatDisplayDate = () => {
    if (!eventDate) return '';
    const date = new Date(`${eventDate}T${eventTime}:00`);
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatDisplayTime = () => {
    if (!eventTime) return '';
    const [hours, minutes] = eventTime.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const totalMessages = zones.top.length + zones.bottom.length + zones.left.length + zones.right.length;

  // ── Loading ──
  if (screen === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // ════════════════════════════════════════════════════
  // SCREEN 1: MESSAGE POOL CONFIG
  // ════════════════════════════════════════════════════
  if (screen === 'config') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-indigo-900 mb-2">Calendar QR Generator</h1>
            <p className="text-gray-600">Set up messages that rotate around the QR code</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 max-w-xs mx-auto">
                <div className="text-xs font-medium text-indigo-600 bg-indigo-50 rounded px-2 py-1 mb-2 text-center">TOP</div>
                <div className="flex items-center gap-2 my-2">
                  <div className="flex-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded px-2 py-3 text-center">LEFT</div>
                  <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-xs text-gray-500">QR</span>
                  </div>
                  <div className="flex-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded px-2 py-3 text-center">RIGHT</div>
                </div>
                <div className="text-xs font-medium text-indigo-600 bg-indigo-50 rounded px-2 py-1 mt-2 text-center">BOTTOM</div>
              </div>
              <p className="text-xs text-gray-400 mt-3 text-center">
                Add multiple messages per zone. Each QR generation shows the next message in rotation.
              </p>
            </div>

            <div className="space-y-6">
              <ZoneEditor label="Top Zone — Header / Practice Name" zone="top" messages={zones.top} onAdd={addMessage} onRemove={removeMessage} onClear={clearZone} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <ZoneEditor label="Left Zone" zone="left" messages={zones.left} onAdd={addMessage} onRemove={removeMessage} onClear={clearZone} />
                <ZoneEditor label="Right Zone" zone="right" messages={zones.right} onAdd={addMessage} onRemove={removeMessage} onClear={clearZone} />
              </div>
              <ZoneEditor label="Bottom Zone — Footer / Contact" zone="bottom" messages={zones.bottom} onAdd={addMessage} onRemove={removeMessage} onClear={clearZone} />

              <button
                onClick={() => setScreen('form')}
                disabled={saving}
                className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 transition shadow-md"
              >
                {saving ? 'Saving...' : totalMessages > 0 ? `Continue (${totalMessages} message${totalMessages !== 1 ? 's' : ''})` : 'Skip — Continue Without Messages'}
              </button>
            </div>
          </div>

          <p className="text-center text-gray-400 text-xs">
            Messages are shared across all devices and locations.
          </p>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════
  // SCREEN 2: APPOINTMENT ENTRY
  // ════════════════════════════════════════════════════
  if (screen === 'form') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-indigo-900 mb-2">Calendar QR Generator</h1>
            <p className="text-gray-600">Enter appointment details</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Title *</label>
                <input type="text" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  placeholder="Enter event title" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                  <input type="time" value={eventTime} onChange={(e) => setEventTime(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <select value={duration} onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition">
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 hours</option>
                  <option value={120}>2 hours</option>
                  <option value={180}>3 hours</option>
                  <option value={240}>4 hours</option>
                  <option value={480}>8 hours</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location (optional)</label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  placeholder="Enter location or leave blank to add later" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none"
                  placeholder="Add event details" />
              </div>

              <button onClick={handleGenerate} disabled={!eventTitle || !eventDate || !eventTime}
                className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition shadow-md">
                Generate QR Code
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between px-2">
            <button onClick={() => setScreen('config')}
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-700 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Edit Messages
              {totalMessages > 0 && <span className="text-xs text-gray-400">({totalMessages})</span>}
            </button>
            <p className="text-gray-400 text-xs">QR behavior varies by device</p>
          </div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════
  // SCREEN 3: QR OUTPUT — patient-facing, responsive
  // Toolbar auto-hides after 5s, tap anywhere to toggle
  // ════════════════════════════════════════════════════
  const hasLeftOrRight = activeMessages.left || activeMessages.right;

  return (
    <div className="min-h-screen bg-white flex flex-col" onClick={handleOutputTap}>

      {/* Staff toolbar — auto-hides, tap to show */}
      <div className={`bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center justify-between flex-shrink-0 transition-all duration-300 ${toolbarVisible ? 'opacity-100 max-h-16' : 'opacity-0 max-h-0 overflow-hidden border-b-0'}`}>
        <button onClick={(e) => { e.stopPropagation(); setScreen('form'); setQrUrl(''); }}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-700 transition">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          New Appointment
        </button>
        <div className="flex items-center gap-2">
          <button onClick={(e) => { e.stopPropagation(); downloadICS(); }} className="px-3 py-1 text-xs text-gray-500 hover:bg-gray-200 rounded transition">.ics</button>
          <button onClick={(e) => { e.stopPropagation(); downloadQR(); }}
            className="px-3 py-1 text-xs text-gray-500 hover:bg-gray-200 rounded transition">Save QR</button>
        </div>
      </div>

      {/* Patient-facing content — fills screen */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 py-6 sm:py-8 md:py-12 overflow-auto">

        {activeMessages.top && (
          <div className="w-full max-w-3xl text-center mb-6 sm:mb-8">
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 whitespace-pre-line">{activeMessages.top}</p>
          </div>
        )}

        <div className="w-full max-w-3xl">
          {hasLeftOrRight ? (
            <>
              {/* Desktop: 3-column */}
              <div className="hidden md:flex items-center gap-6 lg:gap-10">
                {activeMessages.left ? (
                  <div className="flex-1 text-sm md:text-base text-gray-700 leading-relaxed whitespace-pre-line border-l-4 border-indigo-400 pl-4">
                    {activeMessages.left}
                  </div>
                ) : <div className="flex-1" />}
                <QRCenter qrUrl={qrUrl} eventTitle={eventTitle} displayDate={formatDisplayDate()} displayTime={formatDisplayTime()} duration={duration} location={location} description={description} />
                {activeMessages.right ? (
                  <div className="flex-1 text-sm md:text-base text-gray-700 leading-relaxed whitespace-pre-line border-r-4 border-indigo-400 pr-4 text-right">
                    {activeMessages.right}
                  </div>
                ) : <div className="flex-1" />}
              </div>

              {/* Mobile: stacked */}
              <div className="md:hidden flex flex-col items-center gap-5">
                {activeMessages.left && (
                  <div className="w-full text-sm text-gray-700 leading-relaxed whitespace-pre-line border-l-4 border-indigo-400 pl-4">
                    {activeMessages.left}
                  </div>
                )}
                <QRCenter qrUrl={qrUrl} eventTitle={eventTitle} displayDate={formatDisplayDate()} displayTime={formatDisplayTime()} duration={duration} location={location} description={description} />
                {activeMessages.right && (
                  <div className="w-full text-sm text-gray-700 leading-relaxed whitespace-pre-line border-l-4 border-indigo-400 pl-4">
                    {activeMessages.right}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex justify-center">
              <QRCenter qrUrl={qrUrl} eventTitle={eventTitle} displayDate={formatDisplayDate()} displayTime={formatDisplayTime()} duration={duration} location={location} description={description} />
            </div>
          )}
        </div>

        {activeMessages.bottom && (
          <div className="w-full max-w-3xl text-center mt-6 sm:mt-8 pt-4 border-t-2 border-gray-200">
            <p className="text-sm sm:text-base text-gray-600 whitespace-pre-line">{activeMessages.bottom}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════
// QR center block
// ══════════════════════════════════════════════════════
function QRCenter({ qrUrl, eventTitle, displayDate, displayTime, duration, location, description }) {
  return (
    <div className="flex-shrink-0 text-center">
      <img src={qrUrl} alt="Calendar QR Code" className="mx-auto mb-4 w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64" />
      <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{eventTitle}</p>
      <p className="text-gray-700 sm:text-lg mt-1">{displayDate}</p>
      <p className="text-gray-700 sm:text-lg">{displayTime} — {duration} min</p>
      {location && <p className="text-gray-600 text-sm sm:text-base mt-1">📍 {location}</p>}
      {description && <p className="text-gray-500 text-sm mt-2 italic">{description}</p>}
      <p className="text-xs sm:text-sm text-gray-400 mt-4">Scan with your phone's camera to add to calendar</p>
    </div>
  );
}

// ══════════════════════════════════════════════════════
// Zone editor
// ══════════════════════════════════════════════════════
function ZoneEditor({ label, zone, messages, onAdd, onRemove, onClear }) {
  const [draft, setDraft] = useState('');

  const handleAdd = () => {
    onAdd(zone, draft);
    setDraft('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && draft.trim()) {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {messages.length > 0 && (
          <span className="text-xs text-gray-400">{messages.length} message{messages.length !== 1 ? 's' : ''}</span>
        )}
      </div>

      {messages.length > 0 && (
        <div className="mb-2 space-y-1.5">
          {messages.map((msg, i) => (
            <div key={i} className="flex items-start gap-2 bg-gray-50 rounded-lg px-3 py-2 group">
              <span className="text-xs text-gray-400 mt-0.5 flex-shrink-0">{i + 1}.</span>
              <span className="text-sm text-gray-700 flex-1 whitespace-pre-line">{msg}</span>
              <button onClick={() => onRemove(zone, i)}
                className="text-gray-300 hover:text-red-500 transition flex-shrink-0 opacity-0 group-hover:opacity-100" title="Remove">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input type="text" value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={handleKeyDown}
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          placeholder="Type a message and press Enter" />
        <button onClick={handleAdd} disabled={!draft.trim()}
          className="px-3 py-2 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-lg hover:bg-indigo-200 disabled:opacity-30 disabled:cursor-not-allowed transition">
          Add
        </button>
      </div>

      {messages.length > 1 && (
        <button onClick={() => onClear(zone)} className="text-xs text-red-400 hover:text-red-600 transition mt-1.5">
          Clear all
        </button>
      )}
    </div>
  );
}
