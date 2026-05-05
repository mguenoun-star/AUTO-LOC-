🏎️ AUTO-LOC
Application web de location de véhicules premium construite avec Next.js, Supabase (PostgreSQL, Auth) et Cloudinary.

🚀 Getting Started
Bash
npm install
npm run dev
Ouvrir http://localhost:3000.

🏗️ Architecture & Stack
1. Gestion des Données
L'architecture sépare les données selon leur nature pour optimiser les coûts et les performances :

Données Structurées (Supabase / PostgreSQL) :

profiles : Comptes (nom, email, rôle admin/host/user).

vehicles : Catalogue (nom, prix, transmission, etc.). Inclut une colonne pictures de type TEXT[] et une colonne fts pour la recherche.

bookings : Relations clients/véhicules et états des réservations.

Données Non-Structurées (Cloudinary) :

Hébergement des photos de véhicules et avatars.

Utilisation de l'API Cloudinary pour le redimensionnement dynamique (optimisation du poids des images côté client).

2. Analyse Stratégique (CAPEX vs OPEX)
Le choix du Serverless (Vercel + Supabase) permet de transformer un investissement initial lourd (CAPEX - serveurs physiques, maintenance, clim) en coûts opérationnels variables (OPEX).

Scalabilité : L'infrastructure s'adapte automatiquement au trafic sans gestion manuelle de serveurs.

Performance : Utilisation de l'indexation GIN sur PostgreSQL pour des recherches instantanées et du CDN de Cloudinary pour une livraison d'image ultra-rapide.

🛠️ Configuration Technique Spécifique
Schéma de Recherche & Médias
Nous utilisons le Full Text Search (FTS) de Postgres pour permettre aux utilisateurs de trouver des véhicules par mots-clés (ex: "BMW sport noir").

SQL
-- Ajout de la colonne pictures (Array de strings pour IDs Cloudinary)
ALTER TABLE public.vehicles 
ADD COLUMN pictures TEXT[] NOT NULL DEFAULT '{}';

-- Configuration de la recherche textuelle performante
ALTER TABLE public.vehicles
ADD COLUMN fts tsvector GENERATED ALWAYS AS (
  to_tsvector('french', name || ' ' || type)
) STORED;

CREATE INDEX vehicles_fts_idx ON public.vehicles USING GIN (fts);
Variables d'Environnement (.env)
Bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
👥 Rôles & Permissions
User : Consulte et loue des véhicules.

Host : Propose ses véhicules et gère ses annonces.

Admin : Modère les annonces (approbation) et gère la flotte globale.