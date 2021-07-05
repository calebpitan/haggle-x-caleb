# Build
FROM node:12-alpine AS development
WORKDIR /haggle/x/caleb
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

FROM node:12-alpine AS production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /haggle/x/caleb
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --production --frozen-lockfile
COPY --from=development /haggle/x/caleb/dist ./dist
EXPOSE 3000
CMD ["yarn", "start:prod"]