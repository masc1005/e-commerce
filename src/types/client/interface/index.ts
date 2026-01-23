export interface IClientRepository {
  create(data: any): Promise<any>
  findById(id: string): Promise<any>
  findAll(): Promise<any[]>
  update(id: string, data: any): Promise<any>
  delete(id: string): Promise<any>
}
