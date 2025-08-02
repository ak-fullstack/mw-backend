import { PermissionEnum } from 'src/enum/permissions.enum'; 
import { MenuItem } from 'src/config/menu.config'; 
import { ALL_MENU_ITEMS } from 'src/config/menu.config';

export function getMenuForUser(userPermissions: PermissionEnum[]): MenuItem[] {
  // If user has MASTER_PERMISSION, return all menus unfiltered
  if (userPermissions.includes(PermissionEnum.MASTER_PERMISSION)) {
    return ALL_MENU_ITEMS;
  }

  // Else filter menus based on permissions
  return ALL_MENU_ITEMS
    .map(menu => {
      const filteredSubmenus = menu.submenus.filter(sub =>
        !sub.permissions || sub.permissions.some(p => userPermissions.includes(p))
      );
      return filteredSubmenus.length ? { ...menu, submenus: filteredSubmenus } : null;
    })
    .filter(Boolean) as MenuItem[];
}