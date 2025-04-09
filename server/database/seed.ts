import { Role, Right, RoleRight } from './schema'

const roles = ['user', 'moderator', 'admin']

const rights = [
  'tweet:create:own',
  'tweet:edit:own',
  'tweet:delete:own',
  'tweet:edit:any',
  'tweet:delete:any',
  'comment:create:own',
  'comment:edit:own',
  'comment:delete:own',
  'comment:edit:any',
  'comment:delete:any',
]

const roleRightsMap: Record<string, string[]> = {
  user: [
    'tweet:create:own',
    'tweet:edit:own',
    'tweet:delete:own',
    'comment:create:own',
    'comment:edit:own',
    'comment:delete:own',
  ],
  moderator: [
    'tweet:edit:any',
    'tweet:delete:any',
    'comment:edit:any',
    'comment:delete:any',
  ],
  admin: [...rights],
}

export const seedInitialRolesAndRights = async () => {
  try {
    const createdRights = await Promise.all(
      rights.map(name =>
        Right.findOrCreate({ where: { name }, defaults: { name } })
      )
    )

    const createdRoles = await Promise.all(
      roles.map(name =>
        Role.findOrCreate({ where: { name }, defaults: { name } })
      )
    )

    for (const [roleName, rightNames] of Object.entries(roleRightsMap)) {
      const [role] = await Role.findOrCreate({ where: { name: roleName } })

      for (const rightName of rightNames) {
        const [right] = await Right.findOrCreate({ where: { name: rightName } })

        await RoleRight.findOrCreate({
          where: {
            roleId: role.getDataValue('id'),
            rightId: right.getDataValue('id'),
          },
          defaults: {
            roleId: role.getDataValue('id'),
            rightId: right.getDataValue('id'),
          },
        })
      }
    }

    console.log('✅ Rollen und Rechte wurden erfolgreich erstellt.')
  } catch (error) {
    console.error('❌ Fehler beim Erstellen von Rollen und Rechten:', error)
  }
}
