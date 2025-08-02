// server.cjs

// ── Load & Validate Environment ───────────────────────────────────────────────
require('dotenv').config();
const requiredEnvs = ['DATABASE_URL','JWT_SECRET','GROQ_API_KEY','FRONTEND_URL'];
for (const name of requiredEnvs) {
  if (!process.env[name]) {
    console.error(`❌  Missing required env var: ${name}`);
    process.exit(1);
  }
}

// ── Module Imports ────────────────────────────────────────────────────────────
const express         = require('express');
const fs              = require('fs');
const path            = require('path');
const cors            = require('cors');
const cron            = require('node-cron');
const { exec }        = require('child_process');
const bcrypt          = require('bcrypt');
const jwt             = require('jsonwebtoken');
const { PrismaClient }= require('@prisma/client');
const Groq            = require('groq-sdk');

// ── App Configuration ─────────────────────────────────────────────────────────
const prisma      = new PrismaClient();
const app         = express();
const PORT        = process.env.PORT || 4000;
const JWT_SECRET  = process.env.JWT_SECRET;
const PYTHON_CMD  = process.env.PYTHON_CMD || 'python3';
const FRONTEND_URL= process.env.FRONTEND_URL;
const groqClient  = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ── Data Directories & File Map ───────────────────────────────────────────────
const DATA_DIR          = path.join(__dirname, 'data');
const FRONTEND_DATA_DIR = path.join(__dirname, '..', 'frontend', 'public', 'data');
for (const d of [DATA_DIR, FRONTEND_DATA_DIR]) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}

const FILES = {
  today:           'todaysserving.json',
  modelData:       'dataformodel.json',
  events:          'events.json',
  predicted:       'predicted.json',
  predictedWeekly: 'predicted_weekly.json',
  metricsWeekly:   'metrics_weekly.json',
  metricsMonthly:  'metrics_monthly.json',
  foodItems:       'foodItems.json',
  reserved:        'reserved.json',
  cart:            'cart.json',
  requests:        'requests.json',
  feedback:        'feedback.json'
};
const dataPath   = key => path.join(DATA_DIR,         FILES[key]);
const publicPath = key => path.join(FRONTEND_DATA_DIR, FILES[key]);

// ── JSON Helpers (Atomic Write) ───────────────────────────────────────────────
function readJson(fp, fallback = []) {
  if (!fs.existsSync(fp)) fs.writeFileSync(fp, JSON.stringify(fallback, null, 2));
  const raw = fs.readFileSync(fp, 'utf8');
  try {
    return JSON.parse(raw || 'null') || fallback;
  } catch {
    console.error(`❌ Invalid JSON in ${fp}, resetting to fallback.`);
    fs.writeFileSync(fp, JSON.stringify(fallback, null, 2));
    return fallback;
  }
}
function writeJson(fp, data) {
  const tmp = fp + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(tmp, fp);
}
function syncJson(key, data) {
  writeJson(dataPath(key), data);
  if (key !== 'today') writeJson(publicPath(key), data);
}
function readSummary(key) {
  return readJson(dataPath(key), {});
}

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors({
  origin: FRONTEND_URL,
  allowedHeaders: ['Content-Type','Authorization']
}));

// ── Auth Helpers ─────────────────────────────────────────────────────────────
function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.sendStatus(401);
  try {
    req.user = jwt.verify(auth.slice(7), JWT_SECRET);
    next();
  } catch {
    res.sendStatus(401);
  }
}

// ── Async Error Wrapper & Global Handler ──────────────────────────────────────
const wrap = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Auth Routes ───────────────────────────────────────────────────────────────
app.post('/api/v1/auth/signup', wrap(async (req, res) => {
  const { email, password, role, gstNumber, aadharNumber } = req.body;
  if (!email || !password || !role)
    return res.status(400).json({ error: 'Missing fields' });
  const hash = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: { email, role, passwordHash: hash, gstNumber, aadharNumber }
    });
    res.json({ id: user.id, email: user.email, role: user.role });
  } catch (e) {
    if (e.code === 'P2002') return res.status(409).json({ error: 'Email already in use' });
    throw e;
  }
}));

app.post('/api/v1/auth/login', wrap(async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash)))
    return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '2h' });
  res.json({ token });
}));

