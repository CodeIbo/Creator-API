FROM ubuntu:20.04

RUN apt-get update && \
    apt-get upgrade -y  

RUN apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY /BlogApi/ /home/blog/BlogApi/
COPY /BlogPanel/ /home/blog/BlogPanel/
COPY /BlogFrontEnd/ /home/blog/BlogFrontEnd/



ENTRYPOINT [ "/bin/bash"]