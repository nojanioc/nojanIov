export interface UserDevice {
  name: string;
  ip: string;
}

export interface UserData {
  username: string;
  email: string;
  role: string;
  devices: UserDevice[];
}
