FROM postgres:latest
ENV POSTGRES_HOST_AUTH_METHOD trust
ENV POSTGRES_PASSWORD pass 
ADD pg_hba.conf /var/lib/pgsql/data/
ADD server.key /var/lib/postgresql/
ADD server.crt /var/lib/postgresql/
RUN chmod 400 /var/lib/postgresql/server.crt
USER postgres
RUN initdb
RUN echo "log_min_messages = DEBUG" >> "/var/lib/postgresql/data/postgresql.conf"
RUN echo "log_error_verbosity = verbose" >> "/var/lib/postgresql/data/postgresql.conf"
CMD postgres -d 3