// ── Model Summary & Recalibrate ──────────────────────────────────────────────
app.get('/api/model/summary', requireAuth, wrap((req, res) => {
  res.json(readSummary('predicted'));
}));

app.post('/api/model/recalibrate', requireAuth, wrap((req, res) => {
  exec(
    `${PYTHON_CMD} train_model.py --episodes=200`,
    { cwd: __dirname },
    (err, stdout, stderr) => {
      if (err) {
        console.error('⛔ Model training failed:', stderr);
        return res.status(500).json({
          error: 'Model training failed',
          details: stderr.slice(0, 200)
        });
      }
      try {
        const summary = readSummary('predicted');
        summary.lastCalibrated = new Date().toISOString();
        syncJson('predicted', summary);
        res.json(summary);
      } catch (e) {
        console.error('⛔ Failed to load new summary:', e);
        res.status(500).json({ error: 'Failed to load model summary after training' });
      }
    }
  );
}));

// ── Stats Endpoints ───────────────────────────────────────────────────────────
app.get('/api/stats/users', requireAuth, wrap(async (req, res) => {
  const [ngoCount, restaurantCount] = await Promise.all([
    prisma.user.count({ where: { role: 'NGO' } }),
    prisma.user.count({ where: { role: 'RESTAURANT' } })
  ]);
  const allReqs      = readJson(dataPath('requests'), []);
  const accepted     = allReqs.filter(r => r.status === 'accepted');
  const mealsDonated = accepted.length;
  const foodSaved    = accepted.reduce((sum, r) => sum + parseInt(r.quantity||0, 10), 0);
  res.json({ ngos: ngoCount, restaurants: restaurantCount, mealsDonated, foodSaved });
}));

app.get('/api/stats/dashboard', requireAuth, wrap((req, res) => {
  const activePartners     = prisma.user.count({ where: { role: 'RESTAURANT' } });
  const allReqs            = readJson(dataPath('requests'), []);
  const upcomingPickups    = allReqs.filter(r => r.status === 'pending').length;
  const requestsFulfilled  = allReqs.filter(r => r.status === 'accepted').length;
  const totalFoodSaved     = allReqs
    .filter(r => r.status === 'accepted')
    .reduce((sum, r) => sum + (r.quantity ? parseInt(r.quantity,10) : 0), 0);
  Promise.resolve(activePartners).then(count =>
    res.json({ activePartners: count, upcomingPickups, requestsFulfilled, totalFoodSaved })
  );
}));

// ── Time-Series Helpers ─────────────────────────────────────────────────────
function getSeries(period) {
  const all = readJson(dataPath('modelData'));
  all.sort((a,b) => new Date(a.date) - new Date(b.date));
  const days = period === 'monthly' ? 30 : 7;
  return all.slice(-days).map(day => ({
    date:          day.date,
    actual:        day.items.reduce((s,i)=>s+(i.totalPlates||0),0),
    actualEarning: parseFloat(day.items.reduce((s,i)=>s+(i.totalEarning||0),0).toFixed(2))
  }));
}

// ── Data-for-Model & Predicted Endpoints ────────────────────────────────────
app.get('/api/dataformodel/:period', requireAuth, wrap((req, res) => {
  const p = req.params.period;
  if (!['weekly','monthly'].includes(p))
    return res.status(400).json({ error: 'Invalid period' });
  res.json(getSeries(p));
}));

app.get('/api/predicted/:period', requireAuth, wrap((req, res) => {
  const p = req.params.period;
  if (!['weekly','monthly'].includes(p))
    return res.status(400).json({ error: 'Invalid period' });
  const series = getSeries(p).map(d => ({
    date:            d.date,
    predicted:       d.actual,
    predictedEarning:d.actualEarning
  }));
  const summary = readSummary('predicted');
  res.json({ epsilon: summary.epsilon||0, series });
}));

app.get('/api/predicted/weekly', requireAuth, wrap((req, res) => {
  res.json(readJson(dataPath('predictedWeekly'), {}));
}));

