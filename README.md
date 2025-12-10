# Blog Collaboratif Multi-Auteurs - Test Technique MEAN Stack

Plateforme complète avec :
- Backend Node.js + Express + MongoDB + Socket.io
- Frontend Angular 17+
- Authentification JWT + Refresh Token
- Rôles dynamiques : Admin / Éditeur Rédacteur Lecteur
- Commentaires en temps réel
- Permissions avancées

## Structure du projet
blog-mean-technique/
├── backend/          → API Node.js + Socket.io
├── frontend/         → Application Angular
└── README.md


## Installation rapide

```bash
# 1. Cloner le projet
git clone https://github.com/najemmar/mean-test-technique.git
cd mean-test-technique

# 2. Backend
cd backend
npm install
cp .env.example .env    # ← crée ton .env (voir ci-dessous)
npm start

# 3. Frontend (dans un autre terminal)
cd frontend
npm install
ng serve

Variables d’environnement (backend/.env)
MONGO_URI=mongodb://localhost:27017/test
JWT_SECRET=supersecretkey1234567890abcdef1234567890
JWT_REFRESH_SECRET=refreshsupersecret987654321zyxwvuts

URLs

Frontend : http://localhost:4200
Backend : http://localhost:3000
API : http://localhost:3000/api/...

Fonctionnalités implémentées

Inscription / Connexion / Refresh Token
Gestion des rôles (interface Admin)
CRUD Articles avec permissions fines
Commentaires imbriqués + notifications en temps réel (Socket.io)
Rate limiting + bcrypt + validation + CORS
Tests unitaires sur les permissions

Dernières commandes pour tout lancer

Terminal 1 (backend) :
```bash
cd backend
npm install
nodemon
Terminal 2 (frontend) :
cd frontend
npm install
ng serve
