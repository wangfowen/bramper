# Setup

```
  bundle
  yarn inst
  rake db:create
  rake db:migrate
```

# Run

```
  yarn build
  yarn deploy
  rake start

```

Then visit http://localhost:3001/
If you don't need to access pages from the backend, you can visit 
http://localhost:3000/ for live-updated pages that don't require build/deploy

# Deployment

```
  git push heroku master

```

# Test

```
   yarn test
   rake test

```
