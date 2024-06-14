# My Note
This note that explaine or something that can improve the project performance in any aspect as I know haha...:D. Or I just want to put any random note about this projetc for my personal learn experience.

## Database
### Try change Index Algorithm
First of all, actually I have been read Prisma documentation about indexing in database, but I found that we can't just simply put that configration in `schema.prisma` so to change the index algorithm we need to touch the database it self.

I have been tried using `@@index([id], name: "id_hash_idx", type: Hash)` in `schema.prisma`, and what I get is Prisma just create new index with what i spesify before and not applied to `id` column.

Why I want to try change the indec algorithm in `id` column it because the default value for that column is `UUIDv4`. This UUID is random string which don't have any ordering stuff, so if I just stand with default Postgres indexing algorithm `BTree` it can caused more expensive computational to indexing the data when insert new data compare to `Hash` algorithm.

`BTree` algorithm in Postgres work simply compare the new data with existing data and create structure like balance tree. So when we try to search value in column that using this algo to indexing, we don't need to compare the data to entire data and it make more faster. You can see this algorithm more detail with beautifull diagram in this link [BTree Diagram](https://www.cs.usfca.edu/~galles/visualization/BTree.html).

In this contex, when I use UUID in `id` column, I dont need searching that column to compre data like literly `1 > 2,3,4...etc` if using `BTree`. I need to exactly find that value match with pareameter I give, so it more like `hjasd = <any id>`. Because that I consider to use `Hash` instead of `BTree` to indexing the `id` column.
