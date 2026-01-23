export interface IUserRepository {
  create(data: any): Promise<any>
  findByEmail(email: string): Promise<any>
  exists(email: string): Promise<boolean>
}
