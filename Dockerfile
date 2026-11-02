FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY backend/src ./backend/src
COPY backend/data ./backend/data

WORKDIR /app/backend

RUN mkdir -p bin && javac -d bin src/util/*.java src/model/*.java src/repository/*.java src/service/*.java src/controller/*.java src/Main.java

EXPOSE 8080

CMD ["java", "-cp", "bin", "Main"]