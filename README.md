# learn-nextjs
next.js development exercise

This is the starter template for the Next.js App Router Course.
It contains the starting code for the dashboard application.

For more information, see the [course curriculum](https://nextjs.org/learn)
on the Next.js Website.

## Installing dependencies

To install the project dependencies you are going to need the most recent version
of npm. We are going to show you how to upgrade to the latest npm version in a future
version of this documentation.

```sh
npm install
```
## Postgres Database

This is what differences the original tutorial, here we use our own local postgres
database instance.

## SSL Certificates

To run our own instance of postgres you need to generate server key and certificate.

```sh
openssl genrsa -des3 -out private.key 2048
```

don't forget to provide a passphrase and keep it around because you are going to need it.

according to man openssl-genrsa page:

openssl-genrsa generates a RSA private key, `-des3` is the encryption cypher requested
for generating the key, `-out` specifies the output filename for the certificate, and
the last numeric input is the number is the size of the private-key in bits.

Then create a RSA key for your server via:

```sh
openssl rsa -in private.key -out server.key
```

according to man openssl-rsa page:

the `-in` flag specifies the input-file in this case that corresponds to the private key
we have just created, and `-out` defines the filename for our server key.

Finally we can generate the server certificate via:

```sh
openssl req -new -x509 -days 365 -key server.key -out server.crt -subj "/CN=localhost"
```

according to `man openssl-req` the flag `-new` generates a new ceritificate,
the flag `-x509` specifies that this is a **self-signed certificate**,
`-key` this is the server private key,
`-out` defines the filename for the certificate, and
`-subj` sets the subject name for new requests
(or for overrides when processing a request) and it has a specific format;
here `CN` stands for `COMMON_NAME` and here we are setting it to localhost because we
mean to use the self-signed CA certificate exclusively for testing the postgres db.

## Postgres Configuration

We need to define the configuration file `pg_hba.conf` for our instance of postgres so
that the nextjs app can communicate with it:

```config
ssl = on
ssl_cert_file = /var/lib/postgresql/server.crt
ssl_key_file = /var/lib/postgresql/server.key
```

here we are enabling the secure sockets layer SSL and specifying the names of the server
certificate and key files.

## Containerization

Now that we have our server certificates and the minimal configuration for our database
we can proceed to create an image of our database.

To achieve this we build the image for the postgres database via

```sh
docker build --tag im-postgres --network host .
```

make sure that both the server key and certificates and the configuration file are
present at the top level of the repository where the Dockerfile is located at.

for simplicity we set the network to that of the host machine.

Then you can start postgres instance via:

```sh
docker container run --rm -it --name postgres --network host im-postgres
```

This should start the postgres database and execute it in the foreground, and we want
that because that's easier for debugging and troubleshooting errors.

If you ever need to run connect to the database you can use the following command:

```sh
docker container run --rm -it --name postgres --network host im-postgres psql -h localhost -U postgres
```

where `psql` is the console-based postgres sql client, `-h` defines the hostname and this
must be localhost because you are running it in your local machine, `-U` defines the
username and in this case we use the default `postgres` user.

## Next.js App

To run the next.js app do the following:

```sh
npm run dev
```

and that should start the app in development mode

and then you can use your browser to seed the database by supplying this URL in your
browser search bar:


```sh
http://localhost:3000/seed
```

if all goes well you should see the string:

```
Database seeded successfully
```

in your browser.

If not, checking the error code it can help you pinpoint what the problem might be.
The author of the post that I am basing this work on said that it is possible that
the seeding code `learn-nextjs/nextjs-dashboard/app/seed/route.ts` might need
further revision.

I have extended the code so that you won't need to create the `next-js-dashboard` database
yourself, but instead is handled by the code itself.

## References

The most useful post that I have found to setup a local postgres database is this [one](https://medium.com/@dekadekadeka/next-js-tutorial-with-local-database-quick-start-guide-394d48a0aada),
it was written by Deka Ambia. I am really thankful for the info and so it is only right
to give the credit to the people that put the effort in creating it for us.
