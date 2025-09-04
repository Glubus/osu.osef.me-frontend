# ---------- Build stage ----------
    FROM node:20-alpine AS builder

    RUN npm install -g pnpm
    WORKDIR /app
    
    COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
    RUN pnpm fetch
    RUN pnpm install --offline --frozen-lockfile
    
    COPY . .
    RUN pnpm build
    
    # ---------- Production stage ----------
    FROM nginx:1.27-alpine AS production
    
    COPY nginx.conf /etc/nginx/nginx.conf
    COPY --from=builder --chown=nginx:nginx /app/dist /usr/share/nginx/html
    
    # Fix permissions for cache and logs only
    RUN mkdir -p /var/cache/nginx /var/log/nginx && \
        chown -R nginx:nginx /var/cache/nginx /var/log/nginx
    
    USER nginx
    
    EXPOSE 80
    CMD ["nginx", "-g", "daemon off;"]
    