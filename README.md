# library-management-system

## Schema Decisions

**Why `Book` references `Genre` instead of embedding it**

Each `Book` stores a `genreId` foreign key pointing to a single row in the `Genre` table, rather than copying the genre's details into every book.

- **One source of truth.** A genre is defined once. Renaming it is a single-row update, not an edit to every book.
- **No inconsistency.** Embedded strings drift ("Sci-Fi", "SciFi", "science fiction"). A foreign key guarantees every book points to a genre that really exists.
- **Genres are queried on their own.** "List all genres" and "all books in a genre" are simple indexed queries.
- **Genres carry their own data.** A genre can have its own attributes without bloating every book record.