# My Note
This note explains something that can improve the project performance in any aspect as I know haha... :D. Or I just want to put a random note about this project for my personal learning experience.

## Database
### Try change Index Algorithm
First of all, actually I have been reading Prisma documentation about indexing in databases, but I found that we can't just simply put that configuration in `schema.prisma` so to change the index algorithm we need to touch the database itself.

I have been tried using `@@index([id], name: "id_hash_idx", type: Hash)` in `schema.prisma`, and what I get is Prisma just create new index with what I spesify before and not applied to `id` column.

I want to try to change the index algorithm in the `id` column because the default value for that column is `UUIDv4`. This UUID is a random string which doesn't have any ordering stuff, so if I just stand with the default Postgres indexing algorithm `BTree` it can cause more expensive computations to index the data when inserting new data compared to `Hash` algorithm.

`BTree` algorithm in Postgres works by simply comparing the new data with existing data and creating a structure like a balance tree. So when we try to search values in a column using this algo to indexing, we don't need to compare the data to the entire data and it makes it faster. You can see this algorithm in more detail with beautifull diagram in this link [BTree Diagram](https://www.cs.usfca.edu/~galles/visualization/BTree.html).

In this context, when I use UUID in the `id` column, I don't need to search that column to compare data like literally `1 > 2,3,4...etc` if using `BTree`. I need to exactly find that value match with the parameter I give, so it is more like `hjasd = <any id>`. Because that I consider to use `Hash` instead of `BTree` to indexing the `id` column.


## NestJS
### Using Bun as Runtime of Nest
When you use some of `Bun` native method, like `Bun.password` etc. You need to configure nest runner to add parameter `--watch \"bun run\"`. Full command like this bellow.
```sh
"start:dev": "nest start --watch --exec \"bun run\""
```

### Middleware Won't Work When Using Global Prefix
This issue appears when we use global prefix in main.ts, even if we set the prefix exactly the same with path in middleware, the middleware wont work.


## PrismaJs
### Example Create Filter to Handle Error by Prisma
You can place this code in `prisma.filter.ts`. This example I learn from [Building a REST API with NestJS and Prisma: Error Handling](https://www.prisma.io/blog/nestjs-prisma-error-handling-7D056s1kOop2).

```ts
@Catch(PrismaClientKnownRequestError)
export class PrismaFilter extends BaseExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    console.error(exception.message);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const message = exception.message.replace(/\n/g, '');

    switch (exception.code) {
      case 'P2002': {
        const status = HttpStatus.CONFLICT;
        response.status(status).json({
          statusCode: status,
          message: message,
        });
        break;
      }
      default:
        // default 500 error code
        super.catch(exception, host);
        break;
    }
  }
}
```

### Back to Manual Config
I decided to use manual config not from NestJs because of Nest config pattern. I mean when we need to call ConfigModule building NestJs it only can call inside modules, so if you need to get config and pass it outside the class of nest module you can't do that. This makes calling config not practical to me and a bit complicated to me.

This is how to use NestJs build config, just note how to use it cuz I want to remove it, in case I want to use it again in another project.

1. Install the module
    ```sh
    bun i @nestjs/config
    ```

2. Apply in `app.module.ts`
    ```ts
    @Module({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, cache: true }),
        ...
      ],
    })
    ...
    ```

3. Use config in `main.ts`
    ```ts
    const config = app.get(ConfigService);
    const appPort = config.get(APP_PORT);
    ```

4. Use config in controller `*.controller.ts`
    ```ts
    export class UsersController {
      constructor(private readonly config: ConfigService) {}

      @Get()
      async findAll() {
        const appVer = config.get<string>('APP_VER');
        ...
      }
      ...
    ```
    Note: Becuse we import `ConfigModule` as global in `app.module.ts` we dont neet to import it in other module, just inject it as constructor.


## Authentication
### Generate Secret Ket from OpenSSL
To generate secret key from OpenSSL it simply run this command
```sh
openssl rand -base64 32
```


## Prisma
### Setup Prisma
1. Add prisma dependency
   ```sh
   bun add -d prisma
   ```
2. Prisma init
   ```sh
   bunx prisma init
   ```
3. Migrate schema
   ```sh
   bunx prisma migrate dev --name "init"
   ```
4. Seed
   Make sure you have add this code to `package.json`
   ```json
   "prisma": {
     "seed": "bun prisma/seed.ts"
   }
   ```
   And then you can seed using
   ```sh
   bun prisma db seed
   ```

## Storing Hashed Password in Seeder
Why I do this instead of write plain password and hashing it in seeder is because when I use `Bun.password.hash` I need to run that seeder using `Bun` and I actually can run it but I don't really know why the data it not inputed to db, event the seeder is success run. Solution I do for now is using hashed password as string in seeder and run the seeder using `ts-node`.