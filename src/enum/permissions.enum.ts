export enum PermissionEnum  {
    MASTER_PERMISSION= 'MASTER_PERMISSION',

    CREATE_ROLE = 'CREATE_ROLE',

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
