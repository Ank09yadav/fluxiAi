# #!/bin/bash
# # Move to the app directory
# cd /opt/app || exit 1

# echo "Starting Next.js on port 3000..."
# # Bind to 0.0.0.0 is critical for E2B access
# exec npm run dev -- -p 3000 -H 0.0.0.0
#!/bin/bash

# Move to the home directory where the agent writes code
cd /home/user || exit 1

# If there is no package.json here, maybe copy it from /opt/app (from the build)
if [ ! -f "package.json" ]; then
    echo "Initializing project from template..."
    cp -r /opt/app/. /home/user/
fi

echo "Starting Next.js server on 0.0.0.0:3000..."
# Bind to 0.0.0.0 is critical for E2B access
exec npm run dev -- -p 3000 -H 0.0.0.0