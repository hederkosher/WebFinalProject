# n8n Automation – Approach 1: Schedule + MongoDB (No App Changes)

This guide sets up n8n to send an email to users when they save a route. **No changes are required in your Express or Next.js code.** n8n runs on a schedule, reads from your MongoDB, and sends the email.

---

## What You’ll Build

1. **n8n** runs every X minutes (e.g. 10).
2. It reads **new routes** from MongoDB (e.g. created in the last 15 minutes).
3. For each route it gets the **user’s email** from the `users` collection.
4. It **sends an email** with the route summary (destination, days, daily segments).

**MongoDB structure (your project):**

- **Host:** `localhost:27017`
- **Database:** `test`
- **Collection `routes`:** `_id` (ObjectId), `userId` (string, e.g. `"69a1eb0ebbb7d2467ee2f488"`), `destination`, `tripType`, `durationDays`, `dailyRoutes` (array), `imageUrl`, `createdAt`, `__v`
- **Collection `users`:** `_id` (ObjectId), `email`, `password`, `fullName`, `partnerName`, `refreshToken`, `createdAt`, `__v`

**Example route document (collection `routes`):**
- `_id`, `userId` (string), `destination`, `tripType`, `durationDays`, `dailyRoutes` (array of `day`, `startLocation`, `endLocation`, `distance_km`, …), `imageUrl`, `createdAt`, `__v`

**Example user document (collection `users`):**
- `_id`, `email`, `fullName`, `partnerName`, `createdAt`, … (use `email` and `fullName` for the notification)

---

## Step 1: Install and Run n8n

### Option A: Run n8n locally (Docker)

