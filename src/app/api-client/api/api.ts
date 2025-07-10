export * from './address.service';
import { AddressService } from './address.service';
export * from './auth.service';
import { AuthService } from './auth.service';
export * from './projects.service';
import { ProjectsService } from './projects.service';
export * from './users.service';
import { UsersService } from './users.service';
export const APIS = [AddressService, AuthService, ProjectsService, UsersService];
