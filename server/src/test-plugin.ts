import {
  Context,
  ListReadable,
  MapReadable,
  Model,
  Plugin,
  QueryPlugin,
} from "@grapi/server";
// import { IObjectTypeResolver, IResolvers } from 'graphql-tools';

// Register the plugin Sequence
// TestQuery Plugin - resolveInRoot
// TestQuery Plugin - resolveInQuery
// TestQuery Plugin - extendTypes
// TestQuery Plugin - setPlugins
// TestQuery Plugin - visitModel

// Runtime execution plugin sequence
// TestQuery Plugin - resolveInRoot - resolver

export default class TestQueryPlugin implements Plugin {
  setPlugins(plugins: Plugin[]): void {
    console.log("TestQuery Plugin - setPlugins");
  }

  visitModel(model: Model, context: Context): void {
    const { root } = context;
    console.log("TestQuery Plugin - visitModel");
    if (model.getName() === "Test") {
      root.addQuery(`fieldTest: String`);
    }
  }

  public resolveInQuery({
    model,
    dataSource,
  }: {
    model: Model;
    dataSource: ListReadable & MapReadable;
  }): any {
    console.log("TestQuery Plugin - resolveInQuery");
    if (model.getName() === "Test") {
      return {
        fieldTest: async (root: any, args: any, context: any): Promise<any> => {
          console.log("TestQuery Plugin - resolveInQuery - resolver");
          // console.log( root, args, context )
          return "sample value";
        },
      };
    }
  }

  resolveInRoot({
    model,
    dataSource,
  }: {
    model: Model;
    dataSource: ListReadable & MapReadable;
  }): any {
    console.log("TestQuery Plugin - resolveInRoot");
    if (model.getName() === "Test") {
      return {
        Test: {
          createdAt: async (
            root: any,
            args: any,
            context: any
          ): Promise<any> => {
            console.log("TestQuery Plugin - resolveInRoot - resolver");
            // console.log( root, args, context )
            return root?.createdAt;
          },
        },
      };
    }
  }

  extendTypes(model: Model): any {
    if (model.getName() === "Test") {
      console.log("TestQuery Plugin - extendTypes");
      // return {
      //   'Query.tests': 'Query.customTests',
      // }
    }
  }
}
