# WellQR Playbook

## Overview

**WellQR** is a Calendar QR Generator — a simple web app that creates QR codes containing ICS calendar invites. When scanned, the QR code prompts the user's device to add the event to their calendar app.

**Live site:** https://wellqr.vercel.app (or your Vercel URL)  
**Repo:** https://github.com/mjmasone/WellQR

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| Vite | Build tool & dev server |
| Tailwind CSS | Styling |
| QR Server API | External API for QR code generation |

No backend — this is a fully static site.

---

## File Structure

```
WellQR/
├── src/
│   ├── App.jsx          # Main component (all app logic lives here)
│   ├── main.jsx         # React entry point
│   └── index.css        # Tailwind directives
├── public/
│   └── calendar.svg     # Favicon
├── index.html           # HTML shell
├── package.json         # Dependencies & scripts
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
├── postcss.config.js    # PostCSS (required by Tailwind)
├── .gitignore
└── README.md
```

---

## Local Development

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Deployment

Vercel auto-deploys on push to `main`. No configuration needed.

To deploy manually:
```bash
npm i -g vercel
vercel
```

---

## How It Works

1. User enters event details (title, date, time, duration, location, description)
2. App generates an ICS (iCalendar) formatted string
3. ICS content is URL-encoded and sent to QR Server API
4. API returns a QR code image containing the ICS data
5. When scanned, devices parse the ICS and prompt to add the event

### ICS Format Generated

```
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//ICS QR Generator//EN
METHOD:PUBLISH
BEGIN:VEVENT
UID:{timestamp}@icsqrgenerator
DTSTAMP:{now}
DTSTART:{startDateTime}
DTEND:{endDateTime}
SUMMARY:{title}
LOCATION:{location}
DESCRIPTION:{description}
END:VEVENT
END:VCALENDAR
```

---

## Key Functions in App.jsx

| Function | Purpose |
|----------|---------|
| `generateICS()` | Builds the ICS string from form state |
| `generateQR()` | Calls QR Server API with encoded ICS |
| `downloadICS()` | Creates and triggers .ics file download |
| `formatDateForICS()` | Converts date/time to ICS format (YYYYMMDDTHHMMSS) |
| `addMinutes()` | Calculates end time from start + duration |

---

## Common Modifications

### Change default duration
In `App.jsx`, modify the initial state:
```jsx
const [duration, setDuration] = useState(60);  // Change 60 to desired minutes
```

### Add more duration options
Find the `<select>` for duration and add options:
```jsx
<option value={360}>6 hours</option>
```

### Change QR code size
In `generateQR()`, modify the size parameter:
```jsx
const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedICS}`;
```

### Add timezone support
Currently uses local time. To add explicit timezone, modify ICS output:
```
DTSTART;TZID=America/New_York:{startDateTime}
```

### Change styling/colors
All styling uses Tailwind classes. Primary color is `indigo`. Search and replace:
- `indigo-600` → your color
- `indigo-900` → your darker shade
- `indigo-50` → your lighter shade

---

## External Dependencies

**QR Server API** (https://goqr.me/api/)
- Free, no API key required
- Rate limits: ~100 requests/minute (plenty for this use case)
- If this service goes down, alternatives:
  - `https://quickchart.io/qr`
  - Generate QR client-side with `qrcode` npm package

---

## Known Limitations

1. **QR scanning varies by device** — iPhones handle ICS QR codes natively; some Android devices download the .ics file first
2. **No timezone in ICS** — events use local time without explicit timezone
3. **QR size limits** — very long descriptions may exceed QR data capacity
4. **No persistence** — form data isn't saved; refreshing clears everything

---

## Future Enhancement Ideas

- [ ] Add timezone picker
- [ ] Save recent events to localStorage
- [ ] Generate QR client-side (remove external API dependency)
- [ ] Add recurring event support
- [ ] Custom QR colors/branding
- [ ] Bulk event generation from CSV
- [ ] Share QR directly (Web Share API)
- [ ] Add reminder/alert settings to ICS

---

## Troubleshooting

**QR code not generating**
- Check browser console for errors
- Verify QR Server API is accessible
- Try shorter event title/description

**Calendar not recognizing QR**
- Some camera apps don't parse ICS — try a dedicated QR scanner app
- Download the .ics file directly as fallback

**Styles not applying**
- Run `npm run dev` (Tailwind needs the dev server to process classes)
- Check that `index.css` has the Tailwind directives

---

## Contact

Project by Michael Masone  
GitHub: @mjmasone
