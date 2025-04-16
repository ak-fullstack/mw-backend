export enum PermissionEnum  {
    MASTER_PERMISSION= 'MASTER_PERMISSION',

    CREATE_ROLE = 'CREATE_ROLE',
    READ_ROLE = 'READ_ROLE',
    UPDATE_ROLE = 'UPDATE_ROLE',
    DELETE_ROLE = 'DELETE_ROLE',

    READ_DASHBOARD='READ_DASHBOARD',

    
    READ_PERMISSION = 'READ_PERMISSION',

    CREATE_USER = 'CREATE_USER',
    READ_USER = 'READ_USER',
    UPDATE_USER = 'UPDATE_USER',
    DELETE_USER = 'DELETE_USER',
  }

  function validateEnumUniqueness(enumObject: any) {
    const values = Object.values(enumObject);
    const uniqueValues = new Set(values);
  
    if (values.length !== uniqueValues.size) {
      throw new Error('Enum contains duplicate values');
    }
  }
  
  validateEnumUniqueness(PermissionEnum );
