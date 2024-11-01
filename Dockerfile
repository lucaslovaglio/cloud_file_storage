FROM ubuntu:latest
LABEL authors="lucky"

ENTRYPOINT ["top", "-b"]