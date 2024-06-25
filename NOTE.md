# My Note
This note that explaine or something that can improve the project performance in any aspect as I know haha... :D. Or I just want to put any random note about this projetc for my personal learn experience.

## Database
### Try change Index Algorithm
First of all, actually I have been read Prisma documentation about indexing in database, but I found that we can't just simply put that configration in `schema.prisma` so to change the index algorithm we need to touch the database it self.

I have been tried using `@@index([id], name: "id_hash_idx", type: Hash)` in `schema.prisma`, and what I get is Prisma just create new index with what i spesify before and not applied to `id` column.

Why I want to try change the indec algorithm in `id` column it because the default value for that column is `UUIDv4`. This UUID is random string which don't have any ordering stuff, so if I just stand with default Postgres indexing algorithm `BTree` it can caused more expensive computational to indexing the data when insert new data compare to `Hash` algorithm.

`BTree` algorithm in Postgres work simply compare the new data with existing data and create structure like balance tree. So when we try to search value in column that using this algo to indexing, we don't need to compare the data to entire data and it make more faster. You can see this algorithm more detail with beautifull diagram in this link [BTree Diagram](https://www.cs.usfca.edu/~galles/visualization/BTree.html).

In this contex, when I use UUID in `id` column, I dont need searching that column to compre data like literly `1 > 2,3,4...etc` if using `BTree`. I need to exactly find that value match with pareameter I give, so it more like `hjasd = <any id>`. Because that I consider to use `Hash` instead of `BTree` to indexing the `id` column.


## NestJS
### Middleware Won't Work When Using Global Prefix
This issue appear when we use global prefix in main.ts, event we set the prefix exacly same with path in middleware, the middleware wont work.


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
I decided to use manual config not from NestJs becouse of Nest config pattern. I mena when we need to call ConfigModule buildin NestJs it only can call inside module, so if you need to get config and pass it outside class of nest module you can't do that. This make calling config not practice to me and a bit complicated to me.

This how to use NestJs buildin config, just note how to use it cuz I want remove it, incase i want to use it againg in other prject.

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


## Authenctication
### Generate Secret Ket from OpenSSL
To generate secret key from OpenSSL it simply run this command
```sh
openssl rand -base64 32
```