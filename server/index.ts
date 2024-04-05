import { readFileSync } from "fs";
import { resolve, join } from "path";
import { MongodbDataSourceGroup } from "@grapi/mongodb";
import { Grapi } from "@grapi/server";
import { ApolloServer } from "apollo-server-express";
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginDrainHttpServer,
} from "apollo-server-core";
import http from "http";
import cors from "cors";
import express, { Express } from "express";

import dotenv from "dotenv";
import TestQueryPlugin from "./src/test-plugin";

dotenv.config();

const PORT = process.env.PORT || 4000;

const getDataSource = async () => {
  const uri = process.env.MONGO_URI || "";
  const db = process.env.MONGO_DATA_BASE_NAME || "";
  // console.log(uri, db)
  const datasource = new MongodbDataSourceGroup(uri, db);
  await datasource.initialize();
  console.log("connected to database");
  return datasource;
};

const startGraphQLServer = async (expressApp: Express) => {
  const httpServer = http.createServer(expressApp);

  const datasource = await getDataSource();
  const sdl = readFileSync(
    resolve(__dirname, "./src/graphql", "schema.graphql"),
    { encoding: "utf8" }
  ).toString();
  const grapi = new Grapi({
    sdl,
    dataSources: {
      datasource: (args) => datasource.getDataSource(args.key),
    },
    // plugins: [new TestQueryPlugin()],
  });
  const apolloConfig = grapi.createApolloConfig();
  // const plugins = apolloConfig.plugins?.filter(o => o === ApolloServerPluginLandingPageLocalDefault)
  // plugins?.push(ApolloServerPluginLandingPageGraphQLPlayground)
  // apolloConfig.plugins = plugins
  apolloConfig.plugins = [
    ApolloServerPluginLandingPageGraphQLPlayground,
    ApolloServerPluginDrainHttpServer({ httpServer }),
  ];
  const server = new ApolloServer(apolloConfig);

  await server.start();
  server.applyMiddleware({ app: expressApp });
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: PORT }, resolve)
  );

  console.log(`🚀 UI ready at http://localhost:${PORT}`);
  console.log(
    `🚀 API running at http://localhost:${PORT}${server.graphqlPath}`
  );

  // server.listen().then(({ url }) => {
  //   console.info(`GraphQL Server On: ${url}`)
  //   console.info(`Go To Browser And See PlayGround`)
  // })

  return server;
};

(async () => {
  const expressApp = express();

  // expressApp.options('*', cors)
  const allowedOrigins = [
    "http://localhost:3000",
    "http://mathub.kube.terabits.io/",
  ];
  const options: cors.CorsOptions = {
    origin: allowedOrigins,
  };
  expressApp.use(cors(options));

  const apolloServer = await startGraphQLServer(expressApp);

  // serve UI
  expressApp.use(
    express.static(
      process.env.APP_WEB || join(__dirname, "../", "client", "build")
    )
  );

  // Handles any requests that don't match the ones above
  expressApp.get("*", (req, res) => {
    res.sendFile(
      process.env.APP_WEB
        ? join(process.env.APP_WEB, "index.html")
        : join(__dirname, "../", "client", "build", "index.html")
    );
  });

  // curl -H "Origin: http://mathub-ui.kube.local.io" --head http://mathub-api.kube.local.io/graphql
})();
