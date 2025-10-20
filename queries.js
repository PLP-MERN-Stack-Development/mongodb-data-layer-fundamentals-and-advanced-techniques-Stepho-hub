// run_queries.js
// Execute MongoDB queries using Node.js (no mongosh needed)
// ** Task 1: Creating a database and collection **
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'plp_bookstore';
const collectionName = 'books';

async function runQueries() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Successfully Connected to MongoDB');

    const db = client.db(dbName);
    const books = db.collection(collectionName);

    // ** Task 2: Basic CRUD Operations **
    // a. Find all books in a specific genre
    console.log('\nBooks in Fiction genre:');
    console.table(await books.find({ genre: 'Fiction' }).toArray());

    // b. Find books published after a certain year
    console.log('\nBooks published after 1950:');
    console.table(await books.find({ published_year: { $gt: 1950 } }).toArray());

    // c. Find books by a specific author
    console.log('\nBooks by George Orwell:');
    console.table(await books.find({ author: 'George Orwell' }).toArray());

    // d. Update price of a specific book
    await books.updateOne({ title: '1984' }, { $set: { price: 13.99 } });
    console.log('\n Updated price for "1984"');

    // e. Delete a book by title
    await books.deleteOne({ title: 'Moby Dick' });
    console.log('Deleted "Moby Dick"');

    // ** Task 3: Advanced Queries **
    // a. Find in -stock and recent books 
    console.log('\nIn-stock books published after 2010:');
    console.table(await books.find({ in_stock: true, published_year: { $gt: 2010 } }).toArray());

    // b. Projection - title, author, price
    console.log('\nOnly title, author, price:');
    console.table(await books.find({}, { projection: { _id: 0, title: 1, author: 1, price: 1 } }).toArray());

    // c. Sort books by price ascending
    console.log('\nBooks sorted by price (ascending):');
    console.table(await books.find().sort({ price: 1 }).toArray());

    // Sort books by price descending
    console.log('\nBooks sorted by price (descending):');
    console.table(await books.find().sort({ price: -1 }).toArray());

    // d. Pagination (first 5)
    console.log('\nFirst 5 books:');
    console.table(await books.find().limit(5).toArray());

    // ** Task 4: Aggregations **
    // a. Average price by genre
    console.log('\nAverage price by genre:');
    console.table(await books.aggregate([
      { $group: { _id: '$genre', avgPrice: { $avg: '$price' } } },
      { $sort: { avgPrice: -1 } }
    ]).toArray());

    // b. Author with most books
    console.log('\nAuthor with most books:');
    console.table(await books.aggregate([
      { $group: { _id: '$author', totalBooks: { $sum: 1 } } },
      { $sort: { totalBooks: -1 } },
      { $limit: 1 }
    ]).toArray());

    // c. Books grouped by publication decade
    console.log('\nBooks grouped by publication decade:');
    console.table(await books.aggregate([
      {
        $group: {
          _id: {
            $concat: [
              { $toString: { $subtract: ['$published_year', { $mod: ['$published_year', 10] }] } },
              's'
            ]
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray());

    // 5️ . **Task 5: Indexing**
    // a. Index creation on title
    await books.createIndex({ title: 1 });

    // b. Compound index on author and published_year
    await books.createIndex({ author: 1, published_year: 1 });
    console.log('\n Indexes created successfully');

    // c. Demonstration using explain() on the 'title' index (Task 2d query)
    console.log('\n Explain method for query on "title" (using index) ---');
    const titleExplainPlan = await books.find({ title: '1984' }).explain();

    // We only need the key execution stats to prove index usage
    console.log('Query Plan Stage:', titleExplainPlan.queryPlanner.winningPlan.stage);
    console.log('Index Used:', titleExplainPlan.queryPlanner.winningPlan.inputStage.indexName);

    // d. Demonstration using explain() on the 'author' and 'published_year' compound index
    console.log('\n Explain Plan for query on "author" and "published_year" (using compound index) ---');
    const compoundExplainPlan = await books.find({ author: 'George Orwell', published_year: { $gt: 1945 } }).explain();

    // Output key details to show index usage
    console.log('Query Plan Stage:', compoundExplainPlan.queryPlanner.winningPlan.stage);
    console.log('Index Used:', compoundExplainPlan.queryPlanner.winningPlan.inputStage.indexName);

    // Check if the plan is an 'IXSCAN' (Index Scan), which indicates index use
    if (compoundExplainPlan.queryPlanner.winningPlan.stage === 'IXSCAN') {
      console.log('Performance Improvement Confirmed: The query used an Index Scan (IXSCAN).');
    }

  }

  catch (err) {
    console.error('Error:', err);
  }

  finally {
    await client.close();
    console.log('\n Connection closed');
  }
}

runQueries();