import { PermissionEnum } from "src/enum/permissions.enum";

export interface MenuItem {
  label: string;
  key: string;
  submenus: {
    label: string;
    link: string;
    permissions?: PermissionEnum[]; // update here
  }[];
}

export const ALL_MENU_ITEMS: MenuItem[] = [
    {
        label: 'User Management',
        key: 'user',
        submenus: [
            {
                label: 'Roles & Permissions',
                link: '/create-role',
                permissions: [PermissionEnum.READ_ROLE]
            },
            {
                label: 'My Users',
                link: '/my-users',
                permissions: [PermissionEnum.READ_USER]
            },
        ]
    },
    {
        label: 'Dashboard',
        key: 'dashboard',
        submenus: [
            {
                label: 'Overview',
                link: '/dashboard',
                permissions: [PermissionEnum.READ_DASHBOARD]
            },
            {
                label: 'Statistics',
                link: '/admin/stats',
                permissions: [PermissionEnum.READ_DASHBOARD]
            },
        ]
    },
    {
        label: 'Customer Management',
        key: 'customers',
        submenus: [
            {
                label: 'My Customers',
                link: '/my-customers',
                permissions: [PermissionEnum.READ_CUSTOMER]
            },
        ]
    },
    {
        label: 'Inventory Management',
        key: 'inventory',
        submenus: [
            {
                label: 'Add Products',
                link: '/add-products',
                permissions: [PermissionEnum.CREATE_PRODUCT]
            },
            {
                label: 'My Products',
                link: '/my-products',
                permissions: [PermissionEnum.READ_PRODUCT]
            },
            {
                label: 'Add Stocks',
                link: '/add-stocks',
                permissions: [PermissionEnum.CREATE_STOCK]
            },
            {
                label: 'Stocks',
                link: '/stocks',
                permissions: [PermissionEnum.READ_STOCK]
            },
            {
                label: 'Stock Tracking',
                link: '/stock-tracking',
                permissions: [PermissionEnum.READ_STOCK]
            }
        ]
    },
    {
        label: 'Orders',
        key: 'orders',
        submenus: [
            { label: 'All Orders', link: '/orders', permissions: [PermissionEnum.READ_ORDER] },
            { label: 'Order Reception', link: '/order-reception', permissions: [PermissionEnum.READ_ORDER] },
            { label: 'QC Check', link: '/qc', permissions: [PermissionEnum.READ_ORDER] },
            { label: 'Assign Awb', link: '/awb', permissions: [PermissionEnum.READ_ORDER] },
            { label: 'Packed Orders', link: '/packed-orders', permissions: [PermissionEnum.READ_ORDER] },
            { label: 'Shipped Orders', link: '/shipped-orders', permissions: [PermissionEnum.READ_ORDER] },
        ]
    },
    {
        label: 'Returns',
        key: 'returns',
        submenus: [
            { label: 'All Returns', link: '/all-returns', permissions: [PermissionEnum.READ_RETURN] },
            { label: 'Return Requests', link: '/return-requests', permissions: [PermissionEnum.READ_RETURN] },
            { label: 'Received Returns', link: '/received-returns', permissions: [PermissionEnum.READ_RETURN] },
            { label: 'Waiting Approval', link: '/waiting-approval', permissions: [PermissionEnum.READ_RETURN] },
        ]
    },
    {
        label: 'Reports',
        key: 'reports',
        submenus: [
            { label: 'Order Reports', link: '/order-reports', permissions: [PermissionEnum.READ_REPORTS] },
            { label: 'EOD Report', link: '/eod-reports', permissions: [PermissionEnum.READ_REPORTS] },
        ]
    },
     {
        label: 'Settings',
        key: 'settings',
        submenus: [
            { label: 'Order Settings', link: '/order-settings', permissions: [PermissionEnum.READ_SETTINGS] },
        ]
    },

];