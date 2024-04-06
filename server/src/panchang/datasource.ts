import {
  DataSource,
  ListFindQuery,
  Mutation,
  PaginatedResponse,
  Where,
} from "@grapi/server";
import { PanchangCalculatorService } from "./calculator";

export default class PanchangDataSource implements DataSource {
  private readonly panchangService: PanchangCalculatorService;
  constructor() {
    console.log("PanchangDataSource constructor");
    this.panchangService = new PanchangCalculatorService();
  }
  async find(args?: ListFindQuery): Promise<PaginatedResponse> {
    console.log("PanchangDataSource find");
    return {
      data: [],
      total: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    };
  }
  async findOne({ where }: { where: Where }): Promise<unknown> {
    console.log("PanchangDataSource findOne", where);
    const forDate = new Date(where.date.eq);
    const panchang = this.panchangService.calculate(forDate);
    return {
      date: forDate,
      ayanamsa: panchang.Ayanamsa,
      raasi: panchang.Raasi,
      tithi: panchang.Tithi,
      tithiStart: panchang.Tithi_Start,
      tithiEnd: panchang.Tithi_End,
      vaara: panchang.Vaara,
      nakshatra: panchang.Nakshatra,
      nakshatraStart: panchang.Nakshatra_Start,
      nakshatraEnd: panchang.Nakshatra_End,
      yoga: panchang.Yoga,
      yogaStart: panchang.Yoga_Start,
      yogaEnd: panchang.Yoga_End,
      karana: panchang.Karana,
      karanaStart: panchang.Karana_Start,
      karanaEnd: panchang.Karana_End,
    };
  }
  async findOneById(id: string): Promise<any> {
    console.log("PanchangDataSource findOneById");
    return {};
  }
  async create(mutation: Mutation): Promise<unknown> {
    console.log("PanchangDataSource create");
    return {};
  }
  async update(where: Where, mutation: Mutation): Promise<any> {
    console.log("PanchangDataSource update");
    return {};
  }
  async delete(where: Where): Promise<void> {
    console.log("PanchangDataSource delete");
  }
  async findOneByRelation(
    foreignKey: string,
    foreignId: string
  ): Promise<unknown> {
    console.log("PanchangDataSource findOneByRelation");
    return {};
  }
  async updateOneRelation(
    id: string,
    foreignKey: string,
    foreignId: string
  ): Promise<void> {
    console.log("PanchangDataSource updateOneRelation");
  }
  async findManyFromOneRelation({
    where,
    orderBy,
  }: ListFindQuery): Promise<any[]> {
    console.log("PanchangDataSource findManyFromOneRelation");
    return [];
  }
  async findManyFromManyRelation(
    sourceSideName: string,
    targetSideName: string,
    sourceSideId: string,
    { where, orderBy }: ListFindQuery
  ): Promise<any[]> {
    console.log("PanchangDataSource findManyFromManyRelation");
    return [];
  }
  async addIdToManyRelation(
    sourceSideName: string,
    targetSideName: string,
    sourceSideId: string,
    targetSideId: string
  ): Promise<void> {
    console.log("PanchangDataSource addIdToManyRelation");
  }
  async removeIdFromManyRelation(
    sourceSideName: string,
    targetSideName: string,
    sourceSideId: string,
    targetSideId: string
  ): Promise<void> {
    console.log("PanchangDataSource removeIdFromManyRelation");
  }
}