// ── Metrics Endpoints ────────────────────────────────────────────────────────
app.get('/api/metrics/weekly', requireAuth, wrap((req, res) => {
  res.json(readSummary('metricsWeekly'));
}));
app.get('/api/metrics/monthly', requireAuth, wrap((req, res) => {
  res.json(readSummary('metricsMonthly'));
}));

// ── Servings Endpoints ───────────────────────────────────────────────────────
app.get('/api/servings', requireAuth, wrap((req, res) => {
  let all     = readJson(dataPath('today'), []);
  const today = new Date().toISOString().split('T')[0];
  all = all.map(s => {
    if (!s.id) {
      s.id = Date.now().toString() + Math.random().toString(36).slice(2,6);
    }
    return s;
  });
  writeJson(dataPath('today'), all);
  writeJson(publicPath('today'), all);
  res.json(all.filter(s => s.date === today));
}));

app.post('/api/servings', requireAuth, wrap((req, res) => {
  const arr   = readJson(dataPath('today'), []);
  const today = new Date().toISOString().split('T')[0];
  const item  = { id: Date.now().toString(), date: today, ...req.body };
  arr.push(item);
  syncJson('today', arr);
  res.json({ message: 'Added', item });
}));

app.delete('/api/servings/:id', requireAuth, wrap((req, res) => {
  const all = readJson(dataPath('today'), []);
  const filtered = all.filter(s => s.id !== req.params.id);
  syncJson('today', filtered);
  res.json({ message: 'Deleted' });
}));

// ── Feedback & Reviews ───────────────────────────────────────────────────────
app.post('/api/feedback', wrap((req, res) => {
  const fp = dataPath('feedback');
  const newFb = { ...req.body, id: Date.now().toString(), submittedAt: new Date().toISOString() };
  const existing = readJson(fp, []);
  existing.push(newFb);
  writeJson(fp, existing);
  res.json({ message: 'Feedback submitted successfully' });
}));

app.get('/api/feedback', wrap((req, res) => {
  res.json(readJson(dataPath('feedback'), []));
}));

app.get('/api/reviews', wrap((req, res) => {
  const raw = readJson(dataPath('feedback'), []);
  const reviews = raw.map(item => ({
    id:            item.id,
    reviewerName:  item.organizationName,
    reviewerType:  "ngo",
    targetName:    item.reviewFor,
    targetType:    "restaurant",
    rating:        item.rating,
    comment:       item.content,
    date:          item.submittedAt,
    foodItem:      item.menuItem || "",
    helpful:       0,
    verified:      true,
  }));
  res.json(reviews);
}));

// ── Food Upload & Reservation ────────────────────────────────────────────────
app.post('/api/food', requireAuth, wrap((req, res) => {
  const list = readJson(dataPath('foodItems'), []);
  const item = { ...req.body, id: Date.now().toString(), status: 'available', createdAt: new Date().toISOString() };
  list.push(item);
  syncJson('foodItems', list);
  res.json({ message: 'Food added', item });
}));

app.get('/api/available-food', requireAuth, wrap((req, res) => {
  const all = readJson(dataPath('foodItems'), []);
  const now = new Date();
  const twoHoursAgo = new Date(now.getTime() - 2*60*60*1000);
  const todayStr    = now.toISOString().split('T')[0];
  all.forEach(i => { if (!i.createdAt) i.createdAt = now.toISOString(); });
  writeJson(dataPath('foodItems'), all);
  const fresh = all.filter(i =>
    i.status === 'available' &&
    new Date(i.createdAt) >= twoHoursAgo &&
    i.createdAt.split('T')[0] === todayStr
  );
  syncJson('foodItems', fresh);
  res.json(fresh);
}));

app.post('/api/reserve-food', requireAuth, wrap((req, res) => {
  const { id } = req.body;
  const all    = readJson(dataPath('foodItems'), []);
  const idx    = all.findIndex(i => i.id === id);
  if (idx < 0) return res.status(404).json({ error: 'Not found' });
  all[idx].status     = 'reserved';
  all[idx].reservedAt = new Date().toISOString();
  syncJson('foodItems', all);
  const reserved = readJson(dataPath('reserved'), []);
  reserved.push(all[idx]);
  syncJson('reserved', reserved);
  res.json({ success: true });
}));

