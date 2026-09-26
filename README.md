# RAJA X DEVELOPER — Call Bomber (HTML)

Pure HTML + Express backend. API fully hidden server-side.

## Local Run

```bash
npm install
npm start
```

Open http://localhost:3000

## Deploy on Vercel

1. Push folder to GitHub
2. Import on vercel.com
3. Framework Preset: Other
4. Build Command: leave empty
5. Output Directory: leave empty
6. Install Command: `npm install`
7. Start Command: `node server.js`

Or use Railway / Render / any Node host.

## Structure

```
raja-x-callbomber-html/
├── public/
│   ├── index.html    ← Frontend
│   ├── style.css     ← Premium UI
│   └── app.js        ← Frontend logic
├── server.js         ← Backend (API hidden here)
├── package.json
└── README.md
```

API URL never reaches browser. Only `/api/bomb` is called.

Built by RAJA X DEVELOPER
