export interface RoleData {
  roleId: number
  roleName: string
}

export interface LoginData {
  id: number
  username: string
  token: string
  roles: RoleData[]
}
