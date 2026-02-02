# Déploiement Dokploy - MapleNou Laravel Application

## Configuration requise

- Docker et Docker Compose installés
- Accès à une instance Dokploy
- Base de données MySQL
- Redis (optionnel, pour le cache)

## Étapes de déploiement

### 1. Préparation du projet

Assurez-vous que tous les fichiers sont prêts :
- `Dockerfile` à la racine
- Dossier `docker/` avec les configurations
- `.dockerignore` configuré

### 2. Configuration des variables d'environnement

Dans Dokploy, configurez les variables d'environnement suivantes :

```bash
APP_ENV=production
APP_DEBUG=false
APP_URL=https://votre-domaine.com
APP_KEY=base64:votre-cle-app

DB_CONNECTION=mysql
DB_HOST=votre-host-mysql
DB_PORT=3306
DB_DATABASE=maplenou
DB_USERNAME=votre-user-mysql
DB_PASSWORD=votre-password-mysql

CACHE_DRIVER=redis
REDIS_HOST=votre-host-redis
REDIS_PORT=6379
REDIS_PASSWORD=votre-password-redis

LOG_CHANNEL=stack
MAIL_MAILER=smtp
MAIL_HOST=votre-host-smtp
MAIL_PORT=587
MAIL_USERNAME=votre-email-smtp
MAIL_PASSWORD=votre-password-smtp
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@votre-domaine.com
MAIL_FROM_NAME="${APP_NAME}"
```

### 3. Configuration Dokploy

1. **Créer une nouvelle application**
   - Type : Docker
   - Nom : maplenou-app

2. **Configuration du build**
   - Contexte : `/`
   - Dockerfile : `Dockerfile`
   - Port exposé : `80`

3. **Volumes à monter (optionnel)**
   - `/var/www/html/storage` : pour persister les fichiers
   - `/var/www/html/public/uploads` : pour les uploads

4. **Variables d'environnement**
   - Ajoutez toutes les variables de l'étape 2

### 4. Commandes à exécuter après déploiement

Une fois l'application déployée, exécutez ces commandes dans le terminal Dokploy :

```bash
# Générer la clé de l'application (si non configurée)
php artisan key:generate

# Optimiser l'application
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Lancer les migrations
php artisan migrate --force

# Optimiser Composer
composer dump-autoload --optimize

# Nettoyer le cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

### 5. Vérification du déploiement

1. **Vérifiez que l'application répond** sur l'URL configurée
2. **Testez la connexion à la base de données**
3. **Vérifiez les logs** dans Dokploy
4. **Testez l'upload de fichiers** si applicable

## Déploiement local (pour test)

```bash
# Clonez le projet
git clone <repository-url>
cd maplenou

# Lancez avec Docker Compose
docker-compose up -d

# Accédez à l'application
http://localhost:8000

# Accès à phpMyAdmin
http://localhost:8080
```

## Dépannage

### Problèmes courants

1. **Erreur 500 - Internal Server Error**
   - Vérifiez les logs dans Dokploy
   - Assurez-vous que toutes les variables d'environnement sont configurées
   - Vérifiez les permissions des dossiers storage et bootstrap/cache

2. **Erreur de connexion à la base de données**
   - Vérifiez les identifiants MySQL
   - Assurez-vous que la base de données existe
   - Vérifiez que le port MySQL est accessible

3. **Assets non chargés**
   - Exécutez `npm run production` dans le conteneur
   - Vérifiez que les fichiers sont présents dans `/public/js` et `/public/css`

### Logs utiles

```bash
# Logs de l'application
docker logs maplenou_app

# Logs Nginx
docker exec maplenou_app tail -f /var/log/nginx/error.log

# Logs PHP
docker exec maplenou_app tail -f /var/log/php_errors.log
```

## Maintenance

Pour mettre à jour l'application :

1. Poussez les modifications sur Git
2. Déclenchez un nouveau déploiement dans Dokploy
3. Exécutez les commandes d'optimisation si nécessaire

## Sécurité

- Changez les mots de passe par défaut
- Utilisez des variables d'environnement pour les données sensibles
- Activez HTTPS avec un certificat SSL
- Configurez un firewall si nécessaire
