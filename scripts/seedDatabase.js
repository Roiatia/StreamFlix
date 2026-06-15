require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const User     = require('../models/userModel');
const Profile  = require('../models/profileModel');
const Content  = require('../models/contentModel');

const personasData = require('../data/personas.json');
const contentData  = require('../data/content.json');

async function upsertUser({ name, email, password, role }) {
  const passwordHash = await bcrypt.hash(password, 10);
  await User.findOneAndUpdate(
    { email },
    { $set: { name, email, passwordHash, role }, $unset: { password: '' } },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
  );
}

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  await upsertUser({ name: 'Test User',  email: 'test@example.com',  password: '123456',   role: 'user'  });
  await upsertUser({ name: 'Admin User', email: 'admin@example.com', password: 'admin123', role: 'admin' });
  console.log('Users seeded');

  // Profiles from personas.json
  for (const p of personasData) {
    await Profile.findOneAndUpdate(
      { legacyId: p.id },
      { legacyId: p.id, name: p.name, avatar: p.avatar },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );
  }
  console.log(`${personasData.length} profiles seeded`);

  // Content from content.json
  const { items, popularIds, baseLikeCounts } = contentData;
  const popularSet = new Set(popularIds);

  for (const item of items) {
    await Content.findOneAndUpdate(
      { legacyId: item.id },
      {
        legacyId:      item.id,
        title:         item.title,
        type:          item.type,
        genre:         item.genre,
        year:          item.year,
        rating:        item.rating,
        language:      item.language,
        description:   item.description,
        img:           item.img,
        personas:      item.personas,
        baseLikeCount: baseLikeCounts[String(item.id)] || 0,
        isPopular:     popularSet.has(item.id),
      },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );
  }
  console.log(`${items.length} content items seeded`);

  await mongoose.disconnect();
  console.log('Seed complete');
}

seed().catch(err => {
  console.error(err.message);
  process.exit(1);
});
