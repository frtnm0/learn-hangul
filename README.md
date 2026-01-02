# Hangul Practice

Simple React/Vite app to practice Hangul vowels and consonants.

Getting started

```bash
cd /home/ppak/Desktop/hangul
npm install
# Start dev server and allow LAN access
npm run dev
```

Open on this machine: http://localhost:5173

Open from another device on the same network:

1. Find your machine IP (Linux/macOS):

```bash
ip addr show | grep -A2 'inet ' | grep -v '127.0.0.1'
# or
hostname -I
```

2. From the other device open: `http://<your-ip>:5173` (replace `<your-ip>` with the address above).

Notes:
- The dev script uses `vite --host` so it listens on the LAN. For a production preview use `npm run preview` which also binds the host.
- If other devices cannot reach the server, check OS firewall settings and ensure port 5173 is allowed.

Features

- Choose Vowels or Consonants
- 20 randomized questions
- Multiple choice (3 options)
- Score at end with redo or back to menu
