#!/bin/bash

# Script de déploiement pour osu.osef.me-frontend
# Déploie vers debian@51.38.149.239 dans ~/web

set -e  # Arrêter le script en cas d'erreur

echo "🚀 Début du déploiement..."

# Variables
REMOTE_USER="debian"
REMOTE_HOST="51.38.239.149"
REMOTE_DIR="~/web"
LOCAL_BUILD_DIR="dist"

# Demander le mot de passe SSH
echo -n "🔐 Entrez le mot de passe SSH pour $REMOTE_USER@$REMOTE_HOST: "
read -s SSH_PASSWORD
echo

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages colorés
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier que pnpm est installé
if ! command -v pnpm &> /dev/null; then
    print_error "pnpm n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier que sshpass est installé
if ! command -v sshpass &> /dev/null; then
    print_error "sshpass n'est pas installé. Veuillez l'installer avec: sudo apt install sshpass"
    exit 1
fi

# Nettoyer et installer les dépendances
print_status "Installation des dépendances..."
pnpm install

# Construire le projet
print_status "Construction du projet..."
pnpm run build

# Vérifier que le build a réussi
if [ ! -d "$LOCAL_BUILD_DIR" ]; then
    print_error "Le dossier de build '$LOCAL_BUILD_DIR' n'existe pas. La construction a échoué."
    exit 1
fi

# Créer une archive du build
ARCHIVE_NAME="osu-frontend-$(date +%Y%m%d-%H%M%S).tar.gz"
print_status "Création de l'archive: $ARCHIVE_NAME"
tar -czf "$ARCHIVE_NAME" -C "$LOCAL_BUILD_DIR" .

# Transférer l'archive vers le serveur
print_status "Transfert vers $REMOTE_USER@$REMOTE_HOST..."
sshpass -p "$SSH_PASSWORD" scp "$ARCHIVE_NAME" "$REMOTE_USER@$REMOTE_HOST:/tmp/"

# Déployer sur le serveur
print_status "Déploiement sur le serveur..."
sshpass -p "$SSH_PASSWORD" ssh "$REMOTE_USER@$REMOTE_HOST" << EOF
    set -e
    
    echo "📦 Extraction de l'archive..."
    cd ~
    
    # Créer le dossier web s'il n'existe pas
    mkdir -p web
    
    # Sauvegarder l'ancienne version si elle existe
    if [ -d "web/current" ]; then
        echo "💾 Sauvegarde de l'ancienne version..."
        mv web/current web/backup-\$(date +%Y%m%d-%H%M%S)
    fi
    
    # Créer le nouveau dossier
    mkdir -p web/current
    
    # Extraire la nouvelle version
    tar -xzf /tmp/$ARCHIVE_NAME -C web/current/
    
    # Nettoyer l'archive temporaire
    rm /tmp/$ARCHIVE_NAME
    
    # Créer un lien symbolique si nécessaire
    if [ ! -L "web/latest" ]; then
        ln -sf current web/latest
    else
        ln -sfn current web/latest
    fi
    
    echo "✅ Déploiement terminé avec succès!"
    echo "📁 Nouvelle version disponible dans: ~/web/current"
    echo "🔗 Lien symbolique: ~/web/latest"
EOF

# Nettoyer l'archive locale
rm "$ARCHIVE_NAME"

print_status "Déploiement terminé avec succès! 🎉"
print_status "Application déployée dans: $REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/current"