// ── Cart & Requests ─────────────────────────────────────────────────────────
app.post('/api/save-cart', requireAuth, wrap((req, res) => {
  const { items } = req.body;
  if (!Array.isArray(items)) return res.status(400).json({ error: 'Invalid payload' });
  syncJson('cart', items);
  const existing = readJson(dataPath('requests'), []);
  items.forEach(f => {
    existing.push({
      id:              f.id,
      name:            f.name,
      quantity:        f.quantity,
      estimatedValue:  f.estimatedValue,
      restaurant:      f.restaurant,
      reservedAt:      f.reservedAt,
      pickupStartTime: f.pickupStartTime,
      pickupEndTime:   f.pickupEndTime,
      status:          'booked'
    });
  });
  syncJson('requests', existing);
  res.json({ message: 'Cart saved and requests created' });
}));

app.get('/api/requests', requireAuth, wrap((req, res) => {
  res.json(readJson(dataPath('requests'), []));
}));

app.post('/api/requests/:id/status', requireAuth, wrap((req, res) => {
  const { status } = req.body;
  const all = readJson(dataPath('requests'), []);
  const idx = all.findIndex(r => String(r.id) === req.params.id);
  if (idx < 0) return res.status(404).json({ error: 'Not found' });
  all[idx].status = status;
  syncJson('requests', all);
  res.json({ message: 'Status updated', id: req.params.id, status });
}));

app.delete('/api/cart', requireAuth, wrap((req, res) => {
  syncJson('cart', []);
  res.json({ message: 'Cart cleared' });
}));

app.delete('/api/reserved/:id', requireAuth, wrap((req, res) => {
  const all = readJson(dataPath('reserved'), []);
  syncJson('reserved', all.filter(i => String(i.id) !== req.params.id));
  res.json({ message: 'Reserved item removed' });
}));

app.delete('/api/food/:id', requireAuth, wrap((req, res) => {
  const all = readJson(dataPath('foodItems'), []);
  syncJson('foodItems', all.filter(i => String(i.id) !== req.params.id));
  res.json({ message: 'Food item deleted' });
}));

// ── Archive & Reset ──────────────────────────────────────────────────────────
app.post('/api/archive', requireAuth, wrap((req, res) => {
  const arr       = readJson(dataPath('today'), []);
  const dateStamp = new Date().toISOString().split('T')[0];
  const md        = readJson(dataPath('modelData'), []);
  const idx       = md.findIndex(d => d.date === dateStamp);
  if (idx >= 0) md[idx].items = arr;
  else          md.push({ date: dateStamp, items: arr });
  md.sort((a,b) => new Date(a.date) - new Date(b.date));
  syncJson('modelData', md);
  res.json({ message: 'Archived' });
}));

app.post('/api/reset', requireAuth, wrap((req, res) => {
  syncJson('today', []);
  res.json({ message: 'Today cleared' });
}));

// ── Predictions History ───────────────────────────────────────────────────────
app.get('/api/predictions', wrap((req, res) => {
  const data   = readJson(dataPath('predicted'), {});
  const dishes = Array.isArray(data.dishes) ? data.dishes : [];
  const q_vals = Array.isArray(data.q_values) ? data.q_values : [];
  const counts = Array.isArray(data.counts)   ? data.counts   : [];
  const best   = data.best;
  const predictions = dishes.map((dish, i) => ({
    dishName: dish,
    qValue:   parseFloat((q_vals[i]||0).toFixed(2)),
    count:    counts[i]||0,
    isBest:   dish === best
  }));
  res.json(predictions);
}));

// ── Events Endpoints ─────────────────────────────────────────────────────────
app.get('/api/events', requireAuth, wrap((req, res) => {
  const all      = readJson(dataPath('events'), []);
  const todayStr = new Date().toISOString().split('T')[0];
  const upcoming = all.filter(e => e.date >= todayStr);
  syncJson('events', upcoming);
  res.json(upcoming);
}));

app.post('/api/events', requireAuth, wrap((req, res) => {
  const evts = readJson(dataPath('events'), []);
  evts.push(req.body);
  syncJson('events', evts);
  res.json({ message: 'Event added' });
}));

