const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function updateProducts() {
  try {
    const productsRef = db.collection('products');
    const snapshot = await productsRef.get();
    let updateCount = 0;

    for (const doc of snapshot.docs) {
      const data = doc.data();
      let newCategory = data.category;

      if (data.category === 'Products' || data.category === 'products') {
        newCategory = 'Product';
      } else if (data.category === 'Services' || data.category === 'services') {
        newCategory = 'Service';
      }

      if (newCategory !== data.category) {
        await doc.ref.update({ category: newCategory });
        console.log(`Updated ${doc.id}: ${data.category} -> ${newCategory}`);
        updateCount++;
      }
    }

    console.log(`Updated ${updateCount} products`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

updateProducts();