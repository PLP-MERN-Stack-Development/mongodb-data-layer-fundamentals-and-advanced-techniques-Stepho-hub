# MongoDB Fundamentals - Week 1 Assignment Queries execution

## Setup Instructions

Make sure you have the following installed:

1. **MongoDB Community Edition** - [Installation Guide](https://www.mongodb.com/docs/manual/administration/install-community/)
2. **MongoDB Shell (mongosh)** - This is included with MongoDB Community Edition
3. **Node.js** - [Download here](https://nodejs.org/)

### Node.js Package Setup

## Files Included

- `Week1-Assignment.md`: Detailed assignment instructions
- `insert_books.js`: Script to populate your MongoDB database with sample book data
- `queries.js`: All assignment execution queries

## Running the scripts (insert_books.js and queries.js)

These instructions assume you're using PowerShell on Windows and have MongoDB running locally at the default URI `mongodb://localhost:27017`. If you're using MongoDB Atlas, replace the `uri` constant in the scripts with your Atlas connection string.

1. Install dependencies (only needed once):

```powershell
npm install
```

2. Populate the database with sample data:

```powershell
# This will insert the sample books and recreate the collection if it already exists
node .\insert_books.js
```

3. Run the queries script (this will run CRUD examples, aggregations, create indexes, and show explain() output before/after index creation):

```powershell
node .\queries.js
```

4. What to look for in the output:

- The script prints query results and aggregation outputs to the console.
- For indexing, the script runs an explain('executionStats') for a title search before and after creating indexes. Compare the two explain blocks:
	- totalDocsExamined should be much lower after creating an index on `title`.
	- totalKeysExamined will be > 0 when the index is used.
	- executionTimeMillis should generally be smaller after indexing.
- The script also demonstrates explain() for the compound index on `author` and `published_year` and prints the query plan stage (e.g., IXSCAN) and index name when applicable.

5. Troubleshooting:

- If you see connection errors, ensure MongoDB is running and accessible at the configured `uri`.
- If `node` commands fail, ensure Node.js is installed and available in your PATH.
- If explain() output looks unexpected, ensure the collection has data (run `insert_books.js` first) and that indexes were created (the script creates them automatically).


## Requirements

- Node.js (v18 or higher)
- MongoDB (local installation or Atlas account)
- MongoDB Shell (mongosh) or MongoDB Compass

## Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [MongoDB University](https://university.mongodb.com/)
- [MongoDB Node.js Driver](https://mongodb.github.io/node-mongodb-native/) 

## End .....