app.delete('/api/events/:id', requireAuth, wrap((req, res) => {
  const filtered = readJson(dataPath('events'), []).filter(e => e.id !== req.params.id);
  syncJson('events', filtered);
  res.json({ message: 'Event deleted' });
}));

// ── Cron Job (Archive & Retrain) ─────────────────────────────────────────────
cron.schedule('0 0 * * *', () => {
  try {
    // Archive
    const arr   = readJson(dataPath('today'), []);
    const stamp = new Date().toISOString().split('T')[0];
    const md    = readJson(dataPath('modelData'), []);
    const idx   = md.findIndex(d => d.date === stamp);
    if (idx >= 0) md[idx].items = arr;
    else          md.push({ date: stamp, items: arr });
    md.sort((a,b) => new Date(a.date) - new Date(b.date));
    syncJson('modelData', md);

    // Reset
    writeJson(dataPath('today'), []);
    writeJson(publicPath('today'), []);

    // Retrain
    exec(`${PYTHON_CMD} train_model.py --episodes=200`, { cwd: __dirname });
  } catch (e) {
    console.error('Cron job failed', e);
  }
});

// ── Partnership & Restaurants ─────────────────────────────────────────────────
app.post('/api/partnership-requests', requireAuth, wrap(async (req, res) => {
  const { restaurantId } = req.body;
  const ngoId = req.user.userId;
  const existing = await prisma.partnershipRequest.findFirst({ where: { ngoId, restaurantId } });
  if (existing) return res.status(409).json({ error: 'Already requested.' });
  const request = await prisma.partnershipRequest.create({ data: { ngoId, restaurantId } });
  res.json(request);
}));

app.get('/api/partnership-requests/outgoing', requireAuth, wrap(async (req, res) => {
  const ngoId   = req.user.userId;
  const requests= await prisma.partnershipRequest.findMany({
    where: { ngoId },
    include: { restaurant: true }
  });
  res.json(requests);
}));

app.get('/api/restaurants', requireAuth, wrap(async (req, res) => {
  const raw = await prisma.user.findMany({
    where: { role: 'RESTAURANT' },
    select: {
      id:             true,
      restaurantName: true,
      email:          true,
      gstNumber:      true,
      createdAt:      true
    }
  });
  const list = raw.map(r => ({
    id:             r.id,
    name:           r.restaurantName,
    email:          r.email,
    gstNumber:      r.gstNumber || '',
    joinedDate:     r.createdAt.toISOString(),
    address:        '',
    phone:          '',
    cuisine:        '',
    status:         'Active',
    lastPickup:     '-',
    totalDonations: 0,
    totalPickups:   0,
    rating:         0,
    reliability:    0
  }));
  res.json(list);
}));

// ── Groq Chat API ─────────────────────────────────────────────────────────────
const SMARTMEAL_PROMPT = `
You are SmartMeal AI, the official assistant of the SmartMeal project.
SmartMeal AI connects restaurants with NGOs to reduce food waste and help communities.
Your tasks:
1. If asked to "upload today's serving", fetch /data/todaysserving.json and POST to /api/food.
2. Provide quick summaries of today's serving, food waste, and earnings.
3. Help with NGO-related tasks and SmartMeal system features.
If unrelated questions are asked, politely respond with:
"I'm SmartMeal AI and can only assist with SmartMeal-related tasks."
Always confirm before performing any action that modifies or uploads data.
Be friendly, professional, and focus only on SmartMeal-related automation.
`;

app.post('/api/chat', requireAuth, wrap(async (req, res) => {
  const { messages } = req.body;
  const completion = await groqClient.chat.completions.create({
    model: "llama3-8b-8192",
    messages: [
      { role: "system", content: SMARTMEAL_PROMPT },
      ...messages
    ]
  });
  res.json({ reply: completion.choices[0]?.message?.content || "No response" });
}));

// ── Static Files & SPA Fallback ──────────────────────────────────────────────
app.use('/data', express.static(FRONTEND_DATA_DIR));
const FRONTEND_BUILD = path.join(__dirname, '../frontend/dist');
app.use(express.static(FRONTEND_BUILD));

// Only serve index.html for non-API routes
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(FRONTEND_BUILD, 'index.html'));
});

// ── Start Server ───────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server listening at http://localhost:${PORT}`);
});