1. Install [Docker](https://docs.docker.com/get-docker/) if you don’t have it.
2. Run n8n:
   ```bash
   docker run -d --name n8n -p 5678:5678 n8nio/n8n
   ```
3. Open in browser: **http://localhost:5678**
4. Create an account (first user becomes owner).

### Option B: Run n8n with npm (no Docker)

1. Install Node.js 18+.
2. Run:
   ```bash
   npx n8n
   ```
3. Open **http://localhost:5678** and create an account.

### Option C: n8n Cloud

1. Sign up at [n8n.io](https://n8n.io).
2. Create a workflow in the cloud (you’ll add MongoDB and email there; MongoDB must be reachable from the internet, e.g. MongoDB Atlas).

---

## Step 2: Add MongoDB Connection in n8n

1. In n8n, go to **Settings** (gear) → **Credentials** → **Add credential**.
2. Search for **MongoDB** and create a new credential.
3. **Connection string:** use your app’s MongoDB URI with database **test**:
   - **Your setup:** `mongodb://localhost:27017/test`
   - Atlas (if you switch later): `mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/test`
4. Save the credential (e.g. name: `Travel Routes DB`).

---

## Step 3: Create the Workflow

1. In n8n, click **Add workflow**.
2. Add nodes as below. You can build it step by step and test after each part.

### Node 1: Schedule Trigger

1. Add node → **Trigger** → **Schedule Trigger**.
2. Set interval, e.g. **Every 10 minutes** (or 15 minutes).
3. This run will be the “last run” for deciding which routes are new (we’ll use “last 15 minutes” in the next node).

### Node 2: Code – “Since” time

1. Add node → **Code** → **Code**.
2. Connect it **after** the Schedule Trigger.
3. Use this so the next node can query “routes created since X”:

```javascript
const since = new Date(Date.now() - 15 * 60 * 1000); // 15 minutes ago
return [{ json: { since: since.toISOString() } }];
```

4. Name the node e.g. `Since 15 min ago`.

### Node 3: MongoDB – Find recent routes

1. Add node → **MongoDB** → **Find** (or **Execute Query** if your n8n version uses that).
2. Select the MongoDB credential you created.
3. **Database:** `test`
4. **Collection:** `routes`
5. **Query** (use a filter for recent routes). Example for “Find” with a query filter:
   - Filter / query (as JSON):
   ```json
   {
     "createdAt": { "$gte": { "$date": "{{ $json.since }}" } }
   }
   ```
   If your n8n MongoDB node uses a simple “Query” field, try:
   ```json
   { "createdAt": { "$gte": "{{ $('Since 15 min ago').item.json.since }}" } }
   ```
   (Adjust node name if different. If the node expects a Date object, use a Code node to run the find instead; see alternative below.)
6. **Options:** sort by `createdAt` descending, limit e.g. `20`.
7. Name the node e.g. `Recent routes`.

**Alternative if “Find” doesn’t support dynamic date:** use **MongoDB – Execute Query** in database `test`, collection `routes`:

```javascript
// In Execute Query / Code that runs MongoDB
const since = new Date(Date.now() - 15 * 60 * 1000);
// Then run: db.collection('routes').find({ createdAt: { $gte: since } }).sort({ createdAt: -1 }).limit(20)
```

Use the node’s documentation for your n8n version to pass `since` and the query.

### Node 4: Loop over each route (optional but clearer)

1. Add **Loop Over Items** (or use “Split Out” on the array of routes so each route is one item).
2. So the rest of the workflow runs **once per route**.

### Node 5: MongoDB – Get user by userId

1. Add **MongoDB** → **Find** (or **Find One**).
2. **Database:** `test`
3. **Collection:** `users`
4. **Query:** find the user whose `_id` equals the route’s `userId`. In your DB, `userId` in routes is a string (e.g. `"69a1eb0ebbb7d2467ee2f488"`) and `_id` in users is an ObjectId, so you need to match them:
   - If the MongoDB node supports extended JSON: `{ "_id": { "$oid": "{{ $json.userId }}" } }`
   - Or use **Execute Query** in database `test`, collection `users`:  
     `db.collection('users').findOne({ _id: new ObjectId($json.userId) })`
5. Connect the **current route** item to this node (so `$json.userId` is the route’s userId).
6. Name the node e.g. `User by ID`.

### Node 6: Build email content (Code node)

1. Add **Code** node.
2. Input: one item with **route** data and **user** data (merge the two previous nodes if needed, or take user from “User by ID” and route from “Recent routes”).
3. Example (adjust variable names to match your node outputs):

```javascript
const route = $input.first().json;  // or get route from the route node
const user = $('User by ID').first().json;  // or the merged item

const dailySummary = (route.dailyRoutes || [])
  .map(d => `Day ${d.day}: ${d.startLocation} → ${d.endLocation} (${d.distance_km} km)`)
  .join('\n');

return [{
  json: {
    email: user.email,
    fullName: user.fullName || 'Traveler',
    subject: `Route saved: ${route.destination}`,
    text: `Hi ${user.fullName},\n\nYour route was saved:\n\nDestination: ${route.destination}\nType: ${route.tripType}\nDuration: ${route.durationDays} days\n\nDaily segments:\n${dailySummary}\n\nView your routes in the app.`,
  }
}];
```

4. Name it e.g. `Build email`.

### Node 7: Send email

1. Add **Gmail** or **SendGrid** or **SMTP** node (depending on what you use).
2. Connect **Build email** to it.
3. Configure the email node:
   - **To:** `{{ $json.email }}`
   - **Subject:** `{{ $json.subject }}`
   - **Body (text):** `{{ $json.text }}`
4. Create the credential (Gmail OAuth2, SendGrid API key, or SMTP) and save.

---

## Step 4: Test the workflow

1. In your app, **save a route** (so a new document appears in `routes`).
2. In n8n, either wait for the next schedule run or click **Execute workflow** once.
3. Check that:
   - “Recent routes” returns at least one item.
   - “User by ID” returns the user with `email`.
   - The email node sends to that address and the body looks correct.

---

## Step 5: Activate and run in production

1. **Activate** the workflow (toggle in n8n).
2. Leave n8n running (Docker container, or `npx n8n` in production, or use n8n Cloud).
3. Ensure MongoDB is reachable from n8n (for local MongoDB, n8n must run on the same machine or network; for Atlas, use the Atlas URI).

---

## Summary

| Step | What you do |
|------|-------------|
| 1 | Install/run n8n (Docker, npm, or Cloud). |
| 2 | Add MongoDB credential: `mongodb://localhost:27017/test` (database **test**). |
| 3 | Schedule Trigger (e.g. every 10 min). |
| 4 | Code: compute “since” = 15 minutes ago. |
| 5 | MongoDB: find `routes` where `createdAt >= since`. |
| 6 | For each route: MongoDB find `users` by `_id` = route’s `userId`. |
| 7 | Code: build subject and body from route + user. |
| 8 | Email node: send to `user.email` with that subject/body. |
| 9 | Activate workflow. |

No changes are required in your project code; only n8n and MongoDB are used.

---

## Optional: Avoid sending the same route twice

If you run every 10 minutes and use “last 15 minutes,” some routes might be picked up twice. To avoid that:

- **Option A:** Use “last 10 minutes” (same as interval) so the window doesn’t overlap.
- **Option B:** Add a “notification sent” field to routes and update it from n8n (e.g. with a MongoDB “Update” node). That would require a small schema change (new optional field) and n8n updating documents; your **app logic** (saving a route) still doesn’t change.

For most cases, Option A is enough.